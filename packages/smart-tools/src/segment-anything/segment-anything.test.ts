import { beforeEach, describe, expect, it, rstest } from '@rstest/core';

import type { OpenCVTypes } from '../opencv/interfaces';
import type { OpenCVPreprocessorConfig } from './pre-processing';
import { SegmentAnythingModel } from './segment-anything';

type MockSession = {
    init: ReturnType<typeof rstest.fn>;
    isHealthy: boolean;
    reset: ReturnType<typeof rstest.fn>;
    run: ReturnType<typeof rstest.fn>;
};

rstest.mock('./session', () => {
    const sessionInstances: MockSession[] = [];

    class Session {
        public isHealthy = true;
        public init = rstest.fn(async () => undefined);
        public reset = rstest.fn(async () => {
            this.isHealthy = true;
        });
        public run = rstest.fn(async () => ({}));

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
            private session: MockSession
        ) {}

        public async processEncoder(): Promise<unknown> {
            return await this.session.run({});
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

const flushPromises = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

const getSessionInstances = async (): Promise<MockSession[]> => {
    const sessionModule = (await import('./session')) as unknown as { sessionInstances: MockSession[] };

    return sessionModule.sessionInstances;
};

const createModel = (): SegmentAnythingModel =>
    new SegmentAnythingModel(
        {} as typeof OpenCVTypes,
        new Map([['encoder', '/models/encoder.onnx']]),
        {} as OpenCVPreprocessorConfig
    );

describe('SegmentAnythingModel', () => {
    beforeEach(async () => {
        const sessions = await getSessionInstances();
        sessions.length = 0;
    });

    it('shares one session initialization between concurrent callers', async () => {
        const model = createModel();

        await Promise.all([
            model.init('SEGMENT_ANYTHING_ENCODER'),
            model.init('SEGMENT_ANYTHING_ENCODER'),
            model.init('SEGMENT_ANYTHING_ENCODER'),
        ]);

        const sessions = await getSessionInstances();
        expect(sessions).toHaveLength(1);
        expect(sessions[0].init).toHaveBeenCalledTimes(1);
        expect(sessions[0].init).toHaveBeenCalledWith('/models/encoder.onnx');
    });

    it('shares one reset between concurrent failures on the same unhealthy session', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');

        const [session] = await getSessionInstances();
        const resetGate = deferred<void>();
        let runCount = 0;
        session.run.mockImplementation(async () => {
            runCount++;
            if (runCount <= 2) {
                session.isHealthy = false;
                throw new Error('ORT failed');
            }

            return { runCount };
        });
        session.reset.mockImplementation(async () => {
            await resetGate.promise;
            session.isHealthy = true;
        });

        const first = model.processEncoder({} as ImageData);
        const second = model.processEncoder({} as ImageData);
        await flushPromises();

        expect(session.reset).toHaveBeenCalledTimes(1);

        resetGate.resolve();
        await expect(Promise.all([first, second])).resolves.toEqual([{ runCount: 3 }, { runCount: 4 }]);
        expect(session.run).toHaveBeenCalledTimes(4);
    });

    it('shares one CPU replacement between concurrent WebGPU failures', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');

        const [webGpuSession] = await getSessionInstances();
        webGpuSession.run.mockRejectedValue(new Error('WebGPU device lost'));

        await expect(
            Promise.all([model.processEncoder({} as ImageData), model.processEncoder({} as ImageData)])
        ).resolves.toEqual([{}, {}]);

        const sessions = await getSessionInstances();
        expect(sessions).toHaveLength(2);
        expect(webGpuSession.reset).not.toHaveBeenCalled();
        expect(sessions[1].init).toHaveBeenCalledTimes(1);
        expect(sessions[1].init).toHaveBeenCalledWith('/models/encoder.onnx', { executionProviders: ['cpu'] });
        expect(sessions[1].run).toHaveBeenCalledTimes(2);
    });

    it('propagates an unrelated failure while the session remains healthy', async () => {
        const model = createModel();
        await model.init('SEGMENT_ANYTHING_ENCODER');

        const [session] = await getSessionInstances();
        session.run.mockRejectedValue(new Error('pre-processing failed'));

        await expect(model.processEncoder({} as ImageData)).rejects.toThrow('pre-processing failed');
        expect(session.reset).not.toHaveBeenCalled();
        expect(await getSessionInstances()).toHaveLength(1);
    });
});
