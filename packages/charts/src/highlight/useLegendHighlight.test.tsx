import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { useSeriesHighlight } from './useSeriesHighlight';
import { useLegendHighlight } from './useLegendHighlight';

describe('useLegendHighlight', () => {
    it('calls setHovered on mouse enter when legendHover is enabled', () => {
        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendHover: true, legendClick: false },
                undefined
            )
        );

        act(() => {
            result.current.onMouseEnter({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(stateResult.current.hoveredKeys).toEqual(['train']);
    });

    it('calls clearHover on mouse leave when legendHover is enabled', () => {
        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendHover: true, legendClick: false },
                undefined
            )
        );

        act(() => {
            result.current.onMouseEnter({ dataKey: 'train' } as never, 0, {} as never);
        });

        act(() => {
            result.current.onMouseLeave({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(stateResult.current.hoveredKeys).toEqual([]);
    });

    it('does NOT set hover when legendHover is disabled', () => {
        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendHover: false },
                undefined
            )
        );

        act(() => {
            result.current.onMouseEnter({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(stateResult.current.hoveredKeys).toEqual([]);
    });

    it('does NOT set hover when enabled is false', () => {
        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: false, legendHover: true },
                undefined
            )
        );

        act(() => {
            result.current.onMouseEnter({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(stateResult.current.hoveredKeys).toEqual([]);
    });

    it('calls togglePinnedKey on click when legendClick is enabled', () => {
        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendHover: false, legendClick: true },
                undefined
            )
        );

        act(() => {
            result.current.onClick({ dataKey: 'val' } as never, 0, {} as never);
        });

        expect(stateResult.current.pinnedKeys).toEqual(['val']);

        // Click again to toggle off
        act(() => {
            result.current.onClick({ dataKey: 'val' } as never, 0, {} as never);
        });

        expect(stateResult.current.pinnedKeys).toEqual([]);
    });

    it('does NOT toggle pin on click when legendClick is disabled', () => {
        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendHover: false, legendClick: false },
                undefined
            )
        );

        act(() => {
            result.current.onClick({ dataKey: 'val' } as never, 0, {} as never);
        });

        expect(stateResult.current.pinnedKeys).toEqual([]);
    });

    it('chains passthrough onMouseEnter before highlight logic', () => {
        const calls: string[] = [];

        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendHover: true },
                { onMouseEnter: () => calls.push('passthrough') }
            )
        );

        act(() => {
            result.current.onMouseEnter({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(calls).toEqual(['passthrough']);
        expect(stateResult.current.hoveredKeys).toEqual(['train']);
    });

    it('chains passthrough onMouseLeave before highlight logic', () => {
        const calls: string[] = [];

        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendHover: true },
                { onMouseLeave: () => calls.push('passthrough') }
            )
        );

        act(() => {
            result.current.onMouseLeave({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(calls).toEqual(['passthrough']);
    });

    it('chains passthrough onClick before highlight logic', () => {
        const calls: string[] = [];

        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: true, legendClick: true },
                { onClick: () => calls.push('passthrough') }
            )
        );

        act(() => {
            result.current.onClick({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(calls).toEqual(['passthrough']);
        expect(stateResult.current.pinnedKeys).toEqual(['train']);
    });

    it('still calls passthrough when highlight disabled', () => {
        const calls: string[] = [];

        const { result: stateResult } = renderHook(() =>
            useSeriesHighlight({ enabled: true, mode: 'single' })
        );

        const { result } = renderHook(() =>
            useLegendHighlight(
                stateResult.current,
                { enabled: false },
                { onMouseEnter: () => calls.push('passthrough') }
            )
        );

        act(() => {
            result.current.onMouseEnter({ dataKey: 'train' } as never, 0, {} as never);
        });

        expect(calls).toEqual(['passthrough']);
        // Highlight state should not have been touched
        expect(stateResult.current.hoveredKeys).toEqual([]);
    });
});
