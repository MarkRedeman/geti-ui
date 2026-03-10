import { createContext, type ReactNode, useMemo } from 'react';
import type { ChartTheme } from '../theming/types';
import { defaultGetiChartTheme } from '../theming/tokens';
import { mergeChartTheme, type DeepPartial } from '../theming/chartTheme';

/**
 * React context holding the active chart theme.
 * Defaults to the standard Geti dark chart theme.
 */
export const ChartsThemeContext = createContext<ChartTheme>(defaultGetiChartTheme);

export interface ChartsThemeProviderProps {
    /**
     * Partial theme overrides merged on top of the default Geti chart theme.
     * Only the fields you provide will override the defaults.
     */
    theme?: DeepPartial<ChartTheme>;
    /** Child components that will consume the chart theme. */
    children: ReactNode;
}

/**
 * Provides a chart theme to all descendant chart components.
 * Wraps your chart hierarchy to apply a consistent visual style.
 *
 * @example
 * ```tsx
 * <ChartsThemeProvider theme={{ dataColors: ['#ff0000', '#00ff00'] }}>
 *   <LineChart ... />
 * </ChartsThemeProvider>
 * ```
 */
export function ChartsThemeProvider({ theme, children }: ChartsThemeProviderProps) {
    const resolvedTheme = useMemo(
        () => (theme ? mergeChartTheme(theme) : defaultGetiChartTheme),
        [theme]
    );
    return <ChartsThemeContext.Provider value={resolvedTheme}>{children}</ChartsThemeContext.Provider>;
}
