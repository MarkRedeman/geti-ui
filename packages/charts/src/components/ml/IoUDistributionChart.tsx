import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface IoUDistributionDatum {
    /** Start of IoU bin (0..1). */
    binStart: number;
    /** End of IoU bin (0..1). */
    binEnd: number;
    /** Sample count in this bin. */
    count: number;
}

export interface IoUDistributionChartProps {
    /** Histogram bin rows. */
    data: IoUDistributionDatum[];
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
    /** If true, show normalized frequency (count / total) instead of raw count. @default false */
    showFrequency?: boolean;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'dataKey' | 'type'>;
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

export function IoUDistributionChart({
    data,
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    animate = false,
    showFrequency = false,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: IoUDistributionChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const total = data.reduce((sum, d) => sum + d.count, 0);
    const chartData = data.map((d) => ({
        ...d,
        binLabel: `${d.binStart.toFixed(1)}-${d.binEnd.toFixed(1)}`,
        value: showFrequency && total > 0 ? d.count / total : d.count,
    }));

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={chartData} margin={margin} barCategoryGap={0} barGap={0}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="category"
                        dataKey="binLabel"
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
                            formatter={(value) => {
                                const num = Number(value);
                                return [showFrequency ? `${(num * 100).toFixed(2)}%` : num, showFrequency ? 'Frequency' : 'Count'];
                            }}
                            labelFormatter={(label) => `IoU bin ${label}`}
                            {...tooltipProps}
                        />
                    )}

                    <Bar dataKey="value" fill={theme.dataColors[0]} isAnimationActive={animate} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
