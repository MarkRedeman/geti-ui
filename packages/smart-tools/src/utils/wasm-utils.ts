/**
 * Paths/URLs ORT uses to locate its WebAssembly binaries. Mirrors the shapes
 * accepted by `onnxruntime-web`'s `env.wasm.wasmPaths`: a string prefix/URL the
 * artifacts are served under, a record mapping each artifact filename to an
 * explicit URL, or the `{ wasm }` shape used by `onnxruntime-web` >= 1.24.
 */
export type OrtWasmPaths = string | Record<string, string> | { wasm: string };

export interface SessionParameters {
    numThreads: number;
    executionProviders: string[];
    /**
     * Location of the ONNX Runtime wasm binaries. Resolved by the *consuming
     * application* via {@link setOrtWasmPaths} — this library deliberately does
     * not hardcode it, because where the `.wasm`/`.mjs` artifacts are bundled
     * and served from is an app build concern, not a library one. When left
     * unset, ORT resolves the binaries relative to its own bundle (or the
     * default CDN), which is correct for most setups.
     */
    wasmRoot?: OrtWasmPaths;
}

/**
 * ORT's WebGPU execution provider runs through the threaded JSEP wasm, which
 * needs `SharedArrayBuffer` — and that is only available in cross-origin
 * isolated contexts (COOP/COEP). Non-isolated tabs and embedded WebViews (e.g.
 * Tauri's WKWebView/WebView2) don't satisfy that, so `pthread_create` fails
 * when ORT spins up its worker pool. Worse, once `initWasm()` fails ORT caches
 * the failure globally and even a pure-CPU session then rejects with "previous
 * call to 'initWasm()' failed".
 *
 * Detect the capable environment up front so we only opt into `webgpu` (and
 * multi-threaded wasm) where it can actually load, and pin everything else to
 * a single-threaded CPU EP. This is the "prevent, not react" gate that keeps
 * the reactive WebGPU→CPU recovery in `SegmentAnythingModel` as a rare backstop
 * rather than the primary control flow.
 */
const hasThreadedWasmSupport = (): boolean => {
    try {
        return (
            typeof SharedArrayBuffer !== 'undefined' &&
            typeof globalThis !== 'undefined' &&
            // `crossOriginIsolated` is the canonical signal; absent in non-isolated
            // tabs and embedded WebViews.
            (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated === true
        );
    } catch {
        return false;
    }
};

const threaded = hasThreadedWasmSupport();

export const sessionParams: SessionParameters = {
    // `0` lets ORT pick `navigator.hardwareConcurrency`. Force `1` when we can't
    // spawn workers so ORT skips `pthread_create` entirely.
    numThreads: threaded ? 0 : 1,
    // WebGPU kernels require the threaded JSEP wasm; only request the `webgpu`
    // EP where cross-origin isolation lets that wasm load, otherwise pin to CPU.
    executionProviders: threaded ? ['webgpu', 'cpu'] : ['cpu'],
    // Resolved by the consuming app via `setOrtWasmPaths`. Left undefined so
    // ORT loads its binaries relative to its own bundle by default.
    wasmRoot: undefined,
};

/**
 * Tell ONNX Runtime where to load its WebAssembly binaries from.
 *
 * The smart-tools package cannot know how the *consuming application* bundles
 * or serves the `onnxruntime-web` `.wasm`/`.mjs` artifacts, so resolution is
 * delegated to the app. Call this once during startup — before creating a
 * `Session` or loading RITM — passing whatever ORT's `env.wasm.wasmPaths`
 * accepts (see {@link OrtWasmPaths}). For example, when the app copies the ORT
 * artifacts to a public folder:
 *
 * ```ts
 * import { setOrtWasmPaths } from '@geti-ui/smart-tools';
 * setOrtWasmPaths('/ort/'); // files served under https://app/ort/<name>.wasm
 * ```
 *
 * Pass `undefined` to clear the override and let ORT resolve the binaries
 * relative to its own bundle (or the default CDN).
 */
export const setOrtWasmPaths = (wasmRoot: OrtWasmPaths | undefined): void => {
    sessionParams.wasmRoot = wasmRoot;
};
