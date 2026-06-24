import type { OpenCVTypes } from '../opencv/interfaces';

let opencv: OpenCVTypes.cv | null = null;

export const OpenCVLoader = async (): Promise<OpenCVTypes.cv> => {
    if (opencv) return opencv;

    // @ts-ignore - opencv.js WASM binary is provided by the consumer application at runtime
    const mod = await import('../opencv/4.9.0/opencv.js');

    // The Emscripten build exports (via `module.exports`) a Promise that resolves
    // to the initialised OpenCV namespace. Depending on the bundler's CJS interop
    // that value can surface in a few different shapes, so unwrap each of them:
    //   * `.default` — the Promise lands on the default export of the namespace
    //   * a factory function — the MODULARIZE wrapper
    //   * a thenable — the ready Promise resolving to the cv namespace
    //   * an object exposing a `ready` Promise
    //   * the already-initialised cv namespace itself
    const exported = (mod as { default?: unknown })?.default ?? mod;

    let cv: OpenCVTypes.cv;
    if (typeof exported === 'function') {
        cv = await (exported as () => Promise<OpenCVTypes.cv>)();
    } else if (exported && typeof (exported as PromiseLike<unknown>).then === 'function') {
        cv = (await exported) as OpenCVTypes.cv;
    } else if (exported && typeof (exported as { ready?: PromiseLike<unknown> }).ready?.then === 'function') {
        cv = (await (exported as { ready: PromiseLike<OpenCVTypes.cv> }).ready) as OpenCVTypes.cv;
    } else {
        cv = exported as OpenCVTypes.cv;
    }

    opencv = cv;

    return opencv;
};
