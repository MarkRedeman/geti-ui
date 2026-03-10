import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    ReferenceLine,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../../primitives/ChartLegend';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface RocCurveSeriesConfig {
    /** Data key for true-positive-rate values. */
    dataKey: string;
    /** Legend/display name. */
    name?: string;
    /** Optional color override. */
    color?: string;
    /** Line stroke width. @default 2 */
    strokeWidth?: number;
}

export interface RocCurveProps {
    /** Curve points table; each row includes false-positive-rate and one-or-more TPR fields. */
    data: Record<string, unknown>[];
    /** ROC curve series definitions. */
    series: [RocCurveSeriesConfig, ...RocCurveSeriesConfig[]];
    /** X axis key for false-positive-rate values. @default 'fpr' */
    xAxisKey?: string;
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 320 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Show random-classifier baseline (diagonal). @default true */
    showBaseline?: boolean;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'dataKey' | 'type'>;
    /** Props passed to Y axis. */
    yAxisProps?: Omit<YAxisProps, 'type'>;
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

export function RocCurve({
    data,
    series,
    xAxisKey = 'fpr',
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    showBaseline = true,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: RocCurveProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={data} margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey={xAxisKey}
                        domain={[0, 1]}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        type="number"
                        domain={[0, 1]}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {showBaseline && (
                        <ReferenceLine
                            segment={[
                                { x: 0, y: 0 },
                                { x: 1, y: 1 },
                            ]}
                            stroke={theme.axis.lineColor}
                            strokeDasharray="4 3"
                            label={{
                                value: 'Random baseline',
                                fill: theme.typography.color,
                                fontSize: theme.typography.fontSize,
                                position: 'insideTopLeft',
                            }}
                        />
                    )}

                    {series.map((s, index) => {
                        const color = s.color ?? theme.dataColors[index % theme.dataColors.length];
                        return (
                            <Line
                                key={s.dataKey}
                                type="linear"
                                dataKey={s.dataKey}
                                name={s.name ?? s.dataKey}
                                stroke={color}
                                strokeWidth={s.strokeWidth ?? 2}
                                dot={false}
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
