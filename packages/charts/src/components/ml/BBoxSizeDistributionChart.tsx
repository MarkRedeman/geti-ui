import {
    ResponsiveContainer,
    Scatter,
    ScatterChart as RechartsScatterChart,
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

export interface BBoxSizePoint {
    /** Bounding box width in pixels. */
    width: number;
    /** Bounding box height in pixels. */
    height: number;
    /** Optional point label/class. */
    label?: string;
}

export interface BBoxSizeSeries {
    /** Series name. */
    name: string;
    /** Box points. */
    data: BBoxSizePoint[];
    /** Optional color override. */
    color?: string;
}

export interface BBoxSizeDistributionChartProps {
    /** One or more series of box points. */
    series: [BBoxSizeSeries, ...BBoxSizeSeries[]];
    /** Width of chart. Defaults to '100%'. */
    width?: number | string;
    /** Height in pixels. @default 360 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Marker size in px. @default 8 */
    markerSize?: number;
    /** Use logarithmic scale on width axis. @default false */
    xLogScale?: boolean;
    /** Use logarithmic scale on height axis. @default false */
    yLogScale?: boolean;
    /** Props passed to X axis. */
    xAxisProps?: Omit<XAxisProps, 'type' | 'dataKey'>;
    /** Props passed to Y axis. */
    yAxisProps?: Omit<YAxisProps, 'type' | 'dataKey'>;
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

export function BBoxSizeDistributionChart({
    series,
    width = '100%',
    height = 360,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    markerSize = 8,
    xLogScale = false,
    yLogScale = false,
    xAxisProps,
    yAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
}: BBoxSizeDistributionChartProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);

    const all = series.flatMap((s) => s.data);
    const minW = all.length ? Math.min(...all.map((p) => p.width)) : 1;
    const maxW = all.length ? Math.max(...all.map((p) => p.width)) : 512;
    const minH = all.length ? Math.min(...all.map((p) => p.height)) : 1;
    const maxH = all.length ? Math.max(...all.map((p) => p.height)) : 512;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsScatterChart margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        type="number"
                        dataKey="width"
                        scale={xLogScale ? 'log' : 'linear'}
                        domain={xLogScale ? [Math.max(minW, Number.EPSILON), maxW] : [0, 'auto']}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...xAxisProps}
                    />
                    <YAxis
                        type="number"
                        dataKey="height"
                        scale={yLogScale ? 'log' : 'linear'}
                        domain={yLogScale ? [Math.max(minH, Number.EPSILON), maxH] : [0, 'auto']}
                        tick={axisStyle}
                        axisLine={getAxisLineStyle(theme)}
                        tickLine={getAxisTickLineStyle(theme)}
                        {...yAxisProps}
                    />

                    {showTooltip && (
                        <ChartTooltip
                            formatter={(value, key) => [Number(value), key === 'width' ? 'Width (px)' : 'Height (px)']}
                            {...tooltipProps}
                        />
                    )}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, i) => {
                        const color = s.color ?? theme.dataColors[i % theme.dataColors.length];
                        return (
                            <Scatter
                                key={s.name}
                                name={s.name}
                                data={s.data}
                                fill={color}
                                isAnimationActive={animate}
                                shape={(props) => (
                                    <circle cx={props.cx} cy={props.cy} r={markerSize / 2} fill={color} />
                                )}
                                legendType="circle"
                            />
                        );
                    })}
                </RechartsScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
