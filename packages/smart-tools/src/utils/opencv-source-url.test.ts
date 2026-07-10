import { describe, expect, it, rstest } from '@rstest/core';

/**
 * Reset the module registry and re-import so the module-level `openCVSource`
 * cache doesn't leak between tests.
 */
const loadFresh = async () => {
    rstest.resetModules();
    return import('./opencv-source-url');
};

describe('getOpenCVSourceUrl', () => {
    it('throws a descriptive error when not configured', async () => {
        const { getOpenCVSourceUrl } = await loadFresh();

        expect(() => getOpenCVSourceUrl()).toThrow('OpenCV.js source URL is not configured');
    });

    it('resolves a leading-slash string against the app origin', async () => {
        const { getOpenCVSourceUrl, setOpenCVSourceUrl } = await loadFresh();

        setOpenCVSourceUrl('/opencv/opencv.js');

        const url = getOpenCVSourceUrl();

        expect(url).toBeInstanceOf(URL);
        expect(url.href).toBe(`${location.origin}/opencv/opencv.js`);
    });

    it('resolves a bare relative string against the app origin, not the module URL', async () => {
        const { getOpenCVSourceUrl, setOpenCVSourceUrl } = await loadFresh();

        setOpenCVSourceUrl('opencv/opencv.js');

        expect(getOpenCVSourceUrl().href).toBe(`${location.origin}/opencv/opencv.js`);
    });

    it('passes through an absolute string unchanged', async () => {
        const { getOpenCVSourceUrl, setOpenCVSourceUrl } = await loadFresh();

        setOpenCVSourceUrl('https://cdn.example.com/opencv.js');

        expect(getOpenCVSourceUrl().href).toBe('https://cdn.example.com/opencv.js');
    });

    it('returns a URL instance as-is', async () => {
        const { getOpenCVSourceUrl, setOpenCVSourceUrl } = await loadFresh();
        const source = new URL('https://cdn.example.com/opencv.js');

        setOpenCVSourceUrl(source);

        expect(getOpenCVSourceUrl()).toBe(source);
    });

    it('throws again after clearing a previously configured source with undefined', async () => {
        const { getOpenCVSourceUrl, setOpenCVSourceUrl } = await loadFresh();

        setOpenCVSourceUrl('/opencv/opencv.js');
        setOpenCVSourceUrl(undefined);

        expect(() => getOpenCVSourceUrl()).toThrow('OpenCV.js source URL is not configured');
    });
});
