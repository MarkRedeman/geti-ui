import '@testing-library/jest-dom';

declare global {
    // React 19 checks this flag before enabling act() behavior in tests.
    var IS_REACT_ACT_ENVIRONMENT: boolean;
}

// React 19 requires explicit act environment opt-in for non-Jest runners.
// Rstest/Vitest-compatible global keeps testing-library interactions stable.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
