import {
    AreaChart as RechartsAreaChart,
    Area,
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

export interface AreaChartSeriesConfig {
    /** Data key to plot on the Y axis. */
    dataKey: string;
    /** Display name for tooltip/legend. */
    name?: string;
    /** Color override (uses theme palette by default). */
    color?: string;
    /** Stroke width. @default 2 */
    strokeWidth?: number;
    /** Fill opacity for the area. @default 0.15 */
    fillOpacity?: number;
    /** Whether the areas from multiple series stack on top of each other. @default false */
    stacked?: boolean;
}

export interface AreaChartProps {
    /** Chart data array. */
    data: Record<string, unknown>[];
    /** Area series definitions. */
    series: [AreaChartSeriesConfig, ...AreaChartSeriesConfig[]];
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
 * A fully themed area chart backed by Recharts.
 * Supports multiple series with optional stacking and fill.
 * Animation disabled by default; pass `animate` to enable.
 *
 * @example
 * ```tsx
 * <AreaChart
 *   data={[{ week: 'W1', accuracy: 0.72 }, { week: 'W2', accuracy: 0.85 }]}
 *   series={[{ dataKey: 'accuracy', name: 'Model Accuracy', fillOpacity: 0.2 }]}
 *   xAxisKey="week"
 *   aria-label="Model accuracy over time"
 * />
 * ```
 *
 * @example Log scale
 * ```tsx
 * <AreaChart
 *   data={data}
 *   series={[{ dataKey: 'value' }]}
 *   yScale={{ scale: 'log', domain: [1, 'auto'] }}
 *   aria-label="Log-scale area chart"
 * />
 * ```
 */
export function AreaChart({
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
}: AreaChartProps) {
    const theme = useChartsTheme();

    const axisStyle = {
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        fill: theme.typography.color,
    };

    // Determine if any series opts into stacking
    const hasStacked = series.some((s) => s.stacked);

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsAreaChart data={data} margin={margin}>
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
                            <Area
                                key={s.dataKey}
                                type="monotone"
                                dataKey={s.dataKey}
                                name={s.name ?? s.dataKey}
                                stroke={color}
                                strokeWidth={s.strokeWidth ?? 2}
                                fill={color}
                                fillOpacity={s.fillOpacity ?? 0.15}
                                stackId={hasStacked && s.stacked ? 'stack' : undefined}
                                isAnimationActive={animate}
                            />
                        );
                    })}
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    );
}
