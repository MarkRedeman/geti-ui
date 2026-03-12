import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import type { HighlightConfig } from '../highlight';
import { extractLegendSeriesKey, useSeriesHighlight } from '../highlight';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';

export interface DonutChartProps {
    /** Donut slices data. */
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
    /** Chart height in pixels. @default 320 */
    height?: number;
    /** Inner radius for the donut. @default '58%' */
    innerRadius?: number | string;
    /** Outer radius for the donut. @default '82%' */
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

export function DonutChart({
    data,
    valueKey = 'value',
    nameKey = 'name',
    seriesName,
    colors,
    width = '100%',
    height = 320,
    innerRadius = '58%',
    outerRadius = '82%',
    paddingAngle = 0,
    showLegend = true,
    showTooltip = true,
    showLabels = false,
    animate = false,
    tooltipProps,
    legendProps,
    'aria-label': ariaLabel,
    highlight,
}: DonutChartProps) {
    const theme = useChartsTheme();

    const highlightEnabled = highlight !== undefined && highlight.enabled !== false;
    const interaction = highlight?.interaction;
    const sliceHoverEnabled = interaction?.lineHover ?? true;
    const legendHoverEnabled = interaction?.legendHover ?? true;
    const legendClickEnabled = interaction?.legendClick ?? false;

    const highlightState = useSeriesHighlight({
        ...highlight,
        enabled: highlightEnabled,
    });

    const getSliceKey = (entry: Record<string, unknown>): string => {
        const raw = entry[nameKey];
        return typeof raw === 'string' ? raw : String(raw);
    };

    const handleLegendMouseEnter: ChartLegendProps['onMouseEnter'] = (entry, index, event) => {
        legendProps?.onMouseEnter?.(entry, index, event);
        if (!highlightEnabled || !legendHoverEnabled) {
            return;
        }
        const key = extractLegendSeriesKey(entry);
        if (key) {
            highlightState.setHovered([key]);
        }
    };

    const handleLegendMouseLeave: ChartLegendProps['onMouseLeave'] = (entry, index, event) => {
        legendProps?.onMouseLeave?.(entry, index, event);
        if (!highlightEnabled || !legendHoverEnabled) {
            return;
        }
        highlightState.clearHover();
    };

    const handleLegendClick: ChartLegendProps['onClick'] = (entry, index, event) => {
        legendProps?.onClick?.(entry, index, event);
        if (!highlightEnabled || !legendClickEnabled) {
            return;
        }
        const key = extractLegendSeriesKey(entry);
        if (key) {
            highlightState.togglePinnedKey(key, 'legend-click');
        }
    };

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
                                          getSliceKey((entry as unknown as { payload?: Record<string, unknown> }).payload ?? {}),
                                      ])
                                : undefined
                        }
                        onMouseLeave={
                            highlightEnabled && sliceHoverEnabled
                                ? () => highlightState.clearHover()
                                : undefined
                        }
                        isAnimationActive={animate}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors?.[index] ?? theme.dataColors[index % theme.dataColors.length]}
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
