import { describe, expect, it, rstest } from '@rstest/core';

import { RecoveringSessionHandle } from './recovering-session-handle';
import { Session, SessionInitOptions } from './session';
import { SessionPoisonedError, SessionRunTimeoutError } from './session-errors';

type FakeSession = {
    executionProviders: readonly string[];
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

const createFakeSession = (executionProviders: readonly string[] = ['webgpu', 'cpu']): FakeSession => ({
    executionProviders,
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

    it('shares one CPU reset between concurrent WebGPU failures', async () => {
        const webGpuSession = createFakeSession();
        let cpuOnly = false;
        webGpuSession.reset.mockImplementation(async () => {
            cpuOnly = true;
            webGpuSession.isHealthy = true;
        });
        const factory = rstest.fn(async () => asSession(webGpuSession));
        const handle = new RecoveringSessionHandle('/model.onnx', factory);
        await handle.init();

        const operation = rstest.fn(async () => {
            if (!cpuOnly) throw new Error('WebGPU device lost');
            return 'cpu result';
        });

        await expect(Promise.all([handle.execute(operation), handle.execute(operation)])).resolves.toEqual([
            'cpu result',
            'cpu result',
        ]);
        expect(factory).toHaveBeenCalledTimes(1);
        expect(webGpuSession.reset).toHaveBeenCalledTimes(1);
        expect(webGpuSession.reset).toHaveBeenCalledWith({ executionProviders: ['cpu'] });
    });

    it('downgrades a WebGPU session to CPU after a run timeout', async () => {
        const session = createFakeSession(['webgpu', 'cpu']);
        session.reset.mockImplementation(async (options?: SessionInitOptions) => {
            session.executionProviders = options?.executionProviders ?? session.executionProviders;
            session.isHealthy = true;
        });
        const handle = new RecoveringSessionHandle('/model.onnx', async () => asSession(session));
        await handle.init();

        let calls = 0;
        const operation = rstest.fn(async () => {
            calls++;
            if (calls === 1) {
                session.isHealthy = false;
                throw new SessionRunTimeoutError(30_000);
            }
            return 'cpu result';
        });

        await expect(handle.execute(operation)).resolves.toBe('cpu result');
        expect(session.reset).toHaveBeenCalledWith({ executionProviders: ['cpu'] });
        expect(session.executionProviders).toEqual(['cpu']);
    });

    it('resets an already CPU-only session in place after a run timeout', async () => {
        const session = createFakeSession(['cpu']);
        session.reset.mockImplementation(async () => {
            session.isHealthy = true;
        });
        const handle = new RecoveringSessionHandle('/model.onnx', async () => asSession(session));
        await handle.init({ executionProviders: ['cpu'] });

        let calls = 0;
        const operation = rstest.fn(async () => {
            calls++;
            if (calls === 1) {
                session.isHealthy = false;
                throw new SessionRunTimeoutError(30_000);
            }
            return 'cpu result';
        });

        await expect(handle.execute(operation)).resolves.toBe('cpu result');
        expect(session.reset).toHaveBeenCalledWith();
    });

    it('downgrades to CPU when the WebGPU failure is only reachable through the cause chain', async () => {
        const session = createFakeSession(['webgpu', 'cpu']);
        session.reset.mockImplementation(async (options?: SessionInitOptions) => {
            session.executionProviders = options?.executionProviders ?? session.executionProviders;
            session.isHealthy = true;
        });
        const handle = new RecoveringSessionHandle('/model.onnx', async () => asSession(session));
        await handle.init();

        let calls = 0;
        // A queued call never sees the WebGPU error itself, only the poisoning it caused.
        const operation = rstest.fn(async () => {
            calls++;
            if (calls === 1) {
                session.isHealthy = false;
                throw new SessionPoisonedError({ cause: new Error('WebGPU device lost') });
            }
            return 'cpu result';
        });

        await expect(handle.execute(operation)).resolves.toBe('cpu result');
        expect(session.reset).toHaveBeenCalledWith({ executionProviders: ['cpu'] });
    });

    it('does not share an unrelated healthy-session error with recovery', async () => {
        const webGpuSession = createFakeSession();
        let cpuOnly = false;
        webGpuSession.reset.mockImplementation(async () => {
            cpuOnly = true;
            webGpuSession.isHealthy = true;
        });
        const factory = rstest.fn(async () => asSession(webGpuSession));
        const handle = new RecoveringSessionHandle('/model.onnx', factory);
        await handle.init();

        let calls = 0;
        const operation = rstest.fn(async (session: Session) => {
            calls++;
            if (calls === 1) throw new Error('pre-processing failed');
            if (!cpuOnly) throw new Error('WebGPU device lost');
            return 'cpu result';
        });

        const results = await Promise.allSettled([handle.execute(operation), handle.execute(operation)]);

        expect(results[0].status).toBe('rejected');
        expect((results[0] as PromiseRejectedResult).reason).toMatchObject({ message: 'pre-processing failed' });
        expect(results[1]).toEqual({ status: 'fulfilled', value: 'cpu result' });
        expect(factory).toHaveBeenCalledTimes(1);
        expect(webGpuSession.reset).toHaveBeenCalledWith({ executionProviders: ['cpu'] });
    });
});
