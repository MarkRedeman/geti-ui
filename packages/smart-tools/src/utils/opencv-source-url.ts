export type OpenCVSource = string | URL;

// Set via `setOpenCVSourceUrl`. No default: this package doesn't bundle or
// serve opencv.js itself (see README).
let openCVSource: OpenCVSource | undefined;

// Captured in a variable (rather than inlined into `new URL(x, import.meta.url)`
// below) so bundlers don't statically analyze this as an asset reference — the
// source is a runtime-configured value, not a module-relative asset.
const moduleUrl = import.meta.url;

/**
 * Tell smart-tools where to fetch the OpenCV.js binary from. Call this once
 * during startup, before using any OpenCV-backed tool (GrabCut, Intelligent
 * Scissors, Watershed, SSIM, RITM, Segment Anything).
 *
 * ```ts
 * import { setOpenCVSourceUrl } from '@geti-ui/smart-tools';
 * setOpenCVSourceUrl('/opencv/opencv.js'); // served at https://<your-app>/opencv/opencv.js
 * ```
 */
export const setOpenCVSourceUrl = (source: OpenCVSource | undefined): void => {
    openCVSource = source;
};

export const getOpenCVSourceUrl = (): URL => {
    if (openCVSource === undefined) {
        throw new Error(
            'OpenCV.js source URL is not configured. This package does not bundle or serve the ' +
                'opencv.js binary itself — compile it (see the smart-tools README) and copy it into ' +
                "your app's static assets, then call `setOpenCVSourceUrl(...)` before using any " +
                'OpenCV-backed tool (GrabCut, Intelligent Scissors, Watershed, SSIM, RITM, Segment Anything).'
        );
    }

    if (openCVSource instanceof URL) return openCVSource;

    // Resolve string paths against the running app's origin (the document/worker
    // `location`), NOT this module's chunk URL — the package may be served from a
    // different origin (e.g. a CDN) than the app that hosts opencv.js, so a path
    // like `/opencv/opencv.js` must land on the app. `origin` is preferred over
    // `href` because in a blob-URL worker `href` is a `blob:` URL that a
    // path-absolute (`/…`) reference can't resolve against. Fall back to the
    // module URL only when there's no usable location (SSR/tests without a DOM).
    const { location } = globalThis as { location?: { href?: string; origin?: string } };
    const base = location?.origin && location.origin !== 'null' ? location.origin : (location?.href ?? moduleUrl);

    return new URL(openCVSource, base);
};
