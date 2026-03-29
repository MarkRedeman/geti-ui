import {
    ResponsiveContainer,
    Scatter,
    ScatterChart as RechartsScatterChart,
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

export interface ThroughputVsLatencyPoint {
    /** Throughput value (e.g. images/sec). */
    throughput: number;
    /** Latency value (e.g. ms). */
    latency: number;
    /** Optional run/batch label. */
    label?: string;
}

export interface ThroughputVsLatencySeries {
    /** Series name. */
    name: string;
    /** Scatter points. */
    data: ThroughputVsLatencyPoint[];
    /** Optional color override. */
    color?: string;
}

export interface ThroughputVsLatencyChartProps {
    /** One or more point series. */
    series: [ThroughputVsLatencySeries, ...ThroughputVsLatencySeries[]];
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
    /** Marker size in px. @default 10 */
    markerSize?: number;
    /** Use logarithmic scale on throughput axis. @default false */
    xLogScale?: boolean;
    /** Use logarithmic scale on latency axis. @default false */
    yLogScale?: boolean;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'type' | 'dataKey'>;
    /** Props passed to Y axis. */
    yAxisProps?: Omit<YAxisProps, 'type' | 'dataKey'>;
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

export function ThroughputVsLatencyChart({
    series,
    width = '100%',
    height = 340,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    markerSize = 10,
    xLogScale = false,
    yLogScale = false,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ThroughputVsLatencyChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const allPoints = series.flatMap((s) => s.data);
    const minThroughput = allPoints.length ? Math.min(...allPoints.map((p) => p.throughput)) : 1;
    const maxThroughput = allPoints.length ? Math.max(...allPoints.map((p) => p.throughput)) : 100;
    const minLatency = allPoints.length ? Math.min(...allPoints.map((p) => p.latency)) : 1;
    const maxLatency = allPoints.length ? Math.max(...allPoints.map((p) => p.latency)) : 100;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsScatterChart margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey="throughput"
                        scale={xLogScale ? 'log' : 'linear'}
                        domain={xLogScale ? [Math.max(minThroughput, Number.EPSILON), maxThroughput] : [0, 'auto']}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        type="number"
                        dataKey="latency"
                        scale={yLogScale ? 'log' : 'linear'}
                        domain={yLogScale ? [Math.max(minLatency, Number.EPSILON), maxLatency] : [0, 'auto']}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && (
                        <ChartTooltip
                            formatter={(value, key) => {
                                if (key === 'throughput') {
                                    return [Number(value).toFixed(2), 'Throughput'];
                                }
                                if (key === 'latency') {
                                    return [`${Number(value).toFixed(2)} ms`, 'Latency'];
                                }
                                return [value, key];
                            }}
                            labelFormatter={(label) => `Point ${label}`}
                            {...tooltipProps}
                        />
                    )}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, i) => {
                        const color = s.color ?? theme.dataColors[i % theme.dataColors.length];
                        return (
                            <Scatter
                                key={s.name}
                                name={s.name}
                                data={s.data}
                                fill={color}
                                isAnimationActive={animate}
                                shape={(props) => (
                                    <circle cx={props.cx} cy={props.cy} r={markerSize / 2} fill={color} />
                                )}
                                legendType="circle"
                            />
                        );
                    })}
                </RechartsScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
