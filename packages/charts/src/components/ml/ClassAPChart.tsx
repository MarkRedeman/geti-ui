import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    ResponsiveContainer,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface ClassAPChartDatum {
    /** Class name. */
    className: string;
    /** AP score in [0, 1]. */
    score: number;
}

export interface ClassAPChartProps {
    /** Per-class AP values. */
    data: ClassAPChartDatum[];
    /** Metric label used in tooltip/axis naming. @default 'AP50' */
    metric?: string;
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 420 */
    height?: number;
    /** Sort by AP score descending. @default true */
    sortDescending?: boolean;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'type' | 'domain'>;
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

export function ClassAPChart({
    data,
    metric = 'AP50',
    width = '100%',
    height = 420,
    sortDescending = true,
    showGrid = true,
    showTooltip = true,
    animate = false,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 96 },
    'aria-label': ariaLabel,
}: ClassAPChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const chartData = sortDescending
        ? [...data].sort((a, b) => b.score - a.score)
        : data;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={chartData} layout="vertical" margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        domain={[0, 1]}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        type="category"
                        dataKey="className"
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        width={120}
                        {...yAxisProps}
                    />

                    {showTooltip && (
                        <ChartTooltip
                            formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, metric]}
                            {...tooltipProps}
                        />
                    )}

                    <Bar dataKey="score" name={metric} isAnimationActive={animate}>
                        {chartData.map((entry, index) => {
                            const band = Math.floor((entry.score || 0) * (theme.dataColors.length - 1));
                            const fill = theme.dataColors[Math.max(0, Math.min(theme.dataColors.length - 1, band))];
                            return <Cell key={`${entry.className}-${index}`} fill={fill} />;
                        })}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
