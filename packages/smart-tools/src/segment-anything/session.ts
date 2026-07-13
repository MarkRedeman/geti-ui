import { env, InferenceSession } from 'onnxruntime-web';

import { loadSource } from '../utils/tool-utils';
import { SessionParameters, sessionParams } from '../utils/wasm-utils';

const loadModel = async (modelPath: string) => {
    return await (await loadSource(modelPath))?.arrayBuffer();
};

/**
 * Default per-call timeout (ms) applied when neither `init()` nor `run()`
 * specifies one. Sized to bound a hung `ortSession.run()` (e.g. JSEP/WebGPU
 * stall, native deadlock) without false-firing on a legitimate slow SAM
 * encoder pass on a CPU EP, which can comfortably take 30–60 s on modest
 * hardware. Override via `init({ runTimeoutMs })` or `run(input, { timeoutMs })`;
 * pass `0` to disable.
 */
export const DEFAULT_RUN_TIMEOUT_MS = 5 * 60_000;

/**
 * Thrown when a single `Session.run()` call exceeds its configured timeout.
 * The session is marked unhealthy after this — call `Session.reset()` to revive it.
 */
export class SessionRunTimeoutError extends Error {
    constructor(timeoutMs: number) {
        super(`ortSession.run() did not complete within ${timeoutMs}ms`);
        this.name = 'SessionRunTimeoutError';
    }
}

/**
 * Thrown by `Session.run()` when a previous call left the underlying
 * InferenceSession in an unrecoverable state (WASM heap corruption, EP stall, ...).
 * The caller should call `Session.reset()` (optionally downgrading the EP) before
 * issuing more runs.
 */
export class SessionPoisonedError extends Error {
    constructor() {
        super('Session is poisoned after a previous unrecoverable failure. Call Session.reset() to revive it.');
        this.name = 'SessionPoisonedError';
    }
}

export type SessionInitOptions = {
    /**
     * Override the default execution providers (e.g. `['cpu']` to force CPU on
     * platforms where WebGPU is unavailable or broken).
     */
    executionProviders?: SessionParameters['executionProviders'];
    /**
     * Default timeout (ms) applied to every `run()` call unless overridden per-call.
     * `0` disables the timeout. If omitted, DEFAULT_RUN_TIMEOUT_MS is used.
     */
    runTimeoutMs?: number;
};

export type SessionRunOptions = {
    /** Per-call timeout (ms) overriding the session-level default. */
    timeoutMs?: number;
};

type QueuedRun = {
    generation: number;
    input: InferenceSession.OnnxValueMapType;
    reject: (reason: unknown) => void;
    resolve: (value: InferenceSession.OnnxValueMapType) => void;
    timeoutMs: number | undefined;
};

export class Session {
    ortSession: InferenceSession | undefined;
    params: SessionParameters;
    // onnxruntime-web doesn't support concurrent run() calls on one session.
    // Explicit queued tasks let reset()/poison() reject waiters immediately,
    // even when the currently executing ORT call never settles.
    private queue: QueuedRun[] = [];
    private runningGenerations = new Set<number>();
    // Cached model bytes so reset() can recreate the InferenceSession without
    // re-downloading. Kept until the Session is discarded.
    private modelData: ArrayBuffer | undefined;
    private executionProviders: SessionParameters['executionProviders'];
    private runTimeoutMs: number | undefined;
    private poisoned = false;
    // Bumped on every reset() and on poisoning. Captured by run() at enqueue
    // time and re-checked inside the queued continuation so that calls already
    // sitting behind a poisoned/replaced session are rejected instead of
    // executing against a stale or corrupted ortSession.
    private generation = 0;
    // Raw ORT run promises, which may remain in flight after the wrapper-level
    // timeout has settled the serial queue.
    private activeRuns = new Map<InferenceSession, Set<Promise<InferenceSession.OnnxValueMapType>>>();

    constructor() {
        this.params = sessionParams;
        this.executionProviders = sessionParams.executionProviders;
    }

