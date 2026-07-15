import { beforeEach, describe, expect, it, rstest } from '@rstest/core';
import type { Tensor } from 'onnxruntime-web';

import { SessionRunTimeoutError } from './errors';
import { SegmentAnythingEncoder } from './segment-anything-encoder';

const inputTensor = { dispose: rstest.fn() } as unknown as Tensor;

rstest.mock('./pre-processing', () => ({
    OpenCVPreprocessor: class {
        process() {
            return { tensor: inputTensor, newWidth: 10, newHeight: 5 };
        }
    },
}));

const createOutput = () =>
    ({
        dims: [1, 2],
        dispose: rstest.fn(),
        getData: rstest.fn(async () => new Float32Array([1, 2])),
        type: 'float32',
    }) as unknown as Tensor;

const deferred = () => {
    let resolve!: () => void;
    const promise = new Promise<void>((promiseResolve) => {
        resolve = promiseResolve;
    });
    return { promise, resolve };
};

describe('SegmentAnythingEncoder', () => {
    beforeEach(() => inputTensor.dispose.mockClear());

    it('materializes and disposes input and output tensors', async () => {
        const output = createOutput();
        const session = {
            run: async (_feeds: unknown, consume: (output: unknown, outputNames: string[]) => Promise<unknown>) =>
                consume({ embedding: output }, ['embedding']),
        };
        const encoder = new SegmentAnythingEncoder({} as never, {} as never, session);

        const result = await encoder.processEncoder({ width: 20, height: 10 } as ImageData);

        expect(result.encoderResult.data).toEqual(new Float32Array([1, 2]));
        expect(result.encoderResult.data).not.toBe(await output.getData());
        expect(inputTensor.dispose).toHaveBeenCalledTimes(1);
        expect(output.dispose).toHaveBeenCalledTimes(1);
    });

    it('disposes the input when the run rejects', async () => {
        const encoder = new SegmentAnythingEncoder({} as never, {} as never, {
            run: async () => {
                throw new Error('run failed');
            },
        });

        await expect(encoder.processEncoder({ width: 20, height: 10 } as ImageData)).rejects.toThrow('run failed');
        expect(inputTensor.dispose).toHaveBeenCalledTimes(1);
    });

    it('reports and disposes missing encoder outputs', async () => {
        const encoder = new SegmentAnythingEncoder({} as never, {} as never, {
            run: async (_feeds: unknown, consume: (output: unknown, outputNames: string[]) => Promise<unknown>) =>
                consume({}, ['embedding']),
        });

        await expect(encoder.processEncoder({ width: 20, height: 10 } as ImageData)).rejects.toThrow(
            "Segment Anything encoder missing 'embedding' output"
        );
        expect(inputTensor.dispose).toHaveBeenCalledTimes(1);
    });

    it('keeps the input alive until a timed-out ORT run settles', async () => {
        const settled = deferred();
        const encoder = new SegmentAnythingEncoder({} as never, {} as never, {
            run: async () => {
                throw new SessionRunTimeoutError(5, settled.promise);
            },
        });

        await expect(encoder.processEncoder({ width: 20, height: 10 } as ImageData)).rejects.toThrow('timed out');
        expect(inputTensor.dispose).not.toHaveBeenCalled();

        settled.resolve();
        await settled.promise;
        await Promise.resolve();
        expect(inputTensor.dispose).toHaveBeenCalledTimes(1);
    });
});
