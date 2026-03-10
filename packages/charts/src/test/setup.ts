import '@testing-library/jest-dom';

/**
 * Recharts ResponsiveContainer uses ResizeObserver which is not available in jsdom.
 * Polyfill with a no-op implementation so chart tests don't crash.
 */
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
