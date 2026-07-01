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

export const sessionParams: SessionParameters = {
    numThreads: 0,
    executionProviders: ['cpu'],
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
