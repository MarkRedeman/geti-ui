import {
    Bar,
    BarChart as RechartsBarChart,
    ResponsiveContainer,
    ReferenceLine,
    XAxis,
    YAxis,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface ImageAspectRatioDistributionDatum {
    /** Start of aspect-ratio bin (width / height). */
    binStart: number;
    /** End of aspect-ratio bin (width / height). */
    binEnd: number;
    /** Image count in this bin. */
    count: number;
}

export interface ImageAspectRatioDistributionProps {
    /** Histogram bin rows. */
    data: ImageAspectRatioDistributionDatum[];
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
    /** Optional preferred aspect-ratio marker. */
    targetRatio?: number;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'type' | 'dataKey'>;
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

export function ImageAspectRatioDistribution({
    data,
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    animate = false,
    targetRatio,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ImageAspectRatioDistributionProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const chartData = data.map((d) => ({
        ...d,
        binCenter: (d.binStart + d.binEnd) / 2,
    }));

    const minX = data.length > 0 ? Math.min(...data.map((d) => d.binStart)) : 0;
    const maxX = data.length > 0 ? Math.max(...data.map((d) => d.binEnd)) : 3;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={chartData} margin={margin} barCategoryGap={0} barGap={0}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey="binCenter"
                        domain={[minX, maxX]}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        tickFormatter={(value) => Number(value).toFixed(2)}
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
                            labelFormatter={(label) => `Aspect ratio ${Number(label).toFixed(2)}`}
                            formatter={(value) => [Number(value), 'Images']}
                            {...tooltipProps}
                        />
                    )}

                    {typeof targetRatio === 'number' && (
                        <ReferenceLine
                            x={targetRatio}
                            stroke={theme.axis.lineColor}
                            strokeDasharray="4 3"
                            label={{
                                value: `Target ${targetRatio.toFixed(2)}`,
                                position: 'insideTopRight',
                                fill: theme.typography.color,
                                fontSize: theme.typography.fontSize,
                            }}
                        />
                    )}

                    <Bar dataKey="count" fill={theme.dataColors[0]} isAnimationActive={animate} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
