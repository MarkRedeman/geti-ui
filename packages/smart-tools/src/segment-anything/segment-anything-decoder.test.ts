import { describe, expect, it, rstest } from '@rstest/core';
import { Tensor } from 'onnxruntime-web';

import { SessionRunTimeoutError } from './errors';
import { SegmentAnythingDecoder } from './segment-anything-decoder';

type MockTensor = Tensor & { dispose: ReturnType<typeof rstest.fn> };

rstest.mock('onnxruntime-web', () => ({
    Tensor: class {
        data: ArrayLike<number>;
        dims: readonly number[];
        dispose = rstest.fn();
        getData = rstest.fn(async () => this.data);
        type = 'float32' as const;

        constructor(typeOrData: unknown, dataOrDims: unknown, maybeDims?: readonly number[]) {
            if (typeof typeOrData === 'string') {
                this.data = dataOrDims as ArrayLike<number>;
                this.dims = maybeDims ?? [];
            } else {
                this.data = typeOrData as ArrayLike<number>;
                this.dims = dataOrDims as readonly number[];
            }
        }
    },
}));

rstest.mock('./post-processing', () => ({
    PostProcessor: class {
        maskToAnnotationShape() {
            return { areas: [], maxContourIdx: 0, shapes: [] };
        }
    },
}));

const encodingOutput = {
    encoderResult: { data: new Float32Array([1]), dims: [1], type: 'float32' as const },
    originalWidth: 1,
    originalHeight: 1,
    newWidth: 1,
    newHeight: 1,
};

const prompt = { image: undefined, points: [], boxes: [] };
const outputTensor = (data: Float32Array, dims: number[]) => new Tensor(data, dims) as MockTensor;

const deferred = () => {
    let resolve!: () => void;
    const promise = new Promise<void>((promiseResolve) => {
        resolve = promiseResolve;
    });
    return { promise, resolve };
};

describe('SegmentAnythingDecoder', () => {
    it('disposes every feed and output tensor', async () => {
        const masks = outputTensor(new Float32Array([1, 0, 0, 1]), [1, 1, 2, 2]);
        const confidence = outputTensor(new Float32Array([1]), [1, 1]);
        const lowResolutionMasks = outputTensor(new Float32Array([0]), [1]);
        let feeds: Record<string, MockTensor> | undefined;
        const session = {
            run: async (
                inputFeeds: Record<string, MockTensor>,
                consume: (output: Record<string, MockTensor>) => Promise<unknown>
            ) => {
                feeds = inputFeeds;
                return consume({ masks, iou_predictions: confidence, low_res_masks: lowResolutionMasks });
            },
        };

        await new SegmentAnythingDecoder({} as never, session as never).process(encodingOutput, prompt);

        expect(Array.from(feeds?.orig_im_size.data ?? [])).toEqual([1024, 1024]);
        expect(Object.values(feeds ?? {})).toHaveLength(6);
        Object.values(feeds ?? {}).forEach((tensor) => expect(tensor.dispose).toHaveBeenCalledTimes(1));
        [masks, confidence, lowResolutionMasks].forEach((tensor) => expect(tensor.dispose).toHaveBeenCalledTimes(1));
    });

    it('disposes feeds when the run rejects', async () => {
        let feeds: Record<string, MockTensor> | undefined;
        const decoder = new SegmentAnythingDecoder(
            {} as never,
            {
                run: async (inputFeeds: Record<string, MockTensor>) => {
                    feeds = inputFeeds;
                    throw new Error('run failed');
                },
            } as never
        );

        await expect(decoder.process(encodingOutput, prompt)).rejects.toThrow('run failed');
        expect(Object.values(feeds ?? {})).toHaveLength(6);
        Object.values(feeds ?? {}).forEach((tensor) => expect(tensor.dispose).toHaveBeenCalledTimes(1));
    });

    it('reports missing masks and disposes all returned outputs', async () => {
        const confidence = outputTensor(new Float32Array([1]), [1, 1]);
        const decoder = new SegmentAnythingDecoder(
            {} as never,
            {
                run: async (
                    _feeds: Record<string, MockTensor>,
                    consume: (output: Record<string, MockTensor>) => Promise<unknown>
                ) => consume({ iou_predictions: confidence }),
            } as never
        );

        await expect(decoder.process(encodingOutput, prompt)).rejects.toThrow(
            "Segment Anything decoder missing 'masks' output"
        );
        expect(confidence.dispose).toHaveBeenCalledTimes(1);
    });

    it('rejects invalid dimensions before creating feeds or running', async () => {
        const run = rstest.fn();
        const decoder = new SegmentAnythingDecoder({} as never, { run } as never);

        await expect(decoder.process({ ...encodingOutput, originalWidth: 0 }, prompt)).rejects.toThrow(
            'encoding dimensions must be positive and finite'
        );
        expect(run).not.toHaveBeenCalled();
    });

    it('keeps feeds alive until a timed-out ORT run settles', async () => {
        const settled = deferred();
        let feeds: Record<string, MockTensor> | undefined;
        const decoder = new SegmentAnythingDecoder(
            {} as never,
            {
                run: async (inputFeeds: Record<string, MockTensor>) => {
                    feeds = inputFeeds;
                    throw new SessionRunTimeoutError(5, settled.promise);
                },
            } as never
        );

        await expect(decoder.process(encodingOutput, prompt)).rejects.toThrow('timed out');
        Object.values(feeds ?? {}).forEach((tensor) => expect(tensor.dispose).not.toHaveBeenCalled());

        settled.resolve();
        await settled.promise;
        await Promise.resolve();
        Object.values(feeds ?? {}).forEach((tensor) => expect(tensor.dispose).toHaveBeenCalledTimes(1));
    });

    it.each([
        [[1, 1, 2], [1, 1], 'invalid output ranks'],
        [[1, 2, 2, 2], [1, 1], 'incompatible output dimensions'],
    ])('rejects incompatible decoder output dimensions', async (maskDims, confidenceDims, message) => {
        const masks = outputTensor(new Float32Array(8), maskDims as number[]);
        const confidence = outputTensor(new Float32Array(2), confidenceDims as number[]);
        const decoder = new SegmentAnythingDecoder(
            {} as never,
            {
                run: async (
                    _feeds: Record<string, MockTensor>,
                    consume: (output: Record<string, MockTensor>) => Promise<unknown>
                ) => consume({ masks, iou_predictions: confidence }),
            } as never
        );

        await expect(decoder.process(encodingOutput, prompt)).rejects.toThrow(message);
        expect(masks.dispose).toHaveBeenCalledTimes(1);
        expect(confidence.dispose).toHaveBeenCalledTimes(1);
    });
});
