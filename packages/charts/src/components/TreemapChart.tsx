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
    /** Optional fixed color for all treemap tiles. */
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
    fill,
    showTooltip = true,
    animate = false,
    tooltipProps,
    'aria-label': ariaLabel,
}: TreemapChartProps) {
    const theme = useChartsTheme();

    return (
        <div role="img" aria-label={ariaLabel} style={{ width, height }}>
            <ResponsiveContainer width="100%" height={height}>
                <Treemap
                    data={data}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    stroke={theme.grid.stroke}
                    fill={fill ?? theme.dataColors[0]}
                    isAnimationActive={animate}
                >
                    {showTooltip && <ChartTooltip {...tooltipProps} />}
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
}
