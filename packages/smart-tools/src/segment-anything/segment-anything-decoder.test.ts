import { describe, expect, it } from '@rstest/core';

import { createMaskInputFeeds, getLowResMask } from './segment-anything-decoder';

describe('createMaskInputFeeds', () => {
    it('disables the mask input when there is no previous mask', () => {
        const { mask_input, has_mask_input } = createMaskInputFeeds();

        expect(Array.from(has_mask_input.data as Float32Array)).toEqual([0]);
        expect(mask_input.dims).toEqual([1, 1, 256, 256]);
    });

    it('feeds the previous mask to the decoder', () => {
        const previousMask = new Float32Array(256 * 256).fill(-3);
        const { mask_input, has_mask_input } = createMaskInputFeeds(previousMask);

        expect(Array.from(has_mask_input.data as Float32Array)).toEqual([1]);
        expect(mask_input.data).toBe(previousMask);
    });
});

describe('getLowResMask', () => {
    it('copies the mask at the given index', () => {
        // Three 2x2 masks
        const data = new Float32Array([0, 0, 0, 0, 1, 2, 3, 4, 9, 9, 9, 9]);

        expect(Array.from(getLowResMask(data, [1, 3, 2, 2], 1))).toEqual([1, 2, 3, 4]);
    });
});
