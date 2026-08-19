import { describe, expect, it } from '@rstest/core';

import { InvalidEncodingError, parseEncoding } from './encoding-transport';

const EMBEDDING_ELEMENTS = 1 * 256 * 64 * 64;

type Header = Record<string, unknown>;

const buildPayload = (header: Header, data: ArrayBuffer): ArrayBuffer => {
    const headerBytes = new TextEncoder().encode(JSON.stringify(header));
    const buffer = new ArrayBuffer(8 + headerBytes.byteLength + data.byteLength);

    new DataView(buffer).setBigUint64(0, BigInt(headerBytes.byteLength), true);
    new Uint8Array(buffer).set(headerBytes, 8);
    new Uint8Array(buffer).set(new Uint8Array(data), 8 + headerBytes.byteLength);

    return buffer;
};

const metadata = {
    original_width: '1600',
    original_height: '900',
    new_width: '1024',
    new_height: '576',
};

const buildValidPayload = (overrides?: Header): ArrayBuffer => {
    const data = new Float32Array(EMBEDDING_ELEMENTS).buffer;

    return buildPayload(
        {
            __metadata__: metadata,
            image_embeddings: { dtype: 'F32', shape: [1, 256, 64, 64], data_offsets: [0, data.byteLength] },
            ...overrides,
        },
        data
    );
};

describe('parseEncoding', () => {
    it('parses a float32 embedding into the shape the decoder expects', () => {
        const payload = buildValidPayload();
        new Float32Array(payload, payload.byteLength - EMBEDDING_ELEMENTS * 4).set([1.5, -2.25], 0);

        const encoding = parseEncoding(payload);

        expect(encoding.encoderResult.dims).toEqual([1, 256, 64, 64]);
        expect(encoding.encoderResult.type).toBe('float32');
        expect(encoding.encoderResult.data).toBeInstanceOf(Float32Array);
        expect(encoding.encoderResult.data.length).toBe(EMBEDDING_ELEMENTS);
        expect(Array.from(encoding.encoderResult.data.slice(0, 2))).toEqual([1.5, -2.25]);
        expect(encoding).toMatchObject({
            originalWidth: 1600,
            originalHeight: 900,
            newWidth: 1024,
            newHeight: 576,
        });
    });

    it('survives a structured clone, so it can cross a worker boundary', () => {
        const encoding = structuredClone(parseEncoding(buildValidPayload()));

        // jsdom clones into another realm, so `toBeInstanceOf` would fail on a valid clone.
        expect(Object.prototype.toString.call(encoding.encoderResult.data)).toBe('[object Float32Array]');
        expect(encoding.encoderResult.data.length).toBe(EMBEDDING_ELEMENTS);
        expect(encoding.encoderResult.dims).toEqual([1, 256, 64, 64]);
        expect(encoding.newWidth).toBe(1024);
    });

    it('rejects a payload that is not a safetensors buffer', () => {
        expect(() => parseEncoding(new ArrayBuffer(4))).toThrow(InvalidEncodingError);
        expect(() => parseEncoding(new ArrayBuffer(32))).toThrow(InvalidEncodingError);
    });

    it('rejects an embedding whose shape is not the SAM 1 embedding', () => {
        const payload = buildValidPayload({
            image_embeddings: { dtype: 'F32', shape: [1, 256, 32, 32], data_offsets: [0, EMBEDDING_ELEMENTS * 4] },
        });

        expect(() => parseEncoding(payload)).toThrow(/shape/i);
    });

    it('names the tensors it did find when the embedding is missing', () => {
        const payload = buildPayload(
            { __metadata__: metadata, image_embed: { dtype: 'F32', shape: [1], data_offsets: [0, 4] } },
            new Float32Array(1).buffer
        );

        expect(() => parseEncoding(payload)).toThrow(/image_embed/);
    });

    it('rejects an unsupported dtype', () => {
        const payload = buildValidPayload({
            image_embeddings: { dtype: 'F16', shape: [1, 256, 64, 64], data_offsets: [0, EMBEDDING_ELEMENTS * 2] },
        });

        expect(() => parseEncoding(payload)).toThrow(/dtype/i);
    });

    it('rejects a truncated embedding', () => {
        const payload = buildPayload(
            {
                __metadata__: metadata,
                image_embeddings: { dtype: 'F32', shape: [1, 256, 64, 64], data_offsets: [0, EMBEDDING_ELEMENTS * 4] },
            },
            new Float32Array(EMBEDDING_ELEMENTS - 1).buffer
        );

        expect(() => parseEncoding(payload)).toThrow(InvalidEncodingError);
    });

    it('requires the size metadata the decoder scales prompt coordinates with', () => {
        // `JSON.stringify` drops the key, leaving the rest of the metadata intact.
        const payload = buildValidPayload({ __metadata__: { ...metadata, new_width: undefined } });

        expect(() => parseEncoding(payload)).toThrow(/new_width/);
    });

    it('rejects a resize that does not match the client preprocessing', () => {
        const payload = buildValidPayload({ __metadata__: { ...metadata, new_width: '576', new_height: '324' } });

        expect(() => parseEncoding(payload)).toThrow(/resize/i);
    });

    it('rejects a square resize that ignores the original aspect ratio', () => {
        const payload = buildValidPayload({ __metadata__: { ...metadata, new_height: '1024' } });

        expect(() => parseEncoding(payload)).toThrow(/1024x576, got 1024x1024/);
    });
});
