import { useContext } from 'react';
import { ChartsThemeContext } from '../primitives/ChartsThemeProvider';
import type { ChartTheme } from '../theming/types';

/**
 * Returns the current chart theme from the nearest ChartsThemeProvider.
 * Falls back to the default Geti chart theme if no provider is found.
 *
 * @example
 * ```tsx
 * const theme = useChartsTheme();
 * const firstColor = theme.dataColors[0];
 * ```
 */
export function useChartsTheme(): ChartTheme {
    return useContext(ChartsThemeContext);
}
