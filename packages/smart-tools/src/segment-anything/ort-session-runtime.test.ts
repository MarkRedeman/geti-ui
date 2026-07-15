import { describe, expect, it, rstest } from '@rstest/core';
import { InferenceSession } from 'onnxruntime-web';

import { OrtSessionRuntime } from './ort-session-runtime';
import { SessionRunTimeoutError } from './session-errors';

const deferred = <T>() => {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((promiseResolve, promiseReject) => {
        resolve = promiseResolve;
        reject = promiseReject;
    });

    return { promise, reject, resolve };
};

const flushPromises = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
};

describe('OrtSessionRuntime', () => {
    it('serializes ORT runs', async () => {
        const firstRun = deferred<InferenceSession.OnnxValueMapType>();
        const run = rstest
            .fn()
            .mockImplementationOnce(() => firstRun.promise)
            .mockResolvedValueOnce({});
        const runtime = new OrtSessionRuntime({ run } as unknown as InferenceSession, rstest.fn());

        const first = runtime.run({}, 0);
        const second = runtime.run({}, 0);
        await flushPromises();

        expect(run).toHaveBeenCalledTimes(1);
        firstRun.resolve({});

        await expect(first).resolves.toEqual({});
        await expect(second).resolves.toEqual({});
        expect(run).toHaveBeenCalledTimes(2);
    });

    it('reports synchronous and asynchronous ORT failures', async () => {
        const onSyncFailure = rstest.fn();
        const synchronous = new OrtSessionRuntime(
            {
                run: () => {
                    throw new Error('sync failure');
                },
            } as unknown as InferenceSession,
            onSyncFailure
        );

        await expect(synchronous.run({}, 0)).rejects.toThrow('sync failure');
        expect(onSyncFailure).toHaveBeenCalledTimes(1);

        const onAsyncFailure = rstest.fn();
        const asynchronous = new OrtSessionRuntime(
            { run: rstest.fn().mockRejectedValue(new Error('async failure')) } as unknown as InferenceSession,
            onAsyncFailure
        );

        await expect(asynchronous.run({}, 0)).rejects.toThrow('async failure');
        expect(onAsyncFailure).toHaveBeenCalledTimes(1);
    });

    it('completes successfully before a configured timeout', async () => {
        const output: InferenceSession.OnnxValueMapType = {};
        const runtime = new OrtSessionRuntime(
            { run: rstest.fn().mockResolvedValue(output) } as unknown as InferenceSession,
            rstest.fn()
        );

        await expect(runtime.run({}, 100)).resolves.toBe(output);
    });

    it('times out without cancelling or releasing the raw run', async () => {
        const rawRun = deferred<InferenceSession.OnnxValueMapType>();
        const release = rstest.fn();
        const onFailure = rstest.fn();
        const runtime = new OrtSessionRuntime(
            { release, run: rstest.fn(() => rawRun.promise) } as unknown as InferenceSession,
            onFailure
        );

        await expect(runtime.run({}, 1)).rejects.toBeInstanceOf(SessionRunTimeoutError);
        expect(onFailure).toHaveBeenCalled();
        runtime.close(new Error('closed'));
        await flushPromises();
        expect(release).not.toHaveBeenCalled();

        rawRun.resolve({});
        await rawRun.promise;
        await flushPromises();
        expect(release).toHaveBeenCalledTimes(1);
    });

    it('rejects queued work when closed while allowing the active run to remain pending', async () => {
        const rawRun = deferred<InferenceSession.OnnxValueMapType>();
        const run = rstest.fn(() => rawRun.promise);
        const runtime = new OrtSessionRuntime(
            { release: rstest.fn(), run } as unknown as InferenceSession,
            rstest.fn()
        );

        void runtime.run({}, 0);
        const queued = runtime.run({}, 0);
        await flushPromises();

        const closeError = new Error('closed');
        runtime.close(closeError);

        await expect(queued).rejects.toBe(closeError);
        expect(run).toHaveBeenCalledTimes(1);
    });
});
