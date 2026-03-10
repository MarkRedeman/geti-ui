import {
    Area,
    AreaChart as RechartsAreaChart,
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

export interface DistributionRidgeSeries {
    /** Series label (e.g. class/dataset split). */
    name: string;
    /** Data key in row values. */
    dataKey: string;
    /** Optional color override. */
    color?: string;
}

export interface DistributionRidgeChartProps {
    /** Shared x-domain rows, each including xAxisKey and one-or-more series values. */
    data: Record<string, unknown>[];
    /** Ridge series definitions. */
    series: [DistributionRidgeSeries, ...DistributionRidgeSeries[]];
    /** X-axis key. @default 'x' */
    xAxisKey?: string;
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 340 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Shared ridge fill opacity. @default 0.24 */
    fillOpacity?: number;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'dataKey'>;
    /** Props passed to Y axis. */
    yAxisProps?: YAxisProps;
    /** Props passed to grid primitive. */
    gridProps?: ChartGridProps;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Chart margin. */
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

export function DistributionRidgeChart({
    data,
    series,
    xAxisKey = 'x',
    width = '100%',
    height = 340,
    showGrid = true,
    showTooltip = true,
    animate = false,
    fillOpacity = 0.24,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: DistributionRidgeChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsAreaChart data={data} margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        dataKey={xAxisKey}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && <ChartTooltip {...tooltipProps} />}

                    {series.map((s, index) => {
                        const color = s.color ?? theme.dataColors[index % theme.dataColors.length];
                        return (
                            <Area
                                key={s.dataKey}
                                type="monotone"
                                dataKey={s.dataKey}
                                name={s.name}
                                stroke={color}
                                fill={color}
                                fillOpacity={fillOpacity}
                                isAnimationActive={animate}
                            />
                        );
                    })}
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    );
}
