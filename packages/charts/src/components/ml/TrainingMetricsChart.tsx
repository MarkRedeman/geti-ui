import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../../primitives/ChartLegend';
import type { AxisScaleConfig } from '../../types/axisScale';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';
import { getDatasetSubsetColor } from '../../utils/datasetSubsetPalette';

export interface TrainingMetricSeriesConfig {
    /** Display name for this metric group (e.g. 'Loss', 'mAP'). */
    name: string;
    /** Data key for training values. */
    trainKey: string;
    /** Optional data key for validation values. */
    validationKey?: string;
    /** Optional data key for test values. */
    testKey?: string;
    /** Curve interpolation method. @default 'monotone' */
    curve?:
        | 'basis'
        | 'basisClosed'
        | 'basisOpen'
        | 'linear'
        | 'linearClosed'
        | 'natural'
        | 'monotoneX'
        | 'monotoneY'
        | 'monotone'
        | 'step'
        | 'stepBefore'
        | 'stepAfter';
    /** Optional custom color for train line. */
    trainColor?: string;
    /** Optional custom color for validation line. */
    validationColor?: string;
    /** Optional custom color for test line. */
    testColor?: string;
    /** Stroke width for all lines in this metric group. @default 2 */
    strokeWidth?: number;
}

export interface TrainingMetricsChartProps {
    /** Training timeline data points. */
    data: Record<string, unknown>[];
    /** Metric groups to render (train/validation/test lines). */
    metrics: [TrainingMetricSeriesConfig, ...TrainingMetricSeriesConfig[]];
    /** Key used for the X axis. @default 'epoch' */
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
    /** Scale configuration for X axis. */
    xScale?: AxisScaleConfig;
    /** Scale configuration for Y axis. */
    yScale?: AxisScaleConfig;
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

export function TrainingMetricsChart({
    data,
    metrics,
    xAxisKey = 'epoch',
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
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
}: TrainingMetricsChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

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
                        scale={xScale?.scale}
                        domain={xScale?.domain}
                        allowDataOverflow={xScale?.allowDataOverflow}
                        {...xAxisProps}
                    />
                    <YAxis
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        scale={yScale?.scale}
                        domain={yScale?.domain}
                        allowDataOverflow={yScale?.allowDataOverflow}
                        {...yAxisProps}
                    />

                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {metrics.map((metric, metricIndex) => {
                        const fallbackColor = theme.dataColors[metricIndex % theme.dataColors.length];
                        const trainColor = metric.trainColor ?? getDatasetSubsetColor('train') ?? fallbackColor;
                        const validationColor =
                            metric.validationColor ?? getDatasetSubsetColor('validation') ?? fallbackColor;
                        const testColor = metric.testColor ?? getDatasetSubsetColor('test') ?? fallbackColor;

                        return [
                            <Line
                                key={`${metric.name}-train-${metric.trainKey}`}
                                type={metric.curve ?? 'monotone'}
                                dataKey={metric.trainKey}
                                name={`${metric.name} (Train)`}
                                stroke={trainColor}
                                strokeWidth={metric.strokeWidth ?? 2}
                                dot={false}
                                activeDot={{ r: theme.activeDotRadius, fill: trainColor }}
                                isAnimationActive={animate}
                            />,

                            metric.validationKey && (
                                <Line
                                    key={`${metric.name}-validation-${metric.validationKey}`}
                                    type={metric.curve ?? 'monotone'}
                                    dataKey={metric.validationKey}
                                    name={`${metric.name} (Validation)`}
                                    stroke={validationColor}
                                    strokeWidth={metric.strokeWidth ?? 2}
                                    strokeDasharray="5 3"
                                    dot={false}
                                    activeDot={{ r: theme.activeDotRadius, fill: validationColor }}
                                    isAnimationActive={animate}
                                />
                            ),

                            metric.testKey && (
                                <Line
                                    key={`${metric.name}-test-${metric.testKey}`}
                                    type={metric.curve ?? 'monotone'}
                                    dataKey={metric.testKey}
                                    name={`${metric.name} (Test)`}
                                    stroke={testColor}
                                    strokeWidth={metric.strokeWidth ?? 2}
                                    strokeDasharray="2 3"
                                    dot={false}
                                    activeDot={{ r: theme.activeDotRadius, fill: testColor }}
                                    isAnimationActive={animate}
                                />
                            ),
                        ];
                    })}
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