    /**
     * `true` while the underlying ortSession is created and no unrecoverable
     * failure (thrown error or timeout) has been observed since.
     */
    public get isHealthy(): boolean {
        return !this.poisoned && this.ortSession !== undefined;
    }

    public async init(modelPath: string, options?: SessionInitOptions): Promise<void> {
        this.executionProviders = options?.executionProviders ?? this.params.executionProviders;
        // Default to a non-zero timeout so callers that omit `runTimeoutMs`
        // are still protected from a hung run() blocking the serial queue.
        // Explicit `0` disables the timeout.
        this.runTimeoutMs = options?.runTimeoutMs ?? DEFAULT_RUN_TIMEOUT_MS;

        const modelData = await loadModel(modelPath);

        if (!modelData) {
            throw new Error(`Unable to load model from "${modelPath}"`);
        }

        this.modelData = modelData;
        await this.createOrtSession();
    }

    /**
     * Recreate the underlying InferenceSession from the cached model bytes,
     * after a poisoning failure (WASM OOB, JSEP kernel crash, EP hang, ...).
     * Reuses the model bytes captured during `init()` — no re-download.
     *
     * Pass `executionProviders` to downgrade after repeated WebGPU failures
     * (e.g. `{ executionProviders: ['cpu'] }`). Without it the previously
     * configured EPs are reused.
     */
    public async reset(options?: SessionInitOptions): Promise<void> {
        if (!this.modelData) {
            throw new Error('Session.reset() called before init(); no model bytes cached.');
        }

        if (options?.executionProviders) {
            this.executionProviders = options.executionProviders;
        }
        if (options?.runTimeoutMs !== undefined) {
            this.runTimeoutMs = options.runTimeoutMs;
        }

        const previous = this.ortSession;
        // Snapshot raw ORT calls before replacing the session. The queue tail
        // can settle on our timeout while the underlying call is still running.
        const previousRuns = previous ? [...(this.activeRuns.get(previous) ?? [])] : [];
        this.ortSession = undefined;

        this.generation++;
        this.poisoned = false;
        this.rejectQueuedRuns();

        // Best-effort release of the dead session — the WASM heap may already
        // be corrupt, and a hung/deadlocked EP can mean release() itself never
        // settles. Fire-and-forget (not awaited) so a stuck release() can't
        // block reset() itself. Wait for the raw ORT calls, not the bounded
        // wrapper queue, so release() can never race a timed-out call that is
        // still using the old session. A permanently hung call intentionally
        // leaves the old session unreleased because releasing it is unsafe.
        if (previous && typeof previous.release === 'function') {
            Promise.allSettled(previousRuns)
                .then(() => previous.release())
                .catch(() => {
                    // ignore — session is going away anyway
                });
        }

        await this.createOrtSession();
    }

    private async createOrtSession(): Promise<void> {
        if (!this.modelData) {
            throw new Error('createOrtSession() called before model bytes were loaded; call init() first.');
        }

        // The threaded JSEP wasm needs SharedArrayBuffer / cross-origin
        // isolation. When we're running CPU-only (either by config or after
        // a WebGPU/JSEP downgrade) force single-threaded wasm so ORT skips
        // pthread_create entirely — once `initWasm()` fails it stays failed
        // for the lifetime of the page and even pure-CPU sessions reject
        // with "previous call to 'initWasm()' failed".
        const cpuOnly = this.executionProviders.length === 1 && this.executionProviders[0] === 'cpu';
        env.wasm.numThreads = cpuOnly ? 1 : this.params.numThreads;
        // Always assign, even when `undefined` — this lets `setOrtWasmPaths(undefined)`
        // clear a previously configured override and revert ORT to its default resolution.
        env.wasm.wasmPaths = this.params.wasmRoot;
        env.wasm.simd = true;

        this.ortSession = await InferenceSession.create(this.modelData, {
            executionProviders: this.executionProviders,
            graphOptimizationLevel: 'all',
            executionMode: 'parallel',
            // 0=verbose, 1=info, 2=warning, 3=error, 4=fatal. Silences the
            // native "VerifyEachNodeIsAssignedToAnEp" warnings emitted when
            // ORT intentionally keeps shape-related ops on the CPU EP.
            logSeverityLevel: 3,
        });
    }

