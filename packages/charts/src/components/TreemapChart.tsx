import {
    Treemap,
    ResponsiveContainer,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';

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
}

export function TreemapChart({
    data,
    dataKey = 'value',
    nameKey = 'name',
    width = '100%',
    height = 320,
    colors,
    fill,
    showTooltip = true,
    animate = false,
    tooltipProps,
    'aria-label': ariaLabel,
}: TreemapChartProps) {
    const theme = useChartsTheme();

    // When `fill` is given, use it as the sole tile color.
    // When `colors` is given, pass it as the Recharts colorPanel to cycle across tiles.
    // Otherwise fall back to the full theme palette.
    const resolvedFill = fill ?? undefined;
    const colorPanel = fill ? undefined : (colors ?? theme.dataColors);

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
                    isAnimationActive={animate}
                >
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
}
