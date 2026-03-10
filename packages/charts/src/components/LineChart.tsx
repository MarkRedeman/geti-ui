import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';
import type { AxisScaleConfig } from '../types/axisScale';

export type { AxisScaleConfig };

export interface LineChartSeriesConfig {
    /** Data key to plot on the Y axis. */
    dataKey: string;
    /** Display name used in tooltips and legend. */
    name?: string;
    /** Override color for this series (uses theme palette by default). */
    color?: string;
    /** Stroke width. @default 2 */
    strokeWidth?: number;
    /** Dot radius. Uses theme default when not specified. */
    dotRadius?: number;
    /** Whether this series renders as dashed. @default false */
    dashed?: boolean;
}

export interface LineChartProps {
    /** Chart data array. Each object should have keys matching your series configs. */
    data: Record<string, unknown>[];
    /** Series definitions. At least one required. */
    series: [LineChartSeriesConfig, ...LineChartSeriesConfig[]];
    /**
     * Key in data used for the X axis labels.
     * @default 'name'
     */
    xAxisKey?: string;
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
    /**
     * Scale configuration for the X axis.
     * Controls the scale type, domain, and overflow behaviour.
     *
     * @example { scale: 'log', domain: [1, 'auto'] }
     */
    xScale?: AxisScaleConfig;
    /**
     * Scale configuration for the Y axis.
     * Controls the scale type, domain, and overflow behaviour.
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
 * A fully themed line chart backed by Recharts.
 * Animation is disabled by default; pass `animate` to enable it.
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={[{ month: 'Jan', sales: 400 }, { month: 'Feb', sales: 600 }]}
 *   series={[{ dataKey: 'sales', name: 'Sales' }]}
 *   xAxisKey="month"
 *   aria-label="Monthly sales"
 * />
 * ```
 *
 * @example Log scale — useful for loss curves spanning orders of magnitude
 * ```tsx
 * <LineChart
 *   data={data}
 *   series={[{ dataKey: 'loss' }]}
 *   yScale={{ scale: 'log', domain: [0.001, 'auto'] }}
 *   aria-label="Log-scale loss"
 * />
 * ```
 */
export function LineChart({
    data,
    series,
    xAxisKey = 'name',
    width = '100%',
    height = 300,
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
}: LineChartProps) {
    const theme = useChartsTheme();

    const axisStyle = {
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        fill: theme.typography.color,
    };

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={data} margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        dataKey={xAxisKey}
                        tick={axisStyle}
                        axisLine={{ stroke: theme.axis.lineColor, strokeWidth: theme.axis.strokeWidth }}
                        tickLine={{ stroke: theme.axis.tickColor }}
                        scale={xScale?.scale}
                        domain={xScale?.domain}
                        allowDataOverflow={xScale?.allowDataOverflow}
                        {...xAxisProps}
                    />
                    <YAxis
                        tick={axisStyle}
                        axisLine={{ stroke: theme.axis.lineColor, strokeWidth: theme.axis.strokeWidth }}
                        tickLine={{ stroke: theme.axis.tickColor }}
                        scale={yScale?.scale}
                        domain={yScale?.domain}
                        allowDataOverflow={yScale?.allowDataOverflow}
                        {...yAxisProps}
                    />

                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, index) => {
                        const color = s.color ?? theme.dataColors[index % theme.dataColors.length];
                        return (
                            <Line
                                key={s.dataKey}
                                type="monotone"
                                dataKey={s.dataKey}
                                name={s.name ?? s.dataKey}
                                stroke={color}
                                strokeWidth={s.strokeWidth ?? 2}
                                strokeDasharray={s.dashed ? '5 3' : undefined}
                                dot={{ r: s.dotRadius ?? theme.dotRadius, fill: color }}
                                activeDot={{ r: theme.activeDotRadius, fill: color }}
                                isAnimationActive={animate}
                            />
                        );
                    })}
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
