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

    return openCVSource instanceof URL ? openCVSource : new URL(openCVSource, moduleUrl);
};
