import { describe, expect, it } from '@rstest/core';

import {
    isFatalSessionError,
    SegmentAnythingOutputError,
    SegmentAnythingValidationError,
    SessionRunTimeoutError,
    shouldUseCpuFallback,
} from './errors';

describe('Segment Anything error classification', () => {
    it.each([
        ['memory access out of bounds', false],
        ['Non-zero status code returned while running Resize node: Failed to run JSEP kernel', true],
        ['WebGPU device lost', true],
        ["previous call to 'initWasm()' failed", true],
    ])('classifies fatal runtime error %s', (message, cpuFallback) => {
        const error = new Error(message);

        expect(isFatalSessionError(error)).toBe(true);
        expect(shouldUseCpuFallback(error)).toBe(cpuFallback);
    });

    it('classifies validation and output errors as benign', () => {
        expect(isFatalSessionError(new SegmentAnythingValidationError('invalid image'))).toBe(false);
        expect(isFatalSessionError(new SegmentAnythingOutputError('missing output'))).toBe(false);
        expect(isFatalSessionError(new Error('OpenCV pre-processing failed'))).toBe(false);
    });

    it('classifies timeouts and unknown run errors as fatal', () => {
        expect(isFatalSessionError(new SessionRunTimeoutError())).toBe(true);
        expect(isFatalSessionError(new Error('unexpected ORT rejection'))).toBe(true);
    });
});
