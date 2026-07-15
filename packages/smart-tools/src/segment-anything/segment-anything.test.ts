import { beforeEach, describe, expect, it, rstest } from '@rstest/core';

import type { OpenCVTypes } from '../opencv/interfaces';
import { SegmentAnythingValidationError, SessionRunTimeoutError } from './errors';
import type { OpenCVPreprocessorConfig } from './pre-processing';
import { SegmentAnythingModel } from './segment-anything';

type ModelSession = {
    run<T>(input: unknown, consume: (output: unknown) => Promise<T>): Promise<T>;
};

type MockSession = {
    init: ReturnType<typeof rstest.fn>;
    outputNames: ReturnType<typeof rstest.fn>;
    release: ReturnType<typeof rstest.fn>;
    reset: ReturnType<typeof rstest.fn>;
    run: ReturnType<typeof rstest.fn>;
};

rstest.mock('./session', () => {
    const sessionInstances: MockSession[] = [];

    class Session {
        init = rstest.fn(async () => undefined);
        outputNames = rstest.fn(() => ['output']);
        release = rstest.fn(async () => undefined);
        reset = rstest.fn(async () => undefined);
        run = rstest.fn(async () => ({}));

        constructor() {
            sessionInstances.push(this);
        }
    }

    return { Session, sessionInstances };
});

rstest.mock('./segment-anything-encoder', () => ({
    SegmentAnythingEncoder: class {
        constructor(
            _cv: unknown,
            _config: unknown,
            private session: ModelSession
        ) {}

        processEncoder(input: { consume?: (output: unknown) => Promise<unknown> }): Promise<unknown> {
            return this.session.run({ kind: 'encoder' }, input.consume ?? (async (output) => output));
        }
    },
}));

rstest.mock('./segment-anything-decoder', () => ({
    SegmentAnythingDecoder: class {
        constructor(
            _cv: unknown,
            private session: ModelSession
        ) {}

        process(): Promise<unknown> {
            return this.session.run({ kind: 'decoder' }, async (output) => output);
        }
    },
}));

const deferred = <T>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((promiseResolve) => {
        resolve = promiseResolve;
    });
    return { promise, resolve };
};

const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

const sessions = async (): Promise<MockSession[]> => {
    const module = (await import('./session')) as unknown as { sessionInstances: MockSession[] };
    return module.sessionInstances;
};

const createModel = () =>
    new SegmentAnythingModel(
        {} as OpenCVTypes.cv,
        new Map([
            ['encoder', '/encoder.onnx'],
            ['decoder', '/decoder.onnx'],
        ]),
        {} as OpenCVPreprocessorConfig
    );

const emptyResult = { areas: [], maxContourIdx: 0, shapes: [] };

