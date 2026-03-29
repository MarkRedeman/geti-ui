import { Treemap, ResponsiveContainer } from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import type { HighlightConfig } from '../highlight';
import { useSeriesHighlight } from '../highlight';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { resolveChartColorScaleStops, type ChartColorScaleInput } from '../utils/colorScales';

function withAlpha(color: string, alpha: number): string {
    const a = Math.max(0, Math.min(1, alpha));
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        if (hex.length === 3) {
            const [r, g, b] = hex.split('');
            const rr = parseInt(`${r}${r}`, 16);
            const gg = parseInt(`${g}${g}`, 16);
            const bb = parseInt(`${b}${b}`, 16);
            return `rgba(${rr}, ${gg}, ${bb}, ${a})`;
        }
        if (hex.length === 6) {
            const rr = parseInt(hex.slice(0, 2), 16);
            const gg = parseInt(hex.slice(2, 4), 16);
            const bb = parseInt(hex.slice(4, 6), 16);
            return `rgba(${rr}, ${gg}, ${bb}, ${a})`;
        }
    }
    return color;
}

export interface TreemapChartProps {
    /** Hierarchical tree data. */
    data: Record<string, unknown>[];
    /** Data key used for values. @default 'value' */
    dataKey?: string;
    /** Data key used for labels. @default 'name' */
    nameKey?: string;
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 320 */
    height?: number;
    /**
     * Optional color palette for the treemap tiles. Colors are cycled across tiles
     * in the order provided. When omitted, falls back to the full theme `dataColors` palette.
     * Use `fill` instead if you want all tiles to share a single color.
     *
     * @example colors={['#4C9BE8', '#5CE6A2', '#F9C846']}
     */
    colors?: string[];
    /** Named color scale preset or custom color stops for tiles. */
    colorScale?: ChartColorScaleInput;
    /** Optional fixed color for all treemap tiles. Takes precedence over `colors`. */
    fill?: string;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Props passed to tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Accessible label for screen readers. */
    'aria-label'?: string;
    /** Optional tile highlighting interactions (hover only). */
    highlight?: HighlightConfig;
}

export function TreemapChart({
    data,
    dataKey = 'value',
    nameKey = 'name',
    width = '100%',
    height = 320,
    colors,
    colorScale,
    fill,
    showTooltip = true,
    animate = false,
    tooltipProps,
    'aria-label': ariaLabel,
    highlight,
}: TreemapChartProps) {
    const theme = useChartsTheme();

    const highlightEnabled = highlight !== undefined && highlight.enabled !== false;
    const tileHoverEnabled = highlight?.interaction?.lineHover ?? true;

    const highlightState = useSeriesHighlight({
        ...highlight,
        enabled: highlightEnabled,
    });

    const getTileKey = (entry: Record<string, unknown>): string => {
        const raw = entry[nameKey];
        return typeof raw === 'string' ? raw : String(raw);
    };

    const colorScaleStops = resolveChartColorScaleStops(colorScale, theme.dataColors);
    const palette = fill ? [fill] : (colors ?? colorScaleStops);
    const hasActiveHighlight = highlightEnabled && highlightState.activeKeys.length > 0;
    const dimmedOpacity = highlight?.dimmedOpacity ?? 0.2;

    const effectiveColorPanel = hasActiveHighlight
        ? data.map((row, index) => {
              const baseColor = palette[index % palette.length];
              return highlightState.activeKeys.includes(getTileKey(row))
                  ? baseColor
                  : withAlpha(baseColor, dimmedOpacity);
          })
        : palette;

    // When `fill` is given, use it as the sole tile color.
    // When `colors` is given, pass it as the Recharts colorPanel to cycle across tiles.
    // Otherwise fall back to the full theme palette.
    const resolvedFill = fill ?? undefined;
    const colorPanel = fill ? undefined : effectiveColorPanel;

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <Treemap
                    data={data}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    stroke={theme.grid.stroke}
                    fill={resolvedFill}
                    colorPanel={colorPanel}
                    onMouseEnter={
                        highlightEnabled && tileHoverEnabled
                            ? (entry) =>
                                  highlightState.setHovered([
                                      getTileKey(
                                          (entry as unknown as { payload?: Record<string, unknown> }).payload ??
                                              (entry as unknown as Record<string, unknown>)
                                      ),
                                  ])
                            : undefined
                    }
                    onMouseLeave={highlightEnabled && tileHoverEnabled ? () => highlightState.clearHover() : undefined}
                    isAnimationActive={animate}
                >
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
}
