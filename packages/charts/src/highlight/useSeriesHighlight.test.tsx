import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { useSeriesHighlight } from './useSeriesHighlight';

describe('useSeriesHighlight', () => {
    it('returns full opacity when disabled', () => {
        const { result } = renderHook(() => useSeriesHighlight({ enabled: false }));

        act(() => {
            result.current.setHovered(['train']);
        });

        expect(result.current.getOpacity('train')).toBe(1);
        expect(result.current.getOpacity('val')).toBe(1);
    });

    it('dims non-active keys in single mode hover', () => {
        const { result } = renderHook(() => useSeriesHighlight({ enabled: true, mode: 'single' }));

        act(() => {
            result.current.setHovered(['train']);
        });

        expect(result.current.getOpacity('train')).toBe(1);
        expect(result.current.getOpacity('val')).toBe(0.2);
    });

    it('supports multi-select pinning', () => {
        const { result } = renderHook(() => useSeriesHighlight({ enabled: true, mode: 'multiple' }));

        act(() => {
            result.current.togglePinnedKey('train');
            result.current.togglePinnedKey('val');
        });

        expect(result.current.pinnedKeys).toEqual(['train', 'val']);
        expect(result.current.getOpacity('train')).toBe(1);
        expect(result.current.getOpacity('val')).toBe(1);
        expect(result.current.getOpacity('test')).toBe(0.2);
    });

    it('toggles off single pinned key', () => {
        const { result } = renderHook(() => useSeriesHighlight({ enabled: true, mode: 'single' }));

        act(() => {
            result.current.togglePinnedKey('train');
        });

        expect(result.current.pinnedKeys).toEqual(['train']);

        act(() => {
            result.current.togglePinnedKey('train');
        });

        expect(result.current.pinnedKeys).toEqual([]);
    });
});
