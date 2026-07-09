import type { OpenCVTypes } from '../opencv/interfaces';

let opencv: OpenCVTypes | null = null;

declare const self: { cv?: OpenCVTypes | Promise<OpenCVTypes> };

export const OpenCVLoader = async (): Promise<OpenCVTypes> => {
    if (opencv) return opencv;

    // opencv.js is OpenCV's own UMD build (emscripten output wrapped in a sloppy-mode
    // script): it assigns to undeclared globals (e.g. `Module = {}`) and relies on
    // top-level `this` being the global object. Real ES modules are always strict
    // mode, so loading it via a native `import()` throws (e.g. "ReferenceError:
    // Module is not defined" / "Cannot set properties of undefined"). Fetch its
    // source and evaluate it via the Function constructor instead, which runs in
    // non-strict/global scope, the same way a classic <script> or importScripts()
    // load would.
    const url = new URL('../opencv/4.9.0/opencv.js', import.meta.url);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch opencv.js: ${response.status} ${response.statusText} (${url.href})`);
    }

    const source = await response.text();

    // eslint-disable-next-line no-new-func -- intentional sloppy-mode eval, see comment above
    const run = new Function(source);
    run.call(self);

    if (self.cv === undefined) {
        throw new Error('Failed to load opencv.js: self.cv was not set');
    }

    // self.cv is itself a thenable (emscripten's `Module.ready` promise, resolved
    // with the Module/cv API once the WASM runtime finishes initializing), not the
    // API object directly — awaiting it unwraps to the real cv namespace (Mat, ...).
    opencv = await self.cv;

    return opencv;
};
