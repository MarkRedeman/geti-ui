import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';

export interface PieChartProps {
    /** Pie slices data. */
    data: Record<string, unknown>[];
    /** Numeric value key for each slice. @default 'value' */
    valueKey?: string;
    /** Label key for each slice. @default 'name' */
    nameKey?: string;
    /** Display name used for legend/tooltip. */
    seriesName?: string;
    /** Optional explicit slice colors. Falls back to theme palette. */
    colors?: string[];
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 300 */
    height?: number;
    /** Inner radius for the pie. @default 0 */
    innerRadius?: number | string;
    /** Outer radius for the pie. @default '80%' */
    outerRadius?: number | string;
    /** Slice separation angle in degrees. @default 0 */
    paddingAngle?: number;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show labels on slices. @default false */
    showLabels?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Props passed to the tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Props passed to the legend primitive. */
    legendProps?: ChartLegendProps;
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

export function PieChart({
    data,
    valueKey = 'value',
    nameKey = 'name',
    seriesName,
    colors,
    width = '100%',
    height = 300,
    innerRadius = 0,
    outerRadius = '80%',
    paddingAngle = 0,
    showLegend = true,
    showTooltip = true,
    showLabels = false,
    animate = false,
    tooltipProps,
    legendProps,
    'aria-label': ariaLabel,
}: PieChartProps) {
    const theme = useChartsTheme();

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey={valueKey}
                        nameKey={nameKey}
                        name={seriesName}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={paddingAngle}
                        label={showLabels}
                        isAnimationActive={animate}
                    >
                        {data.map((_entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors?.[index] ?? theme.dataColors[index % theme.dataColors.length]}
                            />
                        ))}
                    </Pie>
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && <ChartLegend {...legendProps} />}
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}
