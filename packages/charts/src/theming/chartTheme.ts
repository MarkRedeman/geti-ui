import type { ChartTheme, DataColorPalette } from './types';
import { defaultGetiChartTheme } from './tokens';

/**
 * Deep-merges a partial theme override with the default theme.
 * Only defined fields in the override are applied.
 */
export function mergeChartTheme(override: DeepPartial<ChartTheme>): ChartTheme {
    return {
        backgroundColor: override.backgroundColor ?? defaultGetiChartTheme.backgroundColor,
        dataColors: (override.dataColors as DataColorPalette | undefined) ?? defaultGetiChartTheme.dataColors,
        cursorColor: override.cursorColor ?? defaultGetiChartTheme.cursorColor,
        cursorOpacity: override.cursorOpacity ?? defaultGetiChartTheme.cursorOpacity,
        dotRadius: override.dotRadius ?? defaultGetiChartTheme.dotRadius,
        activeDotRadius: override.activeDotRadius ?? defaultGetiChartTheme.activeDotRadius,
        typography: {
            ...defaultGetiChartTheme.typography,
            ...override.typography,
        },
        grid: {
            ...defaultGetiChartTheme.grid,
            ...override.grid,
        },
        axis: {
            ...defaultGetiChartTheme.axis,
            ...override.axis,
        },
        tooltip: {
            ...defaultGetiChartTheme.tooltip,
            ...override.tooltip,
        },
        legend: {
            ...defaultGetiChartTheme.legend,
            ...override.legend,
        },
    };
}

/** Utility: deep partial type helper. */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
