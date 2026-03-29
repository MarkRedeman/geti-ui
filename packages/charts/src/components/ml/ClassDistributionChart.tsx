import {
    Bar,
    BarChart as RechartsBarChart,
    Cell,
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

export interface ClassDistributionDatum {
    /** Class label. */
    className: string;
    /** Number of samples for class. */
    count: number;
}

export interface ClassDistributionChartProps {
    /** Per-class counts. */
    data: ClassDistributionDatum[];
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 420 */
    height?: number;
    /** Sort classes by count descending. @default true */
    sortDescending?: boolean;
    /** Limit to top N classes. */
    topN?: number;
    /** Use logarithmic X axis scale for long-tail distributions. @default false */
    useLogScale?: boolean;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'type'>;
    /** Props passed to Y axis. */
    yAxisProps?: Omit<YAxisProps, 'type' | 'dataKey'>;
    /** Props passed to grid primitive. */
    gridProps?: ChartGridProps;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Chart margin. */
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

export function ClassDistributionChart({
    data,
    width = '100%',
    height = 420,
    sortDescending = true,
    topN,
    useLogScale = false,
    showGrid = true,
    showTooltip = true,
    animate = false,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 120 },
    'aria-label': ariaLabel,
}: ClassDistributionChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    let chartData = sortDescending ? [...data].sort((a, b) => b.count - a.count) : [...data];
    if (typeof topN === 'number' && topN > 0) {
        chartData = chartData.slice(0, topN);
    }

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={chartData} layout="vertical" margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        scale={useLogScale ? 'log' : 'linear'}
                        domain={useLogScale ? [1, 'auto'] : [0, 'auto']}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        type="category"
                        dataKey="className"
                        width={140}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && <ChartTooltip {...tooltipProps} />}

                    <Bar dataKey="count" name="Samples" isAnimationActive={animate}>
                        {chartData.map((entry, i) => (
                            <Cell
                                key={`${entry.className}-${i}`}
                                fill={theme.dataColors[i % theme.dataColors.length]}
                            />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
