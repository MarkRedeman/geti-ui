import type { OpenCVTypes } from '../opencv/interfaces';

let opencv: OpenCVTypes | null = null;

export const OpenCVLoader = async (): Promise<OpenCVTypes> => {
    if (opencv) return opencv;

    // @ts-ignore - opencv.js WASM binary is provided by the consumer application at runtime
    const cv: OpenCVTypes = await import('../opencv/4.9.0/opencv.js');

    if ('ready' in cv) await cv.ready;

    opencv = cv;

    return opencv;
};
