export interface SessionParameters {
    numThreads: number;
    executionProviders: string[];
    /**
     * Location of the ONNX Runtime wasm binaries. Accepts the legacy string
     * prefix and record-of-paths formats as well as the newer `{ wasm }` shape
     * used by `onnxruntime-web` >= 1.24. Optional: when omitted, ORT resolves
     * the binaries relative to its own bundle.
     */
    wasmRoot?: string | Record<string, string> | { wasm: string };
}

const ortDist = (file: string): string =>
    new URL(`../../../node_modules/onnxruntime-web/dist/${file}`, import.meta.url).toString();

// Map every wasm/mjs variant ORT may request to an explicit, bundler-fingerprinted
// URL using the record-of-paths format (rather than a single `{ wasm }` override)
// so ORT can pick the appropriate binary at runtime instead of always loading the
// JSEP build:
//   - `ort-wasm-simd-threaded.jsep.*` is the WebGPU+CPU (JSEP) build, selected when
//     the `webgpu` EP is active in a cross-origin-isolated context.
//   - `ort-wasm-simd-threaded.*` is the CPU-only build, selected when we drop
//     `webgpu` (e.g. non-cross-origin-isolated contexts), avoiding the heavier
//     JSEP/WebGPU machinery on the CPU fallback path.
const wasmPaths: Record<string, string> = {
    'ort-wasm-simd-threaded.jsep.wasm': ortDist('ort-wasm-simd-threaded.jsep.wasm'),
    'ort-wasm-simd-threaded.jsep.mjs': ortDist('ort-wasm-simd-threaded.jsep.mjs'),
    'ort-wasm-simd-threaded.wasm': ortDist('ort-wasm-simd-threaded.wasm'),
    'ort-wasm-simd-threaded.mjs': ortDist('ort-wasm-simd-threaded.mjs'),
};

/**
 * The threaded JSEP wasm needs `SharedArrayBuffer`, which in turn needs
 * cross-origin isolation (COOP/COEP). Tauri's WebView and any non-isolated
 * browser context don't satisfy that, so `pthread_create` fails when ORT
 * tries to spin up its worker pool. Once `initWasm()` fails ORT caches the
 * failure globally and even the CPU EP fallback rejects with
 * "previous call to 'initWasm()' failed".
 *
 * Detect that environment up front: force single-threaded wasm and drop the
 * `webgpu` EP (its kernels require the threaded wasm). Browsers with proper
 * isolation keep the multi-threaded WebGPU path.
 */
const hasThreadedWasmSupport = (): boolean => {
    try {
        return (
            typeof SharedArrayBuffer !== 'undefined' &&
            typeof globalThis !== 'undefined' &&
            // `crossOriginIsolated` is the canonical signal; absent in Tauri WebView.
            (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated === true
        );
    } catch {
        return false;
    }
};

const threaded = hasThreadedWasmSupport();

export const sessionParams: SessionParameters = {
    // `0` lets ORT pick `navigator.hardwareConcurrency`. Force `1` when we
    // can't spawn workers so ORT skips pthread_create entirely.
    numThreads: threaded ? 0 : 1,
    executionProviders: threaded ? ['webgpu', 'cpu'] : ['cpu'],
    wasmRoot: wasmPaths,
};
