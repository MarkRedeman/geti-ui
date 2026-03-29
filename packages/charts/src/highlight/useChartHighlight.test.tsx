import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from '@rstest/core';
import { HighlightProvider } from './HighlightProvider';
import { useChartHighlight } from './useChartHighlight';

describe('useChartHighlight', () => {
    it('returns local state when no provider is present', () => {
        const { result } = renderHook(() => useChartHighlight({ enabled: true, mode: 'single' }));

        act(() => {
            result.current.setHovered(['train']);
        });

        expect(result.current.hoveredKeys).toEqual(['train']);
        expect(result.current.enabled).toBe(true);
    });

    it('returns full opacity when disabled and no provider', () => {
        const { result } = renderHook(() => useChartHighlight({ enabled: false }));

        act(() => {
            result.current.setHovered(['train']);
        });

        expect(result.current.getOpacity('train')).toBe(1);
        expect(result.current.getOpacity('val')).toBe(1);
    });

    it('returns provider state when HighlightProvider is present', () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <HighlightProvider enabled mode="single">
                {children}
            </HighlightProvider>
        );

        const { result } = renderHook(() => useChartHighlight({ enabled: false }), { wrapper });

        // Provider state has enabled=true even though the local option is false
        expect(result.current.enabled).toBe(true);
    });

    it('provider state is shared - mutations affect same instance', () => {
        // Render a single hook that calls useChartHighlight twice in the same provider tree
        const wrapper = ({ children }: { children: ReactNode }) => (
            <HighlightProvider enabled mode="single">
                {children}
            </HighlightProvider>
        );

        // Both hooks in the same wrapper share the same context value object
        const { result } = renderHook(
            () => ({
                a: useChartHighlight({}),
                b: useChartHighlight({}),
            }),
            { wrapper }
        );

        act(() => {
            result.current.a.setHovered(['train']);
        });

        // Both should reflect the same provider state
        expect(result.current.a.hoveredKeys).toEqual(['train']);
        expect(result.current.b.hoveredKeys).toEqual(['train']);
    });

    it('local state is independent without a provider', () => {
        const { result: resultA } = renderHook(() => useChartHighlight({ enabled: true }));
        const { result: resultB } = renderHook(() => useChartHighlight({ enabled: true }));

        act(() => {
            resultA.current.setHovered(['train']);
        });

        expect(resultA.current.hoveredKeys).toEqual(['train']);
        // Without a provider each chart has its own independent state
        expect(resultB.current.hoveredKeys).toEqual([]);
    });
});
