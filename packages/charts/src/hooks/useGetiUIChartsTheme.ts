import { useEffect, useState } from 'react';
import type { ChartTheme } from '../theming/types';
import { defaultGetiChartTheme } from '../theming/tokens';
import { mergeChartTheme } from '../theming/chartTheme';

/**
 * Optional adapter that reads Geti UI CSS custom properties from the document root
 * and maps them to a ChartTheme.
 *
 * This hook does NOT import `@geti-ai/ui` — it reads CSS variables from computed
 * styles so it works as long as the Geti theme CSS is loaded in the page.
 *
 * Pass the returned theme to `ChartsThemeProvider` to synchronise chart colors
 * with the active Geti UI theme tokens.
 *
 * @example
 * ```tsx
 * function MyDashboard() {
 *   const chartTheme = useGetiUIChartsTheme();
 *   return (
 *     <ChartsThemeProvider theme={chartTheme}>
 *       <LineChart ... />
 *     </ChartsThemeProvider>
 *   );
 * }
 * ```
 */
export function useGetiUIChartsTheme(): Partial<ChartTheme> {
    const [theme, setTheme] = useState<Partial<ChartTheme>>({});

    useEffect(() => {
        const style = getComputedStyle(document.documentElement);

        const get = (varName: string, fallback: string): string => {
            const val = style.getPropertyValue(varName).trim();
            return val !== '' ? val : fallback;
        };

        setTheme(
            mergeChartTheme({
                backgroundColor: get(
                    '--spectrum-global-color-gray-100',
                    defaultGetiChartTheme.backgroundColor
                ),
                typography: {
                    color: get(
                        '--spectrum-global-color-gray-700',
                        defaultGetiChartTheme.typography.color
                    ),
                    fontFamily: get(
                        '--spectrum-alias-body-text-font-family',
                        defaultGetiChartTheme.typography.fontFamily
                    ),
                },
                grid: {
                    stroke: get(
                        '--spectrum-global-color-gray-300',
                        defaultGetiChartTheme.grid.stroke
                    ),
                },
                axis: {
                    lineColor: get(
                        '--spectrum-global-color-gray-400',
                        defaultGetiChartTheme.axis.lineColor
                    ),
                    tickColor: get(
                        '--spectrum-global-color-gray-400',
                        defaultGetiChartTheme.axis.tickColor
                    ),
                },
                tooltip: {
                    backgroundColor: get(
                        '--spectrum-global-color-gray-200',
                        defaultGetiChartTheme.tooltip.backgroundColor
                    ),
                    borderColor: get(
                        '--spectrum-global-color-gray-400',
                        defaultGetiChartTheme.tooltip.borderColor
                    ),
                    color: get(
                        '--spectrum-global-color-gray-800',
                        defaultGetiChartTheme.tooltip.color
                    ),
                },
                legend: {
                    color: get(
                        '--spectrum-global-color-gray-700',
                        defaultGetiChartTheme.legend.color
                    ),
                },
            })
        );
    }, []);

    return theme;
}
