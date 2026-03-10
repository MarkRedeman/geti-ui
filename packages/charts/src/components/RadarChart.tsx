import {
    RadarChart as RechartsRadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    type PolarAngleAxisProps,
    type PolarRadiusAxisProps,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';

export interface RadarChartSeriesConfig {
    /** Data key for this radar area/line. */
    dataKey: string;
    /** Legend/tooltip label. */
    name?: string;
    /** Stroke/fill color override. */
    color?: string;
    /** Fill opacity for the radar area. @default 0.25 */
    fillOpacity?: number;
}

export interface RadarChartProps {
    /** Data rows containing an angle/category key and one or more series keys. */
    data: Record<string, unknown>[];
    /** Category/angle axis key. @default 'subject' */
    categoryKey?: string;
    /** Radar series configs. */
    series: [RadarChartSeriesConfig, ...RadarChartSeriesConfig[]];
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 320 */
    height?: number;
    /** Show polar grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Show filled radar areas. @default true */
    filled?: boolean;
    /** Props passed to polar angle axis. */
    angleAxisProps?: PolarAngleAxisProps;
    /** Props passed to polar radius axis. */
    radiusAxisProps?: PolarRadiusAxisProps;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Props passed to legend primitive. */
    legendProps?: ChartLegendProps;
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

export function RadarChart({
    data,
    categoryKey = 'subject',
    series,
    width = '100%',
    height = 320,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = false,
    filled = true,
    angleAxisProps,
    radiusAxisProps,
    tooltipProps,
    legendProps,
    'aria-label': ariaLabel,
}: RadarChartProps) {
    const theme = useChartsTheme();

    const axisText = {
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        fill: theme.axis.tickColor,
    };

    const polarGridStroke = theme.typography.color;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsRadarChart data={data} accessibilityLayer={false}>
                    {showGrid && <PolarGrid stroke={polarGridStroke} strokeOpacity={0.45} />}
                    <PolarAngleAxis dataKey={categoryKey} tick={axisText} {...angleAxisProps} />
                    <PolarRadiusAxis
                        tick={axisText}
                        axisLine={{ stroke: polarGridStroke, strokeOpacity: 0.45 }}
                        {...radiusAxisProps}
                    />
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, index) => {
                        const color = s.color ?? theme.dataColors[index % theme.dataColors.length];
                        return (
                            <Radar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                name={s.name ?? s.dataKey}
                                stroke={color}
                                strokeWidth={2}
                                fill={filled ? color : 'none'}
                                fillOpacity={filled ? (s.fillOpacity ?? 0.25) : 0}
                                isAnimationActive={animate}
                            />
                        );
                    })}
                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    );
}
