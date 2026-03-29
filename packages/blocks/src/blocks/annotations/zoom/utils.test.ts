import { describe, expect, it } from '@rstest/core';

import { clampBetween, clampTranslate, getCenterCoordinates, getZoomTransform, isWheelButton } from './utils';

describe('clampBetween', () => {
    it('returns value when within range', () => {
        expect(clampBetween(0, 5, 10)).toBe(5);
    });

    it('clamps to min when value is below', () => {
        expect(clampBetween(0, -5, 10)).toBe(0);
    });

    it('clamps to max when value is above', () => {
        expect(clampBetween(0, 15, 10)).toBe(10);
    });
});

describe('getCenterCoordinates', () => {
    it('computes centered fit-to-screen coordinates with no padding', () => {
        const result = getCenterCoordinates({ width: 500, height: 500 }, { width: 500, height: 500 });

        // No padding: scale = min(500/500, 500/500) = 1.0
        expect(result.scale).toBe(1.0);

        // Center: (500 - 500 * 1.0) / 2 = 0
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('respects aspect ratio for non-square content', () => {
        const result = getCenterCoordinates({ width: 800, height: 600 }, { width: 400, height: 200 });

        // scale = min(800/400, 600/200) = min(2, 3) = 2
        expect(result.scale).toBe(2);
    });

    it('applies pixel padding when provided', () => {
        // Container 500×500, target 500×500, padding 25px
        // available = 500 - 2*25 = 450 each axis
        // scale = min(450/500, 450/500) = 0.9
        const result = getCenterCoordinates({ width: 500, height: 500 }, { width: 500, height: 500 }, 25);

        expect(result.scale).toBe(0.9);

        // Center: (500 - 500 * 0.9) / 2 = 25
        expect(result.x).toBe(25);
        expect(result.y).toBe(25);
    });
});

describe('getZoomTransform', () => {
    it('snaps to initial when newScale is at or below initial', () => {
        const transform = getZoomTransform({
            newScale: 0.5,
            cursorX: 250,
            cursorY: 250,
            initialCoordinates: { scale: 0.9, x: 25, y: 25 },
        });

        const result = transform({ scale: 1, translate: { x: 0, y: 0 } });
        expect(result.scale).toBe(0.9);
        expect(result.translate.x).toBe(25);
        expect(result.translate.y).toBe(25);
    });

    it('computes cursor-anchored zoom transform', () => {
        const transform = getZoomTransform({
            newScale: 2,
            cursorX: 250,
            cursorY: 250,
            initialCoordinates: { scale: 0.9, x: 25, y: 25 },
        });

        const result = transform({ scale: 1, translate: { x: 0, y: 0 } });
        expect(result.scale).toBe(2);
        // scaleRatio = 2/1 = 2
        // newTranslateX = 250 - 2 * (250 - 0) = 250 - 500 = -250
        expect(result.translate.x).toBe(-250);
        expect(result.translate.y).toBe(-250);
    });
});

describe('clampTranslate', () => {
    it('clamps translation to keep content partially visible', () => {
        const result = clampTranslate(
            { x: -10000, y: -10000 },
            1,
            { width: 500, height: 500 },
            { width: 500, height: 500 }
        );

        // Should be clamped so at least 10% of content is visible
        // min x = -(500*1 - 500*1*0.1) = -450
        expect(result.x).toBe(-450);
        expect(result.y).toBe(-450);
    });

    it('clamps positive translation', () => {
        const result = clampTranslate(
            { x: 10000, y: 10000 },
            1,
            { width: 500, height: 500 },
            { width: 500, height: 500 }
        );

        // max x = 500 - 500*1*0.1 = 450
        expect(result.x).toBe(450);
        expect(result.y).toBe(450);
    });

    it('does not clamp when translation is within bounds', () => {
        const result = clampTranslate({ x: 25, y: 25 }, 0.9, { width: 500, height: 500 }, { width: 500, height: 500 });

        expect(result.x).toBe(25);
        expect(result.y).toBe(25);
    });
});

describe('isWheelButton', () => {
    it('returns true for button 1 (middle mouse)', () => {
        expect(isWheelButton({ button: 1 })).toBe(true);
    });

    it('returns false for button 0 (left mouse)', () => {
        expect(isWheelButton({ button: 0 })).toBe(false);
    });

    it('returns false for button 2 (right mouse)', () => {
        expect(isWheelButton({ button: 2 })).toBe(false);
    });
});
