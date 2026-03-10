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

export interface EmbeddingDistanceDistributionDatum {
    /** Start of distance bin. */
    binStart: number;
    /** End of distance bin. */
    binEnd: number;
    /** Sample count in this bin. */
    count: number;
}

export interface EmbeddingDistanceDistributionProps {
    /** Histogram bin rows. */
    data: EmbeddingDistanceDistributionDatum[];
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
    /** Use logarithmic X axis scale. @default false */
    useLogScale?: boolean;
    /** Optional marker for outlier-distance threshold. */
    outlierThreshold?: number;
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

export function EmbeddingDistanceDistribution({
    data,
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    animate = false,
    showFrequency = false,
    useLogScale = false,
    outlierThreshold,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: EmbeddingDistanceDistributionProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const total = data.reduce((sum, d) => sum + d.count, 0);
    const chartData = data.map((d) => ({
        ...d,
        binCenter: (d.binStart + d.binEnd) / 2,
        value: showFrequency && total > 0 ? d.count / total : d.count,
    }));

    const minX = data.length > 0 ? Math.min(...data.map((d) => d.binStart)) : 0;
    const maxX = data.length > 0 ? Math.max(...data.map((d) => d.binEnd)) : 1;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={chartData} margin={margin} barCategoryGap={0} barGap={0}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey="binCenter"
                        scale={useLogScale ? 'log' : 'linear'}
                        domain={useLogScale ? [Math.max(minX, Number.EPSILON), maxX] : [minX, maxX]}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        tickFormatter={(value) => Number(value).toFixed(useLogScale ? 3 : 2)}
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
                            labelFormatter={(label) => `Distance ${Number(label).toFixed(3)}`}
                            formatter={(value) => {
                                const num = Number(value);
                                return [showFrequency ? `${(num * 100).toFixed(2)}%` : num, showFrequency ? 'Frequency' : 'Count'];
                            }}
                            {...tooltipProps}
                        />
                    )}

                    {typeof outlierThreshold === 'number' && (
                        <ReferenceLine
                            x={outlierThreshold}
                            stroke="var(--spectrum-global-color-red-500)"
                            strokeDasharray="4 3"
                            label={{
                                value: `Outlier ${outlierThreshold.toFixed(2)}`,
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
