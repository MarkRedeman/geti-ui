import type { CSSProperties } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';

/**
 * Curve interpolation type for the sparkline.
 * Mirrors Recharts curve options.
 */
export type SparklineCurve =
    | 'basis'
    | 'basisClosed'
    | 'basisOpen'
    | 'linear'
    | 'linearClosed'
    | 'natural'
    | 'monotoneX'
    | 'monotoneY'
    | 'monotone'
    | 'step'
    | 'stepBefore'
    | 'stepAfter';

export interface SparklineProps {
    /**
     * Array of data points. Each element should have a numeric value
     * keyed by the `dataKey` prop.
     */
    data: Record<string, unknown>[];
    /**
     * Key in each data object that holds the numeric value to plot.
     * @default 'value'
     */
    dataKey?: string;
    /** Width of the sparkline. Defaults to '100%'. */
    width?: CSSProperties['width'];
    /** Height of the sparkline in pixels. @default 40 */
    height?: number;
    /** Color override. Falls back to the first data color in the theme. */
    color?: string;
    /** Stroke width of the line. @default 1.5 */
    strokeWidth?: number;
    /** Whether to fill the area under the line. @default false */
    area?: boolean;
    /** @deprecated Use `area` instead. */
    filled?: boolean;
    /** Opacity of the fill area (0–1). @default 0.15 */
    fillOpacity?: number;
    /** Curve type for the line. @default 'monotone' */
    curve?: SparklineCurve;
    /** Enable animation. @default false */
    animate?: boolean;
    /** Optional accessible label for screen readers. */
    'aria-label'?: string;
}

/**
 * A compact sparkline chart - a single data series line with no axes, grid, or legend.
 * Ideal for showing trends inline within tables, cards, or dashboards.
 *
 * @example
 * ```tsx
 * <Sparkline data={[{value: 1}, {value: 4}, {value: 2}]} height={32} />
 * ```
 */
export function Sparkline({
    data,
    dataKey = 'value',
    width = '100%',
    height = 40,
    color,
    strokeWidth = 1.5,
    area,
    filled,
    fillOpacity = 0.15,
    curve = 'monotone',
    animate = false,
    'aria-label': ariaLabel,
}: SparklineProps) {
    const theme = useChartsTheme();
    const lineColor = color ?? theme.dataColors[0];
    const showArea = area ?? filled ?? false;

    return (
        <div role="img" aria-label={ariaLabel ?? 'Sparkline chart'} style={{ width, height, display: 'inline-block' }}>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                    <Area
                        type={curve}
                        dataKey={dataKey}
                        stroke={lineColor}
                        strokeWidth={strokeWidth}
                        dot={false}
                        activeDot={false}
                        isAnimationActive={animate}
                        fill={showArea ? lineColor : 'none'}
                        fillOpacity={showArea ? fillOpacity : 0}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
