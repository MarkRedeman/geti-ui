import { beforeEach, describe, expect, it, rstest } from '@rstest/core';
import { env, InferenceSession } from 'onnxruntime-web';

import { Session } from './session';

rstest.mock('onnxruntime-web', () => ({
    env: { wasm: {} },
    InferenceSession: { create: rstest.fn() },
}));

rstest.mock('../utils/tool-utils', () => ({
    loadSource: rstest.fn(async () => ({ arrayBuffer: async () => new ArrayBuffer(1) })),
}));

const createMock = InferenceSession.create as unknown as ReturnType<typeof rstest.fn>;

const deferred = <T>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((promiseResolve) => {
        resolve = promiseResolve;
    });
    return { promise, resolve };
};

const ortSession = () =>
    ({
        inputNames: ['input'],
        outputNames: ['output'],
        release: rstest.fn(async () => undefined),
        run: rstest.fn(async () => ({})),
    }) as unknown as InferenceSession;

describe('Session', () => {
    beforeEach(() => {
        createMock.mockReset();
        (env.wasm as { numThreads?: number }).numThreads = undefined;
    });

    it('shares concurrent initialization', async () => {
        createMock.mockResolvedValue(ortSession());
        const session = new Session();

        await Promise.all([session.init('/model.onnx'), session.init('/model.onnx'), session.init('/model.onnx')]);

        expect(createMock).toHaveBeenCalledTimes(1);
        expect(session.isHealthy).toBe(true);
    });

    it('configures the global ORT environment only once', async () => {
        createMock.mockResolvedValue(ortSession());
        await new Session().init('/first.onnx');
        env.wasm.numThreads = 17;

        await new Session().init('/second.onnx');

        expect(env.wasm.numThreads).toBe(17);
    });

    it('rejects reset before initialization', async () => {
        await expect(new Session().reset()).rejects.toThrow('Session.reset() called before init()');
    });

    it('replaces and releases an initialized session', async () => {
        const first = ortSession();
        const second = ortSession();
        createMock.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
        const session = new Session();
        await session.init('/model.onnx');

        await session.reset({ executionProviders: ['cpu'] });

        expect(first.release).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenLastCalledWith(
            expect.any(ArrayBuffer),
            expect.objectContaining({ executionProviders: ['cpu'] })
        );
    });

    it('reports a timeout while exposing when the underlying run is safe to replace', async () => {
        const pendingRun = deferred<InferenceSession.OnnxValueMapType>();
        const lateOutput = { dispose: rstest.fn() };
        const sessionInstance = ortSession();
        sessionInstance.run = rstest.fn(() => pendingRun.promise);
        createMock.mockResolvedValue(sessionInstance);
        const session = new Session();
        await session.init('/model.onnx', { runTimeoutMs: 5 });

        const error = await session.run({}).catch((reason: unknown) => reason);

        expect(error).toMatchObject({ name: 'SessionRunTimeoutError' });
        let safe = false;
        void error.waitUntilSafe.then(() => {
            safe = true;
        });
        expect(safe).toBe(false);

        pendingRun.resolve({ output: lateOutput } as unknown as InferenceSession.OnnxValueMapType);
        await error.waitUntilSafe;
        expect(safe).toBe(true);
        expect(lateOutput.dispose).toHaveBeenCalledTimes(1);
    });
});
