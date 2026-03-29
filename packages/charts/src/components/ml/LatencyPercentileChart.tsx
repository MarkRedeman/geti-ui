import {
    Line,
    LineChart as RechartsLineChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartLegend, type ChartLegendProps } from '../../primitives/ChartLegend';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface LatencyPercentileChartProps {
    /** Rows for each x-axis point (e.g. batch size, model, run). */
    data: Record<string, unknown>[];
    /** X-axis key. @default 'label' */
    xAxisKey?: string;
    /** Data key for P50 latency. @default 'p50' */
    p50Key?: string;
    /** Data key for P95 latency. @default 'p95' */
    p95Key?: string;
    /** Data key for P99 latency. @default 'p99' */
    p99Key?: string;
    /** Unit label for tooltip/legend. @default 'ms' */
    unit?: string;
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 340 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Optional target latency reference line. */
    targetLatency?: number;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'dataKey'>;
    /** Props passed to Y axis. */
    yAxisProps?: YAxisProps;
    /** Props passed to grid primitive. */
    gridProps?: ChartGridProps;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Props passed to legend primitive. */
    legendProps?: ChartLegendProps;
    /** Chart margin. */
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

export function LatencyPercentileChart({
    data,
    xAxisKey = 'label',
    p50Key = 'p50',
    p95Key = 'p95',
    p99Key = 'p99',
    unit = 'ms',
    width = '100%',
    height = 340,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    targetLatency,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: LatencyPercentileChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const p50Color = theme.dataColors[0];
    const p95Color = theme.dataColors[1] ?? theme.dataColors[0];
    const p99Color = theme.dataColors[2] ?? theme.dataColors[0];

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={data} margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        dataKey={xAxisKey}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && (
                        <ChartTooltip
                            formatter={(value, name) => [`${Number(value).toFixed(2)} ${unit}`, String(name)]}
                            {...tooltipProps}
                        />
                    )}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {typeof targetLatency === 'number' && (
                        <ReferenceLine
                            y={targetLatency}
                            stroke={theme.axis.lineColor}
                            strokeDasharray="4 3"
                            label={{
                                value: `Target ${targetLatency} ${unit}`,
                                position: 'insideTopRight',
                                fill: theme.typography.color,
                                fontSize: theme.typography.fontSize,
                            }}
                        />
                    )}

                    <Line
                        type="monotone"
                        dataKey={p50Key}
                        name={`P50 (${unit})`}
                        stroke={p50Color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: theme.activeDotRadius, fill: p50Color }}
                        isAnimationActive={animate}
                    />
                    <Line
                        type="monotone"
                        dataKey={p95Key}
                        name={`P95 (${unit})`}
                        stroke={p95Color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: theme.activeDotRadius, fill: p95Color }}
                        isAnimationActive={animate}
                    />
                    <Line
                        type="monotone"
                        dataKey={p99Key}
                        name={`P99 (${unit})`}
                        stroke={p99Color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: theme.activeDotRadius, fill: p99Color }}
                        isAnimationActive={animate}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
