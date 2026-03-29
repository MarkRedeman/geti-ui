import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import type { HighlightConfig } from '../highlight';
import { useLegendHighlight, useChartHighlight } from '../highlight';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';
import { resolveChartColorScaleStops, type ChartColorScaleInput } from '../utils/colorScales';

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
    /** Named color scale preset or custom color stops for slices. */
    colorScale?: ChartColorScaleInput;
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
    /** Optional slice highlighting interactions (hover, legend hover/click). */
    highlight?: HighlightConfig;
}

export function PieChart({
    data,
    valueKey = 'value',
    nameKey = 'name',
    seriesName,
    colors,
    colorScale,
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
    highlight,
}: PieChartProps) {
    const theme = useChartsTheme();

    const highlightEnabled = highlight !== undefined && highlight.enabled !== false;
    const interaction = highlight?.interaction;
    const sliceHoverEnabled = interaction?.lineHover ?? true;

    const highlightState = useChartHighlight({
        ...highlight,
        enabled: highlightEnabled,
    });

    const getSliceKey = (entry: Record<string, unknown>): string => {
        const raw = entry[nameKey];
        return typeof raw === 'string' ? raw : String(raw);
    };

    const scaleStops = resolveChartColorScaleStops(colorScale, theme.dataColors);

    const {
        onMouseEnter: handleLegendMouseEnter,
        onMouseLeave: handleLegendMouseLeave,
        onClick: handleLegendClick,
    } = useLegendHighlight(
        highlightState,
        {
            enabled: highlightEnabled,
            legendHover: interaction?.legendHover ?? true,
            legendClick: interaction?.legendClick ?? false,
        },
        legendProps
    );

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
                        onMouseEnter={
                            highlightEnabled && sliceHoverEnabled
                                ? (entry) =>
                                      highlightState.setHovered([
                                          getSliceKey(
                                              (entry as unknown as { payload?: Record<string, unknown> }).payload ?? {}
                                          ),
                                      ])
                                : undefined
                        }
                        onMouseLeave={
                            highlightEnabled && sliceHoverEnabled ? () => highlightState.clearHover() : undefined
                        }
                        isAnimationActive={animate}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors?.[index] ?? scaleStops[index % scaleStops.length]}
                                fillOpacity={highlightState.getOpacity(getSliceKey(entry))}
                            />
                        ))}
                    </Pie>
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && (
                        <ChartLegend
                            {...legendProps}
                            onMouseEnter={handleLegendMouseEnter}
                            onMouseLeave={handleLegendMouseLeave}
                            onClick={handleLegendClick}
                        />
                    )}
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}
