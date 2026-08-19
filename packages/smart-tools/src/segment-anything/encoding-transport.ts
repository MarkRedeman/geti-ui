import type { EncodingOutput } from './segment-anything-encoder';

// The encoder always sees a 1024x1024 canvas, so the embedding is fixed-size and the
// longest side of the resized (pre-pad) image is always exactly 1024.
const SAM_INPUT_SIZE = 1024;
const EMBEDDING_DIMS = [1, 256, 64, 64];
const EMBEDDING_BYTES = EMBEDDING_DIMS.reduce((total, dim) => total * dim, 1) * Float32Array.BYTES_PER_ELEMENT;
const EMBEDDING_TENSOR_NAME = 'image_embeddings';

const HEADER_LENGTH_BYTES = 8;

export class InvalidEncodingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidEncodingError';
    }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const readSize = (metadata: Record<string, unknown>, key: string): number => {
    const raw = metadata[key];
    const size = typeof raw === 'string' ? Number(raw) : raw;

    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
        throw new InvalidEncodingError(`Embedding metadata "${key}" must be a positive integer, got ${String(raw)}.`);
    }

    return size;
};

/**
 * Turn a server-computed image embedding into the same {@link EncodingOutput} that
 * `processEncoder` produces locally, so the decoder is indifferent to where encoding ran.
 *
 * @throws {InvalidEncodingError} when the payload does not match the agreed contract.
 */
export const parseEncoding = (buffer: ArrayBuffer): EncodingOutput => {
    if (buffer.byteLength < HEADER_LENGTH_BYTES) {
        throw new InvalidEncodingError(`Payload is too small to be a safetensors buffer (${buffer.byteLength} bytes).`);
    }

    const headerLength = Number(new DataView(buffer).getBigUint64(0, true));
    const dataStart = HEADER_LENGTH_BYTES + headerLength;

    if (!Number.isSafeInteger(headerLength) || headerLength <= 0 || dataStart > buffer.byteLength) {
        throw new InvalidEncodingError(`Safetensors header length is invalid (${headerLength}).`);
    }

    let header: unknown;
    try {
        header = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, HEADER_LENGTH_BYTES, headerLength)));
    } catch {
        throw new InvalidEncodingError('Safetensors header is not valid JSON.');
    }

    if (!isRecord(header)) {
        throw new InvalidEncodingError('Safetensors header is not a JSON object.');
    }

    const entry = header[EMBEDDING_TENSOR_NAME];

    if (!isRecord(entry)) {
        const names = Object.keys(header).filter((name) => name !== '__metadata__');

        throw new InvalidEncodingError(
            `Payload has no "${EMBEDDING_TENSOR_NAME}" tensor (found: ${names.join(', ') || 'none'}).`
        );
    }

    // fp16 would halve the payload, but it is a later, non-breaking addition; v1 is fp32.
    if (entry['dtype'] !== 'F32') {
        throw new InvalidEncodingError(`Unsupported embedding dtype "${String(entry['dtype'])}", expected F32.`);
    }

    const shape = entry['shape'];

    if (!Array.isArray(shape) || shape.join() !== EMBEDDING_DIMS.join()) {
        throw new InvalidEncodingError(`Expected an embedding of shape [${EMBEDDING_DIMS}], got [${shape}].`);
    }

    const offsets = entry['data_offsets'];

    if (
        !Array.isArray(offsets) ||
        offsets.length !== 2 ||
        !offsets.every((offset) => Number.isSafeInteger(offset) && offset >= 0)
    ) {
        throw new InvalidEncodingError(`Embedding tensor has invalid "data_offsets" (${JSON.stringify(offsets)}).`);
    }

    // `slice` both copies (so the result is JS-owned and safe to transfer across a
    // Comlink boundary) and guarantees the alignment a typed-array view needs.
    const bytes = buffer.slice(dataStart + offsets[0], dataStart + offsets[1]);

    if (bytes.byteLength !== EMBEDDING_BYTES) {
        throw new InvalidEncodingError(`Expected ${EMBEDDING_BYTES} bytes of embedding, got ${bytes.byteLength}.`);
    }

    const metadata = header['__metadata__'];

    if (!isRecord(metadata)) {
        throw new InvalidEncodingError('Embedding payload is missing its "__metadata__" section.');
    }

    const originalWidth = readSize(metadata, 'original_width');
    const originalHeight = readSize(metadata, 'original_height');
    const newWidth = readSize(metadata, 'new_width');
    const newHeight = readSize(metadata, 'new_height');

    // The server must repeat the client's aspect-preserving resize to a 1024px long side;
    // a squash to 1024x1024 or a shortest-side resize silently shifts every prompt.
    const scale = SAM_INPUT_SIZE / Math.max(originalWidth, originalHeight);
    const isLandscape = originalWidth > originalHeight;
    const expectedWidth = isLandscape ? SAM_INPUT_SIZE : Math.ceil(originalWidth * scale);
    const expectedHeight = isLandscape ? Math.ceil(originalHeight * scale) : SAM_INPUT_SIZE;

    // A pixel of slack, so a server that rounds where we ceil still passes.
    if (Math.abs(newWidth - expectedWidth) > 1 || Math.abs(newHeight - expectedHeight) > 1) {
        throw new InvalidEncodingError(
            `Expected ${originalWidth}x${originalHeight} to resize to about ` +
                `${expectedWidth}x${expectedHeight}, got ${newWidth}x${newHeight}.`
        );
    }

    return {
        encoderResult: { data: new Float32Array(bytes), dims: [...EMBEDDING_DIMS], type: 'float32' },
        originalWidth,
        originalHeight,
        newWidth,
        newHeight,
    };
};
