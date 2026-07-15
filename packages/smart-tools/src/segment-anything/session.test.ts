import { beforeEach, describe, expect, it, rstest } from '@rstest/core';
import { InferenceSession } from 'onnxruntime-web';

import { Session, SessionPoisonedError, SessionRunTimeoutError } from './session';

rstest.mock('onnxruntime-web', () => ({
    env: { wasm: {} },
    InferenceSession: { create: rstest.fn() },
}));

rstest.mock('../utils/tool-utils', () => ({
    loadSource: rstest.fn(async () => ({
        arrayBuffer: async () => new ArrayBuffer(1),
    })),
}));

type CreateSessionMock = {
    mock: { calls: [ArrayBuffer, unknown][] };
    mockReset: () => void;
    mockResolvedValueOnce: (session: InferenceSession) => void;
};

const createSessionMock = InferenceSession.create as unknown as CreateSessionMock;

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

const createSessionWithOrt = (ortSession: InferenceSession): Session => {
    const session = new Session();
    session.ortSession = ortSession;

    return session;
};

describe('Session', () => {
    beforeEach(() => {
        createSessionMock.mockReset();
    });

    it('runs calls serially in FIFO order', async () => {
        const firstOrtRun = deferred<InferenceSession.OnnxValueMapType>();
        const secondOrtRun = deferred<InferenceSession.OnnxValueMapType>();
        let runCount = 0;
        const run = rstest.fn(() => (runCount++ === 0 ? firstOrtRun.promise : secondOrtRun.promise));
        const session = createSessionWithOrt({ run } as unknown as InferenceSession);

        const firstCall = session.run({}, { timeoutMs: 0 });
        const secondCall = session.run({}, { timeoutMs: 0 });
        await flushPromises();

        expect(run).toHaveBeenCalledTimes(1);

        const firstOutput: InferenceSession.OnnxValueMapType = {};
        firstOrtRun.resolve(firstOutput);
        await expect(firstCall).resolves.toBe(firstOutput);
        await flushPromises();

        expect(run).toHaveBeenCalledTimes(2);

        const secondOutput: InferenceSession.OnnxValueMapType = {};
        secondOrtRun.resolve(secondOutput);
        await expect(secondCall).resolves.toBe(secondOutput);
    });

    it('poisons the session after an ORT rejection and rejects already-queued calls', async () => {
        const ortRun = deferred<InferenceSession.OnnxValueMapType>();
        const run = rstest.fn(() => ortRun.promise);
        const session = createSessionWithOrt({ run } as unknown as InferenceSession);

        const firstCall = session.run({}, { timeoutMs: 0 });
        const queuedCall = session.run({}, { timeoutMs: 0 });
        await flushPromises();

        ortRun.reject(new Error('ORT failed'));

        await expect(firstCall).rejects.toThrow('ORT failed');
        await expect(queuedCall).rejects.toBeInstanceOf(SessionPoisonedError);
        expect(run).toHaveBeenCalledTimes(1);
        expect(session.isHealthy).toBe(false);
        await expect(session.run({})).rejects.toBeInstanceOf(SessionPoisonedError);
    });

    it('poisons the session when ORT throws synchronously', async () => {
        const run = rstest.fn(() => {
            throw new Error('synchronous ORT failure');
        });
        const session = createSessionWithOrt({ run } as unknown as InferenceSession);

        await expect(session.run({})).rejects.toThrow('synchronous ORT failure');

        expect(session.isHealthy).toBe(false);
        await expect(session.run({})).rejects.toBeInstanceOf(SessionPoisonedError);
    });

    it('rejects reset before model data has been loaded', async () => {
        const session = new Session();

        await expect(session.reset()).rejects.toThrow('Session.reset() called before init()');
    });

    it('recreates the session from cached model data on reset', async () => {
        const initial = { release: rstest.fn() } as unknown as InferenceSession;
        const replacement = {} as InferenceSession;
        const session = new Session();
        createSessionMock.mockResolvedValueOnce(initial);
        createSessionMock.mockResolvedValueOnce(replacement);

        await session.init('/models/sam.onnx');
        await session.reset();

        expect(createSessionMock.mock.calls).toHaveLength(2);
        expect(createSessionMock.mock.calls[1][0]).toBe(createSessionMock.mock.calls[0][0]);
        expect(session.ortSession).toBe(replacement);
    });

    it('rejects queued calls on reset when the active run remains hung with timeouts disabled', async () => {
        const hungOrtRun = deferred<InferenceSession.OnnxValueMapType>();
        const oldOrtSession = {
            release: rstest.fn(),
            run: rstest.fn(() => hungOrtRun.promise),
        } as unknown as InferenceSession;
        const replacementOutput: InferenceSession.OnnxValueMapType = {};
        const replacement = {
            run: rstest.fn(async () => replacementOutput),
        } as unknown as InferenceSession;
        const session = new Session();
        createSessionMock.mockResolvedValueOnce(oldOrtSession);
        await session.init('/models/sam.onnx', { runTimeoutMs: 0 });

        void session.run({});
        const queuedCall = session.run({});
        const queuedOutcome = queuedCall.then(
            () => 'resolved',
            (err) => err
        );
        await flushPromises();
        expect(oldOrtSession.run).toHaveBeenCalledTimes(1);

        createSessionMock.mockResolvedValueOnce(replacement);
        await session.reset();

        const outcome = await Promise.race([queuedOutcome, Promise.resolve('still pending')]);
        expect(outcome).toBeInstanceOf(SessionPoisonedError);
        expect(oldOrtSession.run).toHaveBeenCalledTimes(1);
        await expect(session.run({})).resolves.toBe(replacementOutput);
        expect(replacement.run).toHaveBeenCalledTimes(1);
    });

    it('does not let a stale runtime failure poison its replacement', async () => {
        const oldOrtRun = deferred<InferenceSession.OnnxValueMapType>();
        const oldOrtSession = {
            release: rstest.fn(),
            run: rstest.fn(() => oldOrtRun.promise),
        } as unknown as InferenceSession;
        const replacementOutput: InferenceSession.OnnxValueMapType = {};
        const replacement = {
            run: rstest.fn(async () => replacementOutput),
        } as unknown as InferenceSession;
        const session = new Session();
        createSessionMock.mockResolvedValueOnce(oldOrtSession);
        await session.init('/models/sam.onnx', { runTimeoutMs: 0 });

        const oldCall = session.run({});
        await flushPromises();

        createSessionMock.mockResolvedValueOnce(replacement);
        await session.reset();
        oldOrtRun.reject(new Error('stale ORT failure'));

        await expect(oldCall).rejects.toThrow('stale ORT failure');
        expect(session.isHealthy).toBe(true);
        await expect(session.run({})).resolves.toBe(replacementOutput);
    });

    it('does not release a timed-out session until its underlying ORT run settles', async () => {
        const ortRun = deferred<InferenceSession.OnnxValueMapType>();
        const release = rstest.fn();
        const oldOrtSession = {
            release,
            run: rstest.fn(() => ortRun.promise),
        } as unknown as InferenceSession;
        const replacementRelease = rstest.fn();
        const replacement = { release: replacementRelease } as unknown as InferenceSession;
        const secondReplacement = {} as InferenceSession;
        const session = new Session();
        createSessionMock.mockResolvedValueOnce(oldOrtSession);

        await session.init('/models/sam.onnx', { runTimeoutMs: 10 });

        createSessionMock.mockResolvedValueOnce(replacement);

        await expect(session.run({})).rejects.toBeInstanceOf(SessionRunTimeoutError);
        await session.reset();

        expect(release).not.toHaveBeenCalled();
        expect(session.ortSession).toBe(replacement);
        expect(session.isHealthy).toBe(true);

        createSessionMock.mockResolvedValueOnce(secondReplacement);
        await session.reset();
        await Promise.resolve();

        expect(replacementRelease).toHaveBeenCalledTimes(1);
        expect(release).not.toHaveBeenCalled();

        ortRun.resolve({});
        await ortRun.promise;
        await Promise.resolve();
        await Promise.resolve();

        expect(release).toHaveBeenCalledTimes(1);
    });
});
