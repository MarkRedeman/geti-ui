import {
    Bar,
    BarChart as RechartsBarChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface ConfidenceHistogramDatum {
    /** Start of confidence bin (0..1). */
    binStart: number;
    /** End of confidence bin (0..1). */
    binEnd: number;
    /** Sample count in this bin. */
    count: number;
}

export interface ConfidenceHistogramProps {
    /** Histogram bin rows. */
    data: ConfidenceHistogramDatum[];
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 320 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Show normalized frequency (count / total) instead of raw count. @default false */
    showFrequency?: boolean;
    /** Optional confidence threshold marker in [0,1]. */
    threshold?: number;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'dataKey' | 'type' | 'domain'>;
    /** Props passed to Y axis. */
    yAxisProps?: Omit<YAxisProps, 'type'>;
    /** Props passed to grid primitive. */
    gridProps?: ChartGridProps;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Chart margin. */
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

export function ConfidenceHistogram({
    data,
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    animate = false,
    showFrequency = false,
    threshold,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ConfidenceHistogramProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const total = data.reduce((sum, d) => sum + d.count, 0);
    const chartData = data.map((d) => ({
        ...d,
        binCenter: (d.binStart + d.binEnd) / 2,
        value: showFrequency && total > 0 ? d.count / total : d.count,
    }));

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={chartData} margin={margin} barCategoryGap={0} barGap={0}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey="binCenter"
                        domain={[0, 1]}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        tickFormatter={(value) => Number(value).toFixed(1)}
                        {...xAxisProps}
                    />
                    <YAxis
                        type="number"
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && (
                        <ChartTooltip
                            formatter={(value) => {
                                const num = Number(value);
                                return [showFrequency ? `${(num * 100).toFixed(2)}%` : num, showFrequency ? 'Frequency' : 'Count'];
                            }}
                            labelFormatter={(label) => `Confidence ${Number(label).toFixed(2)}`}
                            {...tooltipProps}
                        />
                    )}

                    {typeof threshold === 'number' && threshold >= 0 && threshold <= 1 && (
                        <ReferenceLine
                            x={threshold}
                            stroke={theme.axis.lineColor}
                            strokeDasharray="4 3"
                            label={{
                                value: `Threshold ${threshold.toFixed(2)}`,
                                position: 'insideTopRight',
                                fill: theme.typography.color,
                                fontSize: theme.typography.fontSize,
                            }}
                        />
                    )}

                    <Bar dataKey="value" fill={theme.dataColors[0]} isAnimationActive={animate} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
