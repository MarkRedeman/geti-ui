import {
    Line,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    ReferenceLine,
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

export interface ReliabilityDiagramDatum {
    /** Mean predicted confidence in bucket [0,1]. */
    confidence: number;
    /** Observed accuracy in bucket [0,1]. */
    accuracy: number;
    /** Optional bucket sample size. */
    samples?: number;
}

export interface ReliabilityDiagramProps {
    /** Calibration bucket rows. */
    data: ReliabilityDiagramDatum[];
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 320 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Show perfect calibration diagonal line. @default true */
    showPerfectCalibration?: boolean;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'type' | 'dataKey' | 'domain'>;
    /** Props passed to Y axis. */
    yAxisProps?: Omit<YAxisProps, 'type' | 'dataKey' | 'domain'>;
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

export function ReliabilityDiagram({
    data,
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    showPerfectCalibration = true,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ReliabilityDiagramProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const percent = (value: number) => `${Math.round(value * 100)}%`;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={data} margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey="confidence"
                        domain={[0, 1]}
                        tick={axisStyle}
                        tickFormatter={percent}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        type="number"
                        dataKey="accuracy"
                        domain={[0, 1]}
                        tick={axisStyle}
                        tickFormatter={percent}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && (
                        <ChartTooltip
                            labelFormatter={(value) => `Confidence ${percent(Number(value))}`}
                            formatter={(value, name, payload) => {
                                if (name === 'Accuracy' && payload?.payload?.samples) {
                                    return [`${percent(Number(value))} (${payload.payload.samples} samples)`, name];
                                }
                                return [percent(Number(value)), name];
                            }}
                            {...tooltipProps}
                        />
                    )}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {showPerfectCalibration && (
                        <ReferenceLine
                            segment={[
                                { x: 0, y: 0 },
                                { x: 1, y: 1 },
                            ]}
                            stroke={theme.axis.lineColor}
                            strokeDasharray="4 3"
                            label={{
                                value: 'Perfect calibration',
                                fill: theme.typography.color,
                                fontSize: theme.typography.fontSize,
                                position: 'insideTopLeft',
                            }}
                        />
                    )}

                    <Line
                        type="linear"
                        dataKey="accuracy"
                        name="Accuracy"
                        stroke={theme.dataColors[0]}
                        strokeWidth={2}
                        dot={{ r: 3, fill: theme.dataColors[0] }}
                        activeDot={{ r: theme.activeDotRadius, fill: theme.dataColors[0] }}
                        isAnimationActive={animate}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
