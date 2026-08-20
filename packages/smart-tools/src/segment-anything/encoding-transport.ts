import type { EncodingOutput } from './segment-anything-encoder';

// The model always runs on a 1024x1024 canvas: the image is resized so its longest side is
// 1024, then padded out to a square. So the embedding is the same size for every image.
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

/**
 * Read the JSON header of a safetensors file, plus where the data after it starts.
 *
 * A safetensors file is: 8 bytes saying how long the header is, then that many bytes of JSON,
 * then all the tensors back to back. The JSON says which bytes belong to which tensor.
 */
const readSafetensorsHeader = (buffer: ArrayBuffer): { header: Record<string, unknown>; dataStart: number } => {
    if (buffer.byteLength < HEADER_LENGTH_BYTES) {
        throw new InvalidEncodingError(`Payload is too small to be a safetensors buffer (${buffer.byteLength} bytes).`);
    }

    const headerLength = Number(new DataView(buffer).getBigUint64(0, true));
    const dataStart = HEADER_LENGTH_BYTES + headerLength;

    // In a file that is not safetensors these 8 bytes are arbitrary, so the length we read from
    // them is usually nonsense. Check it before using it to read further into the buffer.
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

    return { header, dataStart };
};

/**
 * Copy out the image embedding, after checking it is the one the decoder expects.
 *
 * The decoder reads these bytes as one fixed block of 32-bit floats, 1x256x64x64 of them. If
 * they are a different size or number format it either fails somewhere inside ONNX Runtime,
 * or produces masks that look plausible but are wrong.
 */
const readEmbeddingBytes = (header: Record<string, unknown>, buffer: ArrayBuffer, dataStart: number): ArrayBuffer => {
    const entry = header[EMBEDDING_TENSOR_NAME];

    if (!isRecord(entry)) {
        const names = Object.keys(header).filter((name) => name !== '__metadata__');

        throw new InvalidEncodingError(
            `Payload has no "${EMBEDDING_TENSOR_NAME}" tensor (found: ${names.join(', ') || 'none'}).`
        );
    }

    // Half precision (F16) would halve the download, but that can be added later; v1 is F32.
    if (entry['dtype'] !== 'F32') {
        throw new InvalidEncodingError(`Unsupported embedding dtype "${String(entry['dtype'])}", expected F32.`);
    }

    const shape = entry['shape'];

    if (!Array.isArray(shape) || shape.join() !== EMBEDDING_DIMS.join()) {
        throw new InvalidEncodingError(`Expected an embedding of shape [${EMBEDDING_DIMS}], got [${shape}].`);
    }

    const offsets = entry['data_offsets'];

    // The server picks these two positions and we read the buffer with them, so check they are
    // a real pair of positions before we do.
    if (
        !Array.isArray(offsets) ||
        offsets.length !== 2 ||
        !offsets.every((offset) => Number.isSafeInteger(offset) && offset >= 0)
    ) {
        throw new InvalidEncodingError(`Embedding tensor has invalid "data_offsets" (${JSON.stringify(offsets)}).`);
    }

    // `slice` copies, which we want twice over: the copy is ours alone, so it can be handed to
    // a worker, and it starts at 0, which is what reading it as a Float32Array requires.
    // Positions past the end of the buffer just give us fewer bytes, caught by the check below.
    const bytes = buffer.slice(dataStart + offsets[0], dataStart + offsets[1]);

    if (bytes.byteLength !== EMBEDDING_BYTES) {
        throw new InvalidEncodingError(`Expected ${EMBEDDING_BYTES} bytes of embedding, got ${bytes.byteLength}.`);
    }

    return bytes;
};

const readSize = (metadata: Record<string, unknown>, key: string): number => {
    const raw = metadata[key];
    const size = typeof raw === 'string' ? Number(raw) : raw;

    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
        throw new InvalidEncodingError(`Embedding metadata "${key}" must be a positive integer, got ${String(raw)}.`);
    }

    return size;
};

/**
 * Read the image sizes the decoder needs to turn a click into a position in the embedding.
 *
 * Nothing in the embedding records how the image was resized to fit the model. If the server
 * resized it differently than we do here, nothing fails - clicks just land in the wrong spot.
 * Redoing the sums ourselves and comparing is the only way to notice.
 */
const readImageSizes = (header: Record<string, unknown>) => {
    const metadata = header['__metadata__'];

    if (!isRecord(metadata)) {
        throw new InvalidEncodingError('Embedding payload is missing its "__metadata__" section.');
    }

    const originalWidth = readSize(metadata, 'original_width');
    const originalHeight = readSize(metadata, 'original_height');
    const newWidth = readSize(metadata, 'new_width');
    const newHeight = readSize(metadata, 'new_height');

    // The resize has to keep the aspect ratio and end up with a 1024px longest side. Stretching
    // the image to a square, or scaling by the shortest side instead, moves every click.
    const scale = SAM_INPUT_SIZE / Math.max(originalWidth, originalHeight);
    const isLandscape = originalWidth > originalHeight;
    const expectedWidth = isLandscape ? SAM_INPUT_SIZE : Math.ceil(originalWidth * scale);
    const expectedHeight = isLandscape ? Math.ceil(originalHeight * scale) : SAM_INPUT_SIZE;

    // One pixel of slack, so a server that rounds down where we round up still passes.
    if (Math.abs(newWidth - expectedWidth) > 1 || Math.abs(newHeight - expectedHeight) > 1) {
        throw new InvalidEncodingError(
            `Expected ${originalWidth}x${originalHeight} to resize to about ` +
                `${expectedWidth}x${expectedHeight}, got ${newWidth}x${newHeight}.`
        );
    }

    return { originalWidth, originalHeight, newWidth, newHeight };
};

/**
 * Turn an embedding computed on the server into the same {@link EncodingOutput} that
 * `processEncoder` builds locally, so the decoder does not care where the encoding happened.
 *
 * The checks below look heavy for a parser, and that is on purpose: an embedding that does not
 * match this image never fails on its own, it just makes the tool draw the wrong masks. This is
 * the last point where we can still tell.
 *
 * @throws {InvalidEncodingError} when the payload does not match the agreed contract.
 */
export const parseEncoding = (buffer: ArrayBuffer): EncodingOutput => {
    const { header, dataStart } = readSafetensorsHeader(buffer);
    const bytes = readEmbeddingBytes(header, buffer, dataStart);

    return {
        encoderResult: { data: new Float32Array(bytes), dims: [...EMBEDDING_DIMS], type: 'float32' },
        ...readImageSizes(header),
    };
};