    public async run(
        input: InferenceSession.OnnxValueMapType,
        options?: SessionRunOptions
    ): Promise<InferenceSession.OnnxValueMapType> {
        if (!this.ortSession) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }
        if (this.poisoned) {
            throw new SessionPoisonedError();
        }

        const timeoutMs = options?.timeoutMs ?? this.runTimeoutMs;
        const enqueuedGeneration = this.generation;

        const result = new Promise<InferenceSession.OnnxValueMapType>((resolve, reject) => {
            this.queue.push({ generation: enqueuedGeneration, input, reject, resolve, timeoutMs });
        });
        void this.drainQueue(enqueuedGeneration);

        return await result;
    }

    private async drainQueue(generation: number): Promise<void> {
        if (this.runningGenerations.has(generation)) return;

        const queuedRunIndex = this.queue.findIndex((queuedRun) => queuedRun.generation === generation);
        if (queuedRunIndex === -1) return;

        const [queuedRun] = this.queue.splice(queuedRunIndex, 1);
        if (this.poisoned || this.generation !== generation || !this.ortSession) {
            queuedRun.reject(new SessionPoisonedError());
            void this.drainQueue(generation);
            return;
        }

        const currentSession = this.ortSession;
        this.runningGenerations.add(generation);

        try {
            queuedRun.resolve(await this.runOnce(currentSession, queuedRun.input, queuedRun.timeoutMs));
        } catch (err) {
            queuedRun.reject(err);
        } finally {
            this.runningGenerations.delete(generation);
            void this.drainQueue(generation);
        }
    }

    private rejectQueuedRuns(): void {
        const queuedRuns = this.queue.splice(0);
        for (const queuedRun of queuedRuns) {
            queuedRun.reject(new SessionPoisonedError());
        }
    }

    private runOnce(
        session: InferenceSession,
        input: InferenceSession.OnnxValueMapType,
        timeoutMs: number | undefined
    ): Promise<InferenceSession.OnnxValueMapType> {
        let runPromise: Promise<InferenceSession.OnnxValueMapType>;

        try {
            runPromise = session.run(input);
        } catch (err) {
            this.poison();
            throw err;
        }

        const sessionRuns = this.activeRuns.get(session) ?? new Set<Promise<InferenceSession.OnnxValueMapType>>();
        sessionRuns.add(runPromise);
        this.activeRuns.set(session, sessionRuns);

        const removeActiveRun = () => {
            sessionRuns.delete(runPromise);
            if (sessionRuns.size === 0) {
                this.activeRuns.delete(session);
            }
        };
        void runPromise.then(removeActiveRun, removeActiveRun);

        if (!timeoutMs || timeoutMs <= 0) {
            return runPromise.catch((err) => {
                // Any thrown error from ortSession.run() is treated as
                // unrecoverable — JSEP failures leave the WASM heap in an
                // inconsistent state and subsequent runs OOB or return garbage.
                if (this.ortSession === session) this.poison();
                throw err;
            });
        }

        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
                if (this.ortSession === session) this.poison();
                reject(new SessionRunTimeoutError(timeoutMs));
            }, timeoutMs);
        });

        return Promise.race([runPromise, timeoutPromise]).then(
            (result) => {
                if (timer !== undefined) clearTimeout(timer);
                return result;
            },
            (err) => {
                if (timer !== undefined) clearTimeout(timer);
                if (this.ortSession === session) this.poison();
                throw err;
            }
        );
    }

    private poison(): void {
        if (this.poisoned) return;
        this.poisoned = true;
        // Bump the generation so any run() calls already queued behind this
        // one are rejected in their `then(...)` re-check instead of executing
        // against the now-corrupted session.
        this.generation++;
        this.rejectQueuedRuns();
    }

    public inputNames(): readonly string[] {
        if (!this.ortSession) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }
        return this.ortSession.inputNames;
    }

    public outputNames(): readonly string[] {
        if (!this.ortSession) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }
        return this.ortSession.outputNames;
    }
}
