import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    ResponsiveContainer,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';
import type { AxisScaleConfig } from '../types/axisScale';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../utils/axisStyles';

export interface BarChartSeriesConfig {
    /** Data key to plot. */
    dataKey: string;
    /** Display name for tooltip/legend. */
    name?: string;
    /** Color override (uses theme palette by default). */
    color?: string;
    /** Border radius on bars. @default 2 */
    radius?: number;
}

export interface BarChartProps {
    /** Chart data array. */
    data: Record<string, unknown>[];
    /** Bar series definitions. */
    series: [BarChartSeriesConfig, ...BarChartSeriesConfig[]];
    /**
     * Key in data used for the X axis categories.
     * @default 'name'
     */
    xAxisKey?: string;
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 300 */
    height?: number;
    /** Orientation of the bars. @default 'horizontal' */
    layout?: 'vertical' | 'horizontal';
    /** Gap between bar groups (0–1). @default '20%' */
    barCategoryGap?: string | number;
    /** Gap between bars within a group (0–1). @default '4%' */
    barGap?: string | number;
    /** Whether multiple series should be stacked instead of grouped. @default false */
    stacked?: boolean;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default false */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /**
     * Scale configuration for the X axis (value axis when `layout="vertical"`).
     * For bar charts, scale is most commonly applied to the numeric axis.
     *
     * ⚠ Logarithmic scale on a bar chart requires all values to be > 0.
     *
     * @example { scale: 'log', domain: [1, 'auto'] }
     */
    xScale?: AxisScaleConfig;
    /**
     * Scale configuration for the Y axis (value axis when `layout="horizontal"`).
     *
     * @example { scale: 'log', domain: [1, 'auto'] }
     */
    yScale?: AxisScaleConfig;
    /** Props passed to the X axis. */
    xAxisProps?: Omit<XAxisProps, 'dataKey'>;
    /** Props passed to the Y axis. */
    yAxisProps?: YAxisProps;
    /** Props passed to the grid primitive. */
    gridProps?: ChartGridProps;
    /** Props passed to the tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Props passed to the legend primitive. */
    legendProps?: ChartLegendProps;
    /** Chart margin. */
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

/**
 * A fully themed bar chart backed by Recharts.
 * Supports multiple series, horizontal/vertical layout, and theme-driven colors.
 * Animation disabled by default; pass `animate` to enable.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[{ category: 'A', count: 10 }, { category: 'B', count: 25 }]}
 *   series={[{ dataKey: 'count', name: 'Count' }]}
 *   xAxisKey="category"
 *   aria-label="Category counts"
 * />
 * ```
 *
 * @example Log scale on the value axis
 * ```tsx
 * <BarChart
 *   data={data}
 *   series={[{ dataKey: 'count' }]}
 *   yScale={{ scale: 'log', domain: [1, 'auto'] }}
 *   aria-label="Log-scale bar chart"
 * />
 * ```
 */
export function BarChart({
    data,
    series,
    xAxisKey = 'name',
    width = '100%',
    height = 300,
    layout = 'horizontal',
    barCategoryGap = '20%',
    barGap = '4%',
    stacked = false,
    showGrid = true,
    showTooltip = true,
    showLegend = false,
    animate = false,
    xScale,
    yScale,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: BarChartProps) {
    const theme = useChartsTheme();

    const axisStyle = getAxisTickStyle(theme);

    // Recharts layout: 'horizontal' = bars grow up, 'vertical' = bars grow sideways
    const xProps: XAxisProps =
        layout === 'vertical'
            ? { type: 'number', scale: xScale?.scale, domain: xScale?.domain, allowDataOverflow: xScale?.allowDataOverflow, ...xAxisProps }
            : { dataKey: xAxisKey, scale: xScale?.scale, domain: xScale?.domain, allowDataOverflow: xScale?.allowDataOverflow, ...xAxisProps };

    const yProps: YAxisProps =
        layout === 'vertical'
            ? { type: 'category', dataKey: xAxisKey, scale: yScale?.scale, domain: yScale?.domain, allowDataOverflow: yScale?.allowDataOverflow, ...yAxisProps }
            : { scale: yScale?.scale, domain: yScale?.domain, allowDataOverflow: yScale?.allowDataOverflow, ...yAxisProps };

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
                    data={data}
                    layout={layout}
                    barCategoryGap={barCategoryGap}
                    barGap={barGap}
                    margin={margin}
                    accessibilityLayer={false}
                >
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xProps}
                    />
                    <YAxis
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yProps}
                    />

                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, seriesIndex) => {
                        const defaultColor = theme.dataColors[seriesIndex % theme.dataColors.length];
                        return (
                            <Bar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                name={s.name ?? s.dataKey}
                                stackId={stacked ? 'stack' : undefined}
                                fill={s.color ?? defaultColor}
                                radius={[s.radius ?? 2, s.radius ?? 2, 0, 0]}
                                isAnimationActive={animate}
                            >
                                {/* Support per-bar coloring for single-series charts */}
                                {series.length === 1 ?
                                    data.map((_entry, dataIndex) => (
                                        <Cell
                                            key={`cell-${dataIndex}`}
                                            fill={theme.dataColors[dataIndex % theme.dataColors.length]}
                                        />
                                    )) : null}
                            </Bar>
                        );
                    })}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
