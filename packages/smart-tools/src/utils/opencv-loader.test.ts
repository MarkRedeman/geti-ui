import { afterEach, beforeEach, describe, expect, it, rstest } from '@rstest/core';

// The real opencv.js binary is not committed (compiled via Docker, see README), so in
// CI the `new URL('../opencv/4.9.0/opencv.js', import.meta.url)` asset can't be resolved
// and the bundler emits a stub that throws at runtime. Mock the URL seam so the loader's
// fetch path can be exercised without the asset being present in the module graph.
rstest.mock('./opencv-source-url', () => ({
    getOpenCVSourceUrl: () => new URL('https://opencv.test/opencv.js'),
}));

type MutableGlobal = typeof globalThis & { cv?: unknown; fetch: typeof fetch };

const g = globalThis as MutableGlobal;

/**
 * Reset the module registry and re-import so the module-level `opencv`/`self.cv`
 * cache doesn't leak between tests.
 */
const loadFresh = async () => {
    rstest.resetModules();
    return (await import('./opencv-loader')).OpenCVLoader;
};

const mockFetchResponse = (response: Partial<Response>) => {
    g.fetch = rstest.fn(async () => response as Response);
};

describe('OpenCVLoader', () => {
    const originalFetch = g.fetch;

    beforeEach(() => {
        delete g.cv;
    });

    afterEach(() => {
        g.fetch = originalFetch;
        delete g.cv;
        // `doMock` isn't reset by `resetModules()` — restore the default stub so
        // it doesn't leak into tests that run after the "not configured" case below.
        rstest.doMock('./opencv-source-url', () => ({
            getOpenCVSourceUrl: () => new URL('https://opencv.test/opencv.js'),
        }));
    });

    it('propagates the "not configured" error from getOpenCVSourceUrl without fetching', async () => {
        // `doMock` (unlike the hoisted `mock` above) applies only to the next
        // fresh import, so it can override the module-level mock for this test.
        rstest.doMock('./opencv-source-url', () => ({
            getOpenCVSourceUrl: () => {
                throw new Error('OpenCV.js source URL is not configured.');
            },
        }));
        g.fetch = rstest.fn();

        const OpenCVLoader = await loadFresh();

        await expect(OpenCVLoader()).rejects.toThrow('OpenCV.js source URL is not configured');
        expect(g.fetch).not.toHaveBeenCalled();
    });

    it('throws a descriptive error when the fetch response is not ok', async () => {
        mockFetchResponse({ ok: false, status: 404, statusText: 'Not Found' });

        const OpenCVLoader = await loadFresh();

        await expect(OpenCVLoader()).rejects.toThrow('Failed to fetch opencv.js: 404 Not Found');
    });

    it('throws when evaluating the source does not set self.cv', async () => {
        mockFetchResponse({ ok: true, text: async () => '/* deliberately does not set cv */' });

        const OpenCVLoader = await loadFresh();

        await expect(OpenCVLoader()).rejects.toThrow('self.cv was not set');
    });

    it('evaluates the fetched source and unwraps the cv thenable into the API', async () => {
        // Emscripten's build sets `this.cv` to a promise that resolves with the API,
        // so the loader must await it to reach the real namespace (Mat, ...).
        mockFetchResponse({
            ok: true,
            text: async () => 'this.cv = Promise.resolve({ Mat: function () {}, __stub: true });',
        });

        const OpenCVLoader = await loadFresh();
        const cv = (await OpenCVLoader()) as { Mat: unknown; __stub: boolean };

        expect(cv.__stub).toBe(true);
        expect(typeof cv.Mat).toBe('function');
    });
});
