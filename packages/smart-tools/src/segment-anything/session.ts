import { env, InferenceSession } from 'onnxruntime-web';

import { loadSource } from '../utils/tool-utils';
import { SessionParameters, sessionParams } from '../utils/wasm-utils';
import { OrtSessionRuntime } from './ort-session-runtime';
import { SessionPoisonedError } from './session-errors';

export { SessionPoisonedError, SessionRunTimeoutError } from './session-errors';

const loadModel = async (modelPath: string) => {
    return await (await loadSource(modelPath))?.arrayBuffer();
};

/**
 * Default per-call timeout (ms) applied when neither `init()` nor `run()`
 * specifies one. Bounds a hung `ortSession.run()` (e.g. JSEP/WebGPU stall,
 * native deadlock) that would otherwise block the serial queue for every
 * later call.
 *
 * Consuming apps almost always wrap SAM calls in their own timeout. This
 * default must stay *below* that app-level budget, otherwise the app gives up
 * first, abandons (but cannot cancel) the hung run, and the queue stays
 * blocked until this timer finally fires. Set `runTimeoutMs` explicitly via
 * `init()` to line it up with your own budget; pass `0` to disable.
 */
export const DEFAULT_RUN_TIMEOUT_MS = 30_000;

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

export class Session {
    params: SessionParameters;
    private modelData: ArrayBuffer | undefined;
    private currentExecutionProviders: SessionParameters['executionProviders'];
    private runTimeoutMs: number | undefined;
    private poisonCause: unknown;
    private poisoned = false;
    private runtime: OrtSessionRuntime | undefined;

    constructor() {
        this.params = sessionParams;
        this.currentExecutionProviders = sessionParams.executionProviders;
    }

    /**
     * `true` while the underlying ortSession is created and no unrecoverable
     * failure (thrown error or timeout) has been observed since.
     */
    public get isHealthy(): boolean {
        return !this.poisoned && this.runtime !== undefined;
    }

    /** Execution providers the current ortSession was created with. */
    public get executionProviders(): readonly string[] {
        return this.currentExecutionProviders;
    }

    public get ortSession(): InferenceSession | undefined {
        return this.runtime?.ortSession;
    }

    public async init(modelPath: string, options?: SessionInitOptions): Promise<void> {
        const modelData = await loadModel(modelPath);

        if (!modelData) {
            throw new Error(`Unable to load model from "${modelPath}"`);
        }

        this.closeRuntime();
        this.currentExecutionProviders = options?.executionProviders ?? this.params.executionProviders;
        // Default to a non-zero timeout so callers that omit `runTimeoutMs`
        // are still protected from a hung run() blocking the serial queue.
        // Explicit `0` disables the timeout.
        this.runTimeoutMs = options?.runTimeoutMs ?? DEFAULT_RUN_TIMEOUT_MS;
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
            this.currentExecutionProviders = options.executionProviders;
        }
        if (options?.runTimeoutMs !== undefined) {
            this.runTimeoutMs = options.runTimeoutMs;
        }

        this.closeRuntime();

        await this.createOrtSession();
    }

    private closeRuntime(): void {
        const previous = this.runtime;
        this.runtime = undefined;
        this.poisoned = false;
        this.poisonCause = undefined;
        previous?.close(new SessionPoisonedError());
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
        const cpuOnly = this.currentExecutionProviders.length === 1 && this.currentExecutionProviders[0] === 'cpu';
        env.wasm.numThreads = cpuOnly ? 1 : this.params.numThreads;
        // Always assign, even when `undefined` — this lets `setOrtWasmPaths(undefined)`
        // clear a previously configured override and revert ORT to its default resolution.
        env.wasm.wasmPaths = this.params.wasmRoot;
        env.wasm.simd = true;

        const ortSession = await InferenceSession.create(this.modelData, {
            executionProviders: this.currentExecutionProviders,
            graphOptimizationLevel: 'all',
            executionMode: 'parallel',
            // 0=verbose, 1=info, 2=warning, 3=error, 4=fatal. Silences the
            // native "VerifyEachNodeIsAssignedToAnEp" warnings emitted when
            // ORT intentionally keeps shape-related ops on the CPU EP.
            logSeverityLevel: 3,
        });
        this.runtime = this.createRuntime(ortSession);
    }

    private createRuntime(ortSession: InferenceSession): OrtSessionRuntime {
        let runtime: OrtSessionRuntime;
        runtime = new OrtSessionRuntime(ortSession, (error) => {
            if (this.runtime === runtime) {
                this.poison(error);
            }
        });

        return runtime;
    }

    public async run(
        input: InferenceSession.OnnxValueMapType,
        options?: SessionRunOptions
    ): Promise<InferenceSession.OnnxValueMapType> {
        const runtime = this.runtime;
        if (!runtime) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }
        if (this.poisoned) {
            throw new SessionPoisonedError({ cause: this.poisonCause });
        }

        return await runtime.run(input, options?.timeoutMs ?? this.runTimeoutMs);
    }

    private poison(cause: unknown): void {
        if (this.poisoned) return;
        this.poisoned = true;
        this.poisonCause = cause;
        this.runtime?.close(new SessionPoisonedError({ cause }));
    }

    public inputNames(): readonly string[] {
        if (!this.runtime) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }
        return this.runtime.inputNames();
    }

    public outputNames(): readonly string[] {
        if (!this.runtime) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }
        return this.runtime.outputNames();
    }
}
