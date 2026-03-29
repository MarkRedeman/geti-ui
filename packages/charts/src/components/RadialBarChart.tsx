import { RadialBarChart as RechartsRadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import type { HighlightConfig } from '../highlight';
import { useLegendHighlight, useChartHighlight } from '../highlight';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';

export interface RadialBarChartProps {
    /** Data rows containing category/value pairs. */
    data: Record<string, unknown>[];
    /** Category key. @default 'name' */
    categoryKey?: string;
    /** Value key. @default 'value' */
    valueKey?: string;
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 360 */
    height?: number;
    /** Optional explicit colors per row. */
    colors?: string[];
    /** Start angle in degrees. @default 90 */
    startAngle?: number;
    /** End angle in degrees. @default -270 */
    endAngle?: number;
    /** Inner radius. @default '20%' */
    innerRadius?: number | string;
    /** Outer radius. @default '90%' */
    outerRadius?: number | string;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default true */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Background track for bars. @default true */
    track?: boolean;
    /** Corner radius for bars. @default 6 */
    cornerRadius?: number;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Props passed to legend primitive. */
    legendProps?: ChartLegendProps;
    /** Accessible label for screen readers. */
    'aria-label'?: string;
    /** Optional category highlighting interactions (hover, legend hover/click). */
    highlight?: HighlightConfig;
}

export function RadialBarChart({
    data,
    categoryKey = 'name',
    valueKey = 'value',
    width = '100%',
    height = 360,
    colors,
    startAngle = 90,
    endAngle = -270,
    innerRadius = '20%',
    outerRadius = '90%',
    showTooltip = true,
    showLegend = true,
    animate = false,
    track = true,
    cornerRadius = 6,
    tooltipProps,
    legendProps,
    'aria-label': ariaLabel,
    highlight,
}: RadialBarChartProps) {
    const theme = useChartsTheme();

    const highlightEnabled = highlight !== undefined && highlight.enabled !== false;
    const interaction = highlight?.interaction;
    const barHoverEnabled = interaction?.lineHover ?? true;

    const highlightState = useChartHighlight({
        ...highlight,
        enabled: highlightEnabled,
    });

    const getCategoryKey = (row: Record<string, unknown>): string => {
        const raw = row[categoryKey];
        return typeof raw === 'string' ? raw : String(raw);
    };

    const filledData = data.map((row, index) => ({
        ...row,
        fill: colors?.[index] ?? theme.dataColors[index % theme.dataColors.length],
        fillOpacity: highlightState.getOpacity(getCategoryKey(row)),
    }));

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
                <RechartsRadialBarChart
                    data={filledData}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar
                        dataKey={valueKey}
                        name={categoryKey}
                        label={{
                            position: 'insideStart',
                            fill: theme.typography.color,
                            fontSize: theme.typography.fontSize,
                        }}
                        background={track}
                        cornerRadius={cornerRadius}
                        onMouseEnter={
                            highlightEnabled && barHoverEnabled
                                ? (entry) =>
                                      highlightState.setHovered([
                                          getCategoryKey(
                                              (entry as unknown as { payload?: Record<string, unknown> }).payload ?? {}
                                          ),
                                      ])
                                : undefined
                        }
                        onMouseLeave={
                            highlightEnabled && barHoverEnabled ? () => highlightState.clearHover() : undefined
                        }
                        isAnimationActive={animate}
                    />
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                    {showLegend && (
                        <ChartLegend
                            {...legendProps}
                            onMouseEnter={handleLegendMouseEnter}
                            onMouseLeave={handleLegendMouseLeave}
                            onClick={handleLegendClick}
                        />
                    )}
                </RechartsRadialBarChart>
            </ResponsiveContainer>
        </div>
    );
}
