import { env, InferenceSession } from 'onnxruntime-web';

import { loadSource } from '../utils/tool-utils';
import { SessionParameters, sessionParams } from '../utils/wasm-utils';

const loadModel = async (modelPath: string) => {
    return await (await loadSource(modelPath))?.arrayBuffer();
};

interface SessionInitOptions {
    executionProviders?: SessionParameters['executionProviders'];
    numThreads?: SessionParameters['numThreads'];
}

export class Session {
    ortSession: InferenceSession | undefined;
    params: SessionParameters;
    private executionProviders: SessionParameters['executionProviders'];
    private numThreads: SessionParameters['numThreads'];

    constructor() {
        this.params = sessionParams;
        this.executionProviders = sessionParams.executionProviders;
        this.numThreads = sessionParams.numThreads;
    }

    public async init(modelPath: string, options?: SessionInitOptions): Promise<void> {
        this.executionProviders = options?.executionProviders ?? this.params.executionProviders;
        this.numThreads = options?.numThreads ?? this.params.numThreads;

        env.wasm.numThreads = this.numThreads;
        env.wasm.simd = true;
        // Always assign, even when `undefined` — this lets `setOrtWasmPaths(undefined)`
        // clear a previously configured override and revert ORT to its default resolution.
        env.wasm.wasmPaths = this.params.wasmRoot;

        const modelData = await loadModel(modelPath);

        if (!modelData) {
            throw new Error(`Unable to load model from "${modelPath}"`);
        }

        const session = await InferenceSession.create(modelData, {
            executionProviders: this.executionProviders,
            graphOptimizationLevel: 'all',
            executionMode: 'parallel',
        });

        this.ortSession = session;
    }

    public async run(input: InferenceSession.OnnxValueMapType): Promise<InferenceSession.OnnxValueMapType> {
        if (!this.ortSession) {
            throw Error('the session is not initialized. Call `init()` method first.');
        }
        return await this.ortSession.run(input);
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
