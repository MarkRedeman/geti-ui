import { useCallback } from 'react';
import type { ChartLegendProps } from '../primitives/ChartLegend';
import { extractLegendSeriesKey } from './legend';
import type { useSeriesHighlight } from './useSeriesHighlight';

export interface UseLegendHighlightOptions {
    /** Master toggle — when false all legend handlers are pass-through only. @default true */
    enabled?: boolean;
    /** Wire up hover enter/leave to set/clear hovered state. @default true */
    legendHover?: boolean;
    /** Wire up click to toggle pinned state. @default false */
    legendClick?: boolean;
}

export interface LegendHighlightHandlers {
    onMouseEnter: NonNullable<ChartLegendProps['onMouseEnter']>;
    onMouseLeave: NonNullable<ChartLegendProps['onMouseLeave']>;
    onClick: NonNullable<ChartLegendProps['onClick']>;
}

/**
 * Wires Recharts legend mouse/click events to a highlight state object.
 *
 * Passthrough handlers (from `legendProps`) are always called first so that
 * consumers can still attach their own side-effects even when highlighting is active.
 *
 * @example
 * ```tsx
 * const highlightState = useChartHighlight({ ...highlight, enabled: highlightEnabled });
 * const legendHandlers = useLegendHighlight(highlightState, {
 *   enabled: highlightEnabled,
 *   legendHover: interaction?.legendHover ?? true,
 *   legendClick: interaction?.legendClick ?? false,
 * }, legendProps);
 * ```
 */
export function useLegendHighlight(
    highlightState: ReturnType<typeof useSeriesHighlight>,
    options: UseLegendHighlightOptions = {},
    passthrough?: Pick<ChartLegendProps, 'onMouseEnter' | 'onMouseLeave' | 'onClick'>
): LegendHighlightHandlers {
    const { enabled = true, legendHover = true, legendClick = false } = options;

    const onMouseEnter: NonNullable<ChartLegendProps['onMouseEnter']> = useCallback(
        (entry, index, event) => {
            passthrough?.onMouseEnter?.(entry, index, event);
            if (!enabled || !legendHover) {
                return;
            }
            const key = extractLegendSeriesKey(entry);
            if (key) {
                highlightState.setHovered([key]);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enabled, legendHover, highlightState.setHovered, passthrough?.onMouseEnter]
    );

    const onMouseLeave: NonNullable<ChartLegendProps['onMouseLeave']> = useCallback(
        (entry, index, event) => {
            passthrough?.onMouseLeave?.(entry, index, event);
            if (!enabled || !legendHover) {
                return;
            }
            highlightState.clearHover();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enabled, legendHover, highlightState.clearHover, passthrough?.onMouseLeave]
    );

    const onClick: NonNullable<ChartLegendProps['onClick']> = useCallback(
        (entry, index, event) => {
            passthrough?.onClick?.(entry, index, event);
            if (!enabled || !legendClick) {
                return;
            }
            const key = extractLegendSeriesKey(entry);
            if (key) {
                highlightState.togglePinnedKey(key, 'legend-click');
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enabled, legendClick, highlightState.togglePinnedKey, passthrough?.onClick]
    );

    return { onMouseEnter, onMouseLeave, onClick };
}
