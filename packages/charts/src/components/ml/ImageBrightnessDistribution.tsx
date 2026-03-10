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

export interface ImageBrightnessDistributionDatum {
    /** Start of brightness bin in [0, 255]. */
    binStart: number;
    /** End of brightness bin in [0, 255]. */
    binEnd: number;
    /** Image count in this bin. */
    count: number;
}

export interface ImageBrightnessDistributionProps {
    /** Histogram bin rows. */
    data: ImageBrightnessDistributionDatum[];
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
    /** Optional low brightness threshold marker (0..255). */
    lowThreshold?: number;
    /** Optional high brightness threshold marker (0..255). */
    highThreshold?: number;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'type' | 'dataKey' | 'domain'>;
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

export function ImageBrightnessDistribution({
    data,
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    animate = false,
    lowThreshold,
    highThreshold,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ImageBrightnessDistributionProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const chartData = data.map((d) => ({
        ...d,
        binCenter: (d.binStart + d.binEnd) / 2,
    }));

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={chartData} margin={margin} barCategoryGap={0} barGap={0}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey="binCenter"
                        domain={[0, 255]}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
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
                            labelFormatter={(label) => `Brightness ${Math.round(Number(label))}`}
                            formatter={(value) => [Number(value), 'Images']}
                            {...tooltipProps}
                        />
                    )}

                    {typeof lowThreshold === 'number' && lowThreshold >= 0 && lowThreshold <= 255 && (
                        <ReferenceLine
                            x={lowThreshold}
                            stroke="var(--spectrum-global-color-orange-500)"
                            strokeDasharray="4 3"
                            label={{
                                value: `Low ${Math.round(lowThreshold)}`,
                                position: 'insideTopLeft',
                                fill: theme.typography.color,
                                fontSize: theme.typography.fontSize,
                            }}
                        />
                    )}

                    {typeof highThreshold === 'number' && highThreshold >= 0 && highThreshold <= 255 && (
                        <ReferenceLine
                            x={highThreshold}
                            stroke="var(--spectrum-global-color-yellow-500)"
                            strokeDasharray="4 3"
                            label={{
                                value: `High ${Math.round(highThreshold)}`,
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
