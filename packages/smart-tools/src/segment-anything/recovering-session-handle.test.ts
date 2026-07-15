import { describe, expect, it, rstest } from '@rstest/core';

import { RecoveringSessionHandle } from './recovering-session-handle';
import { Session, SessionInitOptions } from './session';

type FakeSession = {
    isHealthy: boolean;
    reset: ReturnType<typeof rstest.fn>;
};

const deferred = <T>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((promiseResolve) => {
        resolve = promiseResolve;
    });

    return { promise, resolve };
};

const createFakeSession = (): FakeSession => ({
    isHealthy: true,
    reset: rstest.fn(async () => undefined),
});

const asSession = (session: FakeSession): Session => session as unknown as Session;

describe('RecoveringSessionHandle', () => {
    it('shares initialization between concurrent callers', async () => {
        const session = createFakeSession();
        const initialization = deferred<Session>();
        const factory = rstest.fn(() => initialization.promise);
        const handle = new RecoveringSessionHandle('/model.onnx', factory);

        const first = handle.init();
        const second = handle.init();
        expect(factory).toHaveBeenCalledTimes(1);

        initialization.resolve(asSession(session));
        await Promise.all([first, second]);
        expect(factory).toHaveBeenCalledTimes(1);
    });

    it('falls back to CPU when WebGPU initialization fails', async () => {
        const cpuSession = createFakeSession();
        const factory = rstest
            .fn<(options?: SessionInitOptions) => Promise<Session>>()
            .mockRejectedValueOnce(new Error('WebGPU initialization failed'))
            .mockResolvedValueOnce(asSession(cpuSession));
        const handle = new RecoveringSessionHandle('/model.onnx', factory);

        await handle.init();

        expect(factory).toHaveBeenNthCalledWith(1);
        expect(factory).toHaveBeenNthCalledWith(2, { executionProviders: ['cpu'] });
    });

    it('shares explicitly CPU-only initialization between concurrent callers', async () => {
        const session = createFakeSession();
        const initialization = deferred<Session>();
        const factory = rstest.fn(() => initialization.promise);
        const handle = new RecoveringSessionHandle('/model.onnx', factory);
        const options: SessionInitOptions = { executionProviders: ['cpu'] };

        const first = handle.init(options);
        const second = handle.init(options);

        expect(factory).toHaveBeenCalledTimes(1);
        expect(factory).toHaveBeenCalledWith(options);

        initialization.resolve(asSession(session));
        await Promise.all([first, second]);
        expect(factory).toHaveBeenCalledTimes(1);
    });

    it('does not retry an explicitly CPU-only initialization failure', async () => {
        const failure = new Error('initWasm failed');
        const factory = rstest.fn<(options?: SessionInitOptions) => Promise<Session>>().mockRejectedValue(failure);
        const handle = new RecoveringSessionHandle('/model.onnx', factory);

        await expect(handle.init({ executionProviders: ['cpu'] })).rejects.toBe(failure);
        expect(factory).toHaveBeenCalledTimes(1);
        expect(factory).toHaveBeenCalledWith({ executionProviders: ['cpu'] });
    });

    it('shares one reset between concurrent poisoned failures', async () => {
        const session = createFakeSession();
        const reset = deferred<void>();
        session.reset.mockImplementation(async () => {
            await reset.promise;
            session.isHealthy = true;
        });
        const handle = new RecoveringSessionHandle('/model.onnx', async () => asSession(session));
        await handle.init();

        let calls = 0;
        const operation = rstest.fn(async () => {
            calls++;
            if (calls <= 2) {
                session.isHealthy = false;
                throw new Error('ORT failure');
            }
            return calls;
        });

        const first = handle.execute(operation);
        const second = handle.execute(operation);
        await Promise.resolve();
        await Promise.resolve();
        expect(session.reset).toHaveBeenCalledTimes(1);

        reset.resolve();
        await expect(Promise.all([first, second])).resolves.toEqual([3, 4]);
    });

    it('shares one CPU replacement between concurrent WebGPU failures', async () => {
        const webGpuSession = createFakeSession();
        const cpuSession = createFakeSession();
        const factory = rstest
            .fn<(options?: SessionInitOptions) => Promise<Session>>()
            .mockResolvedValueOnce(asSession(webGpuSession))
            .mockResolvedValueOnce(asSession(cpuSession));
        const handle = new RecoveringSessionHandle('/model.onnx', factory);
        await handle.init();

        const operation = rstest.fn(async (session: Session) => {
            if (session === asSession(webGpuSession)) throw new Error('WebGPU device lost');
            return 'cpu result';
        });

        await expect(Promise.all([handle.execute(operation), handle.execute(operation)])).resolves.toEqual([
            'cpu result',
            'cpu result',
        ]);
        expect(factory).toHaveBeenCalledTimes(2);
        expect(factory).toHaveBeenLastCalledWith({ executionProviders: ['cpu'] });
    });

    it('does not share an unrelated healthy-session error with recovery', async () => {
        const webGpuSession = createFakeSession();
        const cpuSession = createFakeSession();
        const factory = rstest
            .fn<(options?: SessionInitOptions) => Promise<Session>>()
            .mockResolvedValueOnce(asSession(webGpuSession))
            .mockResolvedValueOnce(asSession(cpuSession));
        const handle = new RecoveringSessionHandle('/model.onnx', factory);
        await handle.init();

        let calls = 0;
        const operation = rstest.fn(async (session: Session) => {
            calls++;
            if (calls === 1) throw new Error('pre-processing failed');
            if (session === asSession(webGpuSession)) throw new Error('WebGPU device lost');
            return 'cpu result';
        });

        const results = await Promise.allSettled([handle.execute(operation), handle.execute(operation)]);

        expect(results[0].status).toBe('rejected');
        expect((results[0] as PromiseRejectedResult).reason).toMatchObject({ message: 'pre-processing failed' });
        expect(results[1]).toEqual({ status: 'fulfilled', value: 'cpu result' });
        expect(factory).toHaveBeenCalledTimes(2);
    });
});
