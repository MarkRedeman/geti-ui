import {
    Bar,
    BarChart as RechartsBarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    type XAxisProps,
    type YAxisProps,
} from 'recharts';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../../primitives/ChartGrid';
import { ChartLegend, type ChartLegendProps } from '../../primitives/ChartLegend';
import { ChartTooltip, type ChartTooltipProps } from '../../primitives/ChartTooltip';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../../utils/axisStyles';

export interface ErrorBreakdownSeries {
    /** Data key for this error bucket. */
    dataKey: string;
    /** Display name for legend/tooltip. */
    name?: string;
    /** Optional color override. */
    color?: string;
}

export interface ErrorBreakdownChartProps {
    /** Chart rows (e.g. by model/run/split). */
    data: Record<string, unknown>[];
    /** Error buckets to render. */
    series: [ErrorBreakdownSeries, ...ErrorBreakdownSeries[]];
    /** Category axis key. @default 'label' */
    xAxisKey?: string;
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 320 */
    height?: number;
    /** Whether to stack all error categories. @default true */
    stacked?: boolean;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
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

const DEFAULT_ERROR_COLORS = [
    'var(--spectrum-global-color-red-500)',
    'var(--spectrum-global-color-orange-500)',
    'var(--spectrum-global-color-yellow-500)',
    'var(--spectrum-global-color-purple-500)',
] as const;

export function ErrorBreakdownChart({
    data,
    series,
    xAxisKey = 'label',
    width = '100%',
    height = 320,
    stacked = true,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: ErrorBreakdownChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={data} margin={margin}>
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
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, index) => {
                        const color =
                            s.color ??
                            DEFAULT_ERROR_COLORS[index % DEFAULT_ERROR_COLORS.length] ??
                            theme.dataColors[index % theme.dataColors.length];

                        return (
                            <Bar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                name={s.name ?? s.dataKey}
                                stackId={stacked ? 'errors' : undefined}
                                fill={color}
                                isAnimationActive={animate}
                            />
                        );
                    })}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
