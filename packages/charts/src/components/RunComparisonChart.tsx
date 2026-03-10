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
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartGrid, type ChartGridProps } from '../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';
import type { AxisScaleConfig } from '../types/axisScale';
import { getAxisLineStyle, getAxisTickLineStyle, getAxisTickStyle } from '../utils/axisStyles';

export interface RunComparisonSeriesConfig {
    /** Data key for this metric (e.g. 'map', 'f1', 'latencyMs'). */
    dataKey: string;
    /** Display name in legend/tooltip. */
    name?: string;
    /** Optional fixed color for this metric series. */
    color?: string;
    /** Optional stack group id when combining multiple stacked groups. */
    stackId?: string;
}

export interface RunComparisonChartProps {
    /** Comparison rows (one per run). */
    data: Record<string, unknown>[];
    /** Metric series to compare across runs. */
    series: [RunComparisonSeriesConfig, ...RunComparisonSeriesConfig[]];
    /** Key used for run labels. @default 'run' */
    xAxisKey?: string;
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 320 */
    height?: number;
    /** Orientation of bars. @default 'vertical' */
    layout?: 'vertical' | 'horizontal';
    /** Whether all series should be stacked. @default false */
    stacked?: boolean;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** X axis scale config. */
    xScale?: AxisScaleConfig;
    /** Y axis scale config. */
    yScale?: AxisScaleConfig;
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

export function RunComparisonChart({
    data,
    series,
    xAxisKey = 'run',
    width = '100%',
    height = 320,
    layout = 'vertical',
    stacked = false,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    xScale,
    yScale,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: RunComparisonChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const xProps: XAxisProps =
        layout === 'vertical'
            ? {
                  type: 'number',
                  scale: xScale?.scale,
                  domain: xScale?.domain,
                  allowDataOverflow: xScale?.allowDataOverflow,
                  ...xAxisProps,
              }
            : {
                  dataKey: xAxisKey,
                  scale: xScale?.scale,
                  domain: xScale?.domain,
                  allowDataOverflow: xScale?.allowDataOverflow,
                  ...xAxisProps,
              };

    const yProps: YAxisProps =
        layout === 'vertical'
            ? {
                  type: 'category',
                  dataKey: xAxisKey,
                  scale: yScale?.scale,
                  domain: yScale?.domain,
                  allowDataOverflow: yScale?.allowDataOverflow,
                  ...yAxisProps,
              }
            : {
                  scale: yScale?.scale,
                  domain: yScale?.domain,
                  allowDataOverflow: yScale?.allowDataOverflow,
                  ...yAxisProps,
              };

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={data} layout={layout} margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xProps}
                    />
                    <YAxis
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yProps}
                    />

                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, seriesIndex) => {
                        const defaultColor = theme.dataColors[seriesIndex % theme.dataColors.length];
                        return (
                            <Bar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                name={s.name ?? s.dataKey}
                                stackId={stacked ? (s.stackId ?? 'stack') : undefined}
                                fill={s.color ?? defaultColor}
                                isAnimationActive={animate}
                                radius={layout === 'vertical' ? [0, 2, 2, 0] : [2, 2, 0, 0]}
                            >
                                {series.length === 1
                                    ? data.map((_entry, dataIndex) => (
                                          <Cell
                                              key={`cell-${dataIndex}`}
                                              fill={theme.dataColors[dataIndex % theme.dataColors.length]}
                                          />
                                      ))
                                    : null}
                            </Bar>
                        );
                    })}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