describe('SegmentAnythingModel', () => {
    beforeEach(async () => {
        (await sessions()).length = 0;
    });

    it('shares concurrent initialization', async () => {
        const model = createModel();

        await Promise.all([
            model.init('SEGMENT_ANYTHING_ENCODER'),
            model.init('SEGMENT_ANYTHING_ENCODER'),
            model.init('SEGMENT_ANYTHING_ENCODER'),
        ]);

        expect(await sessions()).toHaveLength(1);
        expect((await sessions())[0].init).toHaveBeenCalledTimes(1);
    });

    it('serializes encoder and decoder runs through one model-wide lock', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        await model.init('SEGMENT_ANYTHING_DECODER');
        const [encoder, decoder] = await sessions();
        const firstRun = deferred<unknown>();
        encoder.run.mockImplementation(() => firstRun.promise);
        decoder.run.mockResolvedValue(emptyResult);

        const encoding = model.processEncoder({} as ImageData);
        const decoding = model.processDecoder({} as never, {} as never);
        await flush();

        expect(encoder.run).toHaveBeenCalledTimes(1);
        expect(decoder.run).not.toHaveBeenCalled();

        firstRun.resolve({});
        await encoding;
        await expect(decoding).resolves.toEqual(emptyResult);
        expect(decoder.run).toHaveBeenCalledTimes(1);
    });

    it('keeps the lock until output materialization completes', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        await model.init('SEGMENT_ANYTHING_DECODER');
        const [encoder, decoder] = await sessions();
        const materialization = deferred<unknown>();
        encoder.run.mockResolvedValue({ output: true });
        decoder.run.mockResolvedValue(emptyResult);

        const first = model.processEncoder({ consume: async () => materialization.promise } as unknown as ImageData);
        const second = model.processDecoder({} as never, {} as never);
        await flush();

        expect(decoder.run).not.toHaveBeenCalled();
        materialization.resolve({ done: true });
        await first;
        await second;
        expect(decoder.run).toHaveBeenCalledTimes(1);
    });

    it('recovers when output materialization reports device loss', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        const [encoder] = await sessions();
        encoder.run.mockResolvedValueOnce({ attempt: 1 }).mockResolvedValueOnce({ attempt: 2 });
        let attempts = 0;

        const result = await model.processEncoder({
            consume: async (output: unknown) => {
                attempts++;
                if (attempts === 1) throw new Error('WebGPU device lost while downloading output');
                return output;
            },
        } as unknown as ImageData);

        expect(result).toEqual({ attempt: 2 });
        expect(encoder.reset).toHaveBeenCalledWith({ executionProviders: ['cpu'] });
    });

    it('releases the lock after rejection and does not recover benign errors', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        const [encoder] = await sessions();
        encoder.run
            .mockRejectedValueOnce(new SegmentAnythingValidationError('invalid shape'))
            .mockResolvedValueOnce({ ok: true });

        await expect(model.processEncoder({} as ImageData)).rejects.toThrow('invalid shape');
        await expect(model.processEncoder({} as ImageData)).resolves.toEqual({ ok: true });
        expect(encoder.reset).not.toHaveBeenCalled();
    });

    it('recovers a fatal failure once and retries the run', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        const [encoder] = await sessions();
        encoder.run.mockRejectedValueOnce(new Error('memory access out of bounds')).mockResolvedValueOnce({ ok: true });

        await expect(model.processEncoder({} as ImageData)).resolves.toEqual({ ok: true });

        expect(encoder.reset).toHaveBeenCalledTimes(1);
        expect(encoder.run).toHaveBeenCalledTimes(2);
    });

    it('shares the recovered session with work queued during recovery', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        const [encoder] = await sessions();
        encoder.run
            .mockRejectedValueOnce(new Error('WebGPU device lost'))
            .mockResolvedValueOnce({ recovered: true })
            .mockResolvedValueOnce({ queued: true });

        const results = await Promise.all([
            model.processEncoder({} as ImageData),
            model.processEncoder({} as ImageData),
        ]);

        expect(results).toEqual([{ recovered: true }, { queued: true }]);
        expect(encoder.reset).toHaveBeenCalledTimes(1);
    });

    it('uses CPU recovery for JSEP failures and propagates a failed retry', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        const [encoder] = await sessions();
        encoder.run.mockRejectedValue(new Error('Failed to run JSEP kernel'));

        await expect(model.processEncoder({} as ImageData)).rejects.toThrow('Failed to run JSEP kernel');

        expect(encoder.reset).toHaveBeenCalledTimes(1);
        expect(encoder.reset).toHaveBeenCalledWith({ executionProviders: ['cpu'] });
        expect(encoder.run).toHaveBeenCalledTimes(2);
    });

    it('keeps queued work blocked until a timed-out run settles and recovery completes', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        const [encoder] = await sessions();
        const underlyingRun = deferred<void>();
        const timeout = new SessionRunTimeoutError(5, underlyingRun.promise);
        encoder.run.mockRejectedValueOnce(timeout).mockResolvedValueOnce({ queued: true });

        const timedOut = model.processEncoder({} as ImageData);
        const queued = model.processEncoder({} as ImageData);
        await expect(timedOut).rejects.toBe(timeout);
        await flush();

        expect(encoder.run).toHaveBeenCalledTimes(1);
        expect(encoder.reset).not.toHaveBeenCalled();

        underlyingRun.resolve();
        await expect(queued).resolves.toEqual({ queued: true });
        expect(encoder.reset).toHaveBeenCalledTimes(1);
    });

    it('keeps all interleaved runs non-overlapping', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');
        await model.init('SEGMENT_ANYTHING_DECODER');
        const modelSessions = await sessions();
        let activeRuns = 0;
        let maxActiveRuns = 0;
        const run = async (input: { kind: string }) => {
            activeRuns++;
            maxActiveRuns = Math.max(maxActiveRuns, activeRuns);
            await Promise.resolve();
            activeRuns--;
            return input.kind === 'decoder' ? emptyResult : {};
        };
        modelSessions.forEach((session) => session.run.mockImplementation(run));

        await Promise.all(
            Array.from({ length: 100 }, (_, index) =>
                index % 2 === 0 ? model.processEncoder({} as ImageData) : model.processDecoder({} as never, {} as never)
            )
        );

        expect(maxActiveRuns).toBe(1);
    });

    it('normalizes the selected result index after filtering to one shape', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_DECODER');
        const [decoder] = await sessions();
        const selectedShape = { shapeType: 'polygon', points: [] };
        decoder.run.mockResolvedValue({
            areas: [1, 5],
            maxContourIdx: 1,
            shapes: [{ shapeType: 'polygon', points: [{ x: 0, y: 0 }] }, selectedShape],
        });

        await expect(model.processDecoder({} as never, {} as never)).resolves.toEqual({
            areas: [5],
            maxContourIdx: 0,
            shapes: [selectedShape],
        });
    });
});
