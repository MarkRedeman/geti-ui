import {
    ScatterChart as RechartsScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    ResponsiveContainer,
    type XAxisProps,
    type YAxisProps,
    type ZAxisProps,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';

export interface ScatterChartSeriesConfig {
    /** Unique name for this scatter series (used in legend/tooltip). */
    name: string;
    /** Data for this series. Each point should have x and y numeric properties. */
    data: Record<string, unknown>[];
    /** Color override (uses theme palette by default). */
    color?: string;
    /** Key for the X value in each data point. @default 'x' */
    xKey?: string;
    /** Key for the Y value in each data point. @default 'y' */
    yKey?: string;
    /** Key for the bubble size (Z axis). Optional. */
    zKey?: string;
    /** Shape for each data point. @default 'circle' */
    shape?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
}

export interface ScatterChartProps {
    /** Scatter series definitions. Each series has its own data array. */
    series: [ScatterChartSeriesConfig, ...ScatterChartSeriesConfig[]];
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 300 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default false */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** X axis label. */
    xAxisLabel?: string;
    /** Y axis label. */
    yAxisLabel?: string;
    /** Props passed to the X axis. */
    xAxisProps?: XAxisProps;
    /** Props passed to the Y axis. */
    yAxisProps?: YAxisProps;
    /** Props passed to the Z (bubble size) axis. */
    zAxisProps?: ZAxisProps;
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
 * A fully themed scatter / bubble chart backed by Recharts.
 * Multiple series are supported, each with its own data array.
 * Animation disabled by default; pass `animate` to enable.
 *
 * @example
 * ```tsx
 * <ScatterChart
 *   series={[{
 *     name: 'Model A',
 *     data: [{ x: 0.8, y: 0.9 }, { x: 0.75, y: 0.85 }]
 *   }]}
 *   xAxisLabel="Precision"
 *   yAxisLabel="Recall"
 *   aria-label="Precision-Recall scatter"
 * />
 * ```
 */
export function ScatterChart({
    series,
    width = '100%',
    height = 300,
    showGrid = true,
    showTooltip = true,
    showLegend = false,
    animate = false,
    xAxisLabel,
    yAxisLabel,
    xAxisProps,
    yAxisProps,
    zAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ScatterChartProps) {
    const theme = useChartsTheme();

    const axisStyle = {
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        fill: theme.typography.color,
    };

    // Build data from first series to determine axis keys
    const firstSeries = series[0];
    const xKey = firstSeries.xKey ?? 'x';
    const yKey = firstSeries.yKey ?? 'y';

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsScatterChart margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        dataKey={xKey}
                        type="number"
                        name={xAxisLabel}
                        tick={axisStyle}
                        axisLine={{ stroke: theme.axis.lineColor, strokeWidth: theme.axis.strokeWidth }}
                        tickLine={{ stroke: theme.axis.tickColor }}
                        label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -4, fill: theme.typography.color, fontSize: theme.typography.fontSize } : undefined}
                        {...xAxisProps}
                    />
                    <YAxis
                        dataKey={yKey}
                        type="number"
                        name={yAxisLabel}
                        tick={axisStyle}
                        axisLine={{ stroke: theme.axis.lineColor, strokeWidth: theme.axis.strokeWidth }}
                        tickLine={{ stroke: theme.axis.tickColor }}
                        label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: theme.typography.color, fontSize: theme.typography.fontSize } : undefined}
                        {...yAxisProps}
                    />
                    {zAxisProps && <ZAxis {...zAxisProps} />}

                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, index) => {
                        const color = s.color ?? theme.dataColors[index % theme.dataColors.length];
                        return (
                            <Scatter
                                key={s.name}
                                name={s.name}
                                data={s.data}
                                fill={color}
                                shape={s.shape ?? 'circle'}
                                isAnimationActive={animate}
                            />
                        );
                    })}
                </RechartsScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
