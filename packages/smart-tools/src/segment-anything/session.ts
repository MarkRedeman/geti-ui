import { env, InferenceSession } from 'onnxruntime-web';

import { loadSource } from '../utils/tool-utils';
import { SessionParameters, sessionParams } from '../utils/wasm-utils';
import { SessionRunTimeoutError } from './errors';

export const DEFAULT_RUN_TIMEOUT_MS = 5 * 60_000;

const loadModel = async (modelPath: string) => {
    return await (await loadSource(modelPath))?.arrayBuffer();
};

interface SessionInitOptions {
    executionProviders?: SessionParameters['executionProviders'];
    runTimeoutMs?: number;
}

export interface ModelSession {
    run<T>(
        input: InferenceSession.OnnxValueMapType,
        consume: (output: InferenceSession.OnnxValueMapType, outputNames: readonly string[]) => Promise<T>
    ): Promise<T>;
}

let isOrtEnvironmentConfigured = false;

const configureOrtEnvironment = (): void => {
    if (isOrtEnvironmentConfigured) return;

    env.wasm.numThreads = sessionParams.numThreads;
    env.wasm.simd = true;
    env.wasm.wasmPaths = sessionParams.wasmRoot;
    isOrtEnvironmentConfigured = true;
};

export class Session {
    private ortSession: InferenceSession | undefined;
    private modelData: ArrayBuffer | undefined;
    private initialization: Promise<void> | undefined;
    readonly params: SessionParameters;
    private executionProviders: SessionParameters['executionProviders'];
    private runTimeoutMs = DEFAULT_RUN_TIMEOUT_MS;

    constructor() {
        this.params = sessionParams;
        this.executionProviders = sessionParams.executionProviders;
    }

    public async init(modelPath: string, options?: SessionInitOptions): Promise<void> {
        if (this.ortSession) return;
        if (this.initialization) return this.initialization;

        const initialization = this.initialize(modelPath, options);
        this.initialization = initialization;

        try {
            await initialization;
        } finally {
            if (this.initialization === initialization) this.initialization = undefined;
        }
    }

    private async initialize(modelPath: string, options?: SessionInitOptions): Promise<void> {
        configureOrtEnvironment();
        this.executionProviders = options?.executionProviders ?? this.params.executionProviders;
        this.runTimeoutMs = options?.runTimeoutMs ?? DEFAULT_RUN_TIMEOUT_MS;

        const modelData = await loadModel(modelPath);
        if (!modelData) throw new Error(`Unable to load model from "${modelPath}"`);

        this.modelData = modelData;
        this.ortSession = await this.createOrtSession(modelData, this.executionProviders);
    }

    private async createOrtSession(
        modelData: ArrayBuffer,
        executionProviders: SessionParameters['executionProviders']
    ): Promise<InferenceSession> {
        return InferenceSession.create(modelData, {
            executionProviders,
            graphOptimizationLevel: 'all',
            executionMode: 'parallel',
        });
    }

    public async run(input: InferenceSession.OnnxValueMapType): Promise<InferenceSession.OnnxValueMapType> {
        if (!this.ortSession) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }

        const run = this.ortSession.run(input);
        if (this.runTimeoutMs <= 0) return run;

        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeout = new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
                const settled = run.then(
                    (output) => {
                        for (const tensor of new Set(Object.values(output))) tensor.dispose();
                    },
                    () => undefined
                );
                reject(new SessionRunTimeoutError(this.runTimeoutMs, settled));
            }, this.runTimeoutMs);
        });

        try {
            return await Promise.race([run, timeout]);
        } finally {
            if (timer !== undefined) clearTimeout(timer);
        }
    }

    public async reset(options?: SessionInitOptions): Promise<void> {
        if (!this.modelData) throw new Error('Session.reset() called before init()');

        const executionProviders = options?.executionProviders ?? this.executionProviders;
        if (options?.runTimeoutMs !== undefined) this.runTimeoutMs = options.runTimeoutMs;
        const replacement = await this.createOrtSession(this.modelData, executionProviders);
        const previous = this.ortSession;

        this.executionProviders = executionProviders;
        this.ortSession = replacement;
        await previous?.release().catch(() => undefined);
    }

    public async release(): Promise<void> {
        const session = this.ortSession;
        this.ortSession = undefined;
        await session?.release();
    }

    public get isHealthy(): boolean {
        return this.ortSession !== undefined;
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
