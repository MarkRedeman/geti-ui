import { afterEach, beforeEach, describe, expect, it, rstest } from '@rstest/core';

rstest.mock('onnxruntime-web', () => ({
    env: { wasm: { numThreads: -1, simd: false, wasmPaths: undefined } },
    InferenceSession: {
        create: rstest.fn(async () => ({ inputNames: ['x'], outputNames: ['y'] })),
    },
}));

rstest.mock('../utils/tool-utils', () => ({
    loadSource: async () => ({ arrayBuffer: async () => new ArrayBuffer(8) }),
}));

import { env, InferenceSession } from 'onnxruntime-web';

import * as wasmUtils from '../utils/wasm-utils';
import { Session } from './session';

describe('Session', () => {
    let sessionParams: wasmUtils.SessionParameters;

    beforeEach(() => {
        env.wasm.numThreads = -1;
        // jsdom is never cross-origin isolated, so the real module always reports a
        // single-threaded CPU-only environment, masking the behaviour under test.
        sessionParams = { numThreads: 4, executionProviders: ['webgpu', 'cpu'], wasmRoot: undefined };
        rstest.spyOn(wasmUtils, 'sessionParams', 'get').mockReturnValue(sessionParams);
    });

    afterEach(() => {
        rstest.restoreAllMocks();
    });

    it('uses the configured thread count by default', async () => {
        await new Session().init('model.onnx');

        expect(env.wasm.numThreads).toBe(4);
    });

    it('keeps the configured thread count when the caller asks for a CPU-only session', async () => {
        // Regression guard: a CPU-only EP list used to imply single-threaded wasm.
        // A missing WebGPU *adapter* also yields a CPU-only list, which clamped SAM
        // to one core on machines whose threaded wasm was perfectly healthy.
        await new Session().init('model.onnx', { executionProviders: ['cpu'] });

        expect(env.wasm.numThreads).toBe(4);
    });

    it('honours numThreads = 0 (let ORT auto-select) even for CPU-only sessions', async () => {
        sessionParams.numThreads = 0;
        await new Session().init('model.onnx', { executionProviders: ['cpu'] });
        expect(env.wasm.numThreads).toBe(0);
    });

    it('lets the caller pin the thread count explicitly', async () => {
        await new Session().init('model.onnx', { executionProviders: ['cpu'], numThreads: 1 });

        expect(env.wasm.numThreads).toBe(1);
    });

    it('picks up sessionParams mutated by the host application', async () => {
        // How embedders (e.g. Tauri/WebView2) force single-threaded CPU inference.
        sessionParams.numThreads = 1;
        sessionParams.executionProviders = ['cpu'];

        await new Session().init('model.onnx');

        expect(env.wasm.numThreads).toBe(1);
        expect(InferenceSession.create).toHaveBeenLastCalledWith(
            expect.anything(),
            expect.objectContaining({ executionProviders: ['cpu'] })
        );
    });
});
