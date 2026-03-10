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
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../../primitives/ChartLegend';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface ConfidenceVsIoUPoint {
    /** Prediction confidence score in [0,1]. */
    confidence: number;
    /** IoU score in [0,1]. */
    iou: number;
    /** Optional class label. */
    className?: string;
}

export interface ConfidenceVsIoUSeries {
    /** Series name. */
    name: string;
    /** Series points. */
    data: ConfidenceVsIoUPoint[];
    /** Optional color override. */
    color?: string;
}

export interface ConfidenceVsIoUChartProps {
    /** One or more point series. */
    series: [ConfidenceVsIoUSeries, ...ConfidenceVsIoUSeries[]];
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
    /** Marker size in px. @default 28 */
    markerSize?: number;
    /** Optional confidence threshold line in [0,1]. */
    confidenceThreshold?: number;
    /** Optional IoU threshold line in [0,1]. */
    iouThreshold?: number;
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

export function ConfidenceVsIoUChart({
    series,
    width = '100%',
    height = 340,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    markerSize = 28,
    confidenceThreshold,
    iouThreshold,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ConfidenceVsIoUChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);
    const percent = (v: number) => `${Math.round(v * 100)}%`;

    const thresholdRows = [
        ...(typeof confidenceThreshold === 'number'
            ? [{ confidence: confidenceThreshold, iou: 0 }, { confidence: confidenceThreshold, iou: 1 }]
            : []),
    ];
    const iouThresholdRows = [
        ...(typeof iouThreshold === 'number'
            ? [{ confidence: 0, iou: iouThreshold }, { confidence: 1, iou: iouThreshold }]
            : []),
    ];

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsScatterChart margin={margin}>
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
                        dataKey="iou"
                        domain={[0, 1]}
                        tick={axisStyle}
                        tickFormatter={percent}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && (
                        <ChartTooltip
                            formatter={(value, key) => {
                                const label = key === 'iou' ? 'IoU' : 'Confidence';
                                return [percent(Number(value)), label];
                            }}
                            {...tooltipProps}
                        />
                    )}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, i) => (
                        <Scatter
                            key={s.name}
                            name={s.name}
                            data={s.data}
                            fill={s.color ?? theme.dataColors[i % theme.dataColors.length]}
                            isAnimationActive={animate}
                            line={false}
                            shape={(props) => (
                                <circle
                                    cx={props.cx}
                                    cy={props.cy}
                                    r={markerSize / 2}
                                    fill={s.color ?? theme.dataColors[i % theme.dataColors.length]}
                                />
                            )}
                            legendType="circle"
                        />
                    ))}

                    {thresholdRows.length === 2 && (
                        <Scatter
                            name="Confidence threshold"
                            data={thresholdRows}
                            line
                            lineJointType="linear"
                            fill="transparent"
                            stroke="var(--spectrum-global-color-orange-500)"
                            shape={() => null}
                            isAnimationActive={false}
                        />
                    )}

                    {iouThresholdRows.length === 2 && (
                        <Scatter
                            name="IoU threshold"
                            data={iouThresholdRows}
                            line
                            lineJointType="linear"
                            fill="transparent"
                            stroke="var(--spectrum-global-color-yellow-500)"
                            shape={() => null}
                            isAnimationActive={false}
                        />
                    )}
                </RechartsScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
