import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import {
    ScatterChart as RechartsScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    ResponsiveContainer,
    type XAxisProps,
    type YAxisProps,
    type ZAxisProps,
} from 'recharts';
import { useChartsTheme } from '../hooks/useChartsTheme';
import { useVoronoiHover } from '../hooks/useVoronoiHover';
import { ChartGrid, type ChartGridProps } from '../primitives/ChartGrid';
import { ChartTooltip, type ChartTooltipProps } from '../primitives/ChartTooltip';
import { ChartLegend, type ChartLegendProps } from '../primitives/ChartLegend';
import type { VoronoiActivePoint } from '../hooks/useVoronoiHover';
import type { AxisScaleConfig } from '../types/axisScale';

export type { AxisScaleConfig };

export interface ScatterChartSeriesConfig {
    /** Unique name for this scatter series (used in legend/tooltip). */
    name: string;
    /** Data for this series. Each point should have x and y numeric properties. */
    data: Record<string, unknown>[];
    /** Color override (uses theme palette by default). */
    color?: string;
    /** Key for the X value in each data point. @default 'x' */
    xKey?: string;
    /** Key for the Y value in each data point. @default 'y' */
    yKey?: string;
    /** Key for the bubble size (Z axis). Optional. */
    zKey?: string;
    /** Shape for each data point. @default 'circle' */
    shape?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
}

export interface ScatterChartProps {
    /** Scatter series definitions. Each series has its own data array. */
    series: [ScatterChartSeriesConfig, ...ScatterChartSeriesConfig[]];
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 300 */
    height?: number;
    /** Show grid. @default true */
    showGrid?: boolean;
    /** Show tooltip. @default true */
    showTooltip?: boolean;
    /** Show legend. @default false */
    showLegend?: boolean;
    /** Enable animation. @default false */
    animate?: boolean;
    /** X axis label. */
    xAxisLabel?: string;
    /** Y axis label. */
    yAxisLabel?: string;
    /**
     * Scale configuration for the X axis.
     * Scatter charts use numeric axes by default, so log/sqrt scales are fully supported.
     *
     * @example { scale: 'log', domain: [0.001, 'auto'] }
     */
    xScale?: AxisScaleConfig;
    /**
     * Scale configuration for the Y axis.
     *
     * @example { scale: 'log', domain: [0.001, 'auto'] }
     */
    yScale?: AxisScaleConfig;
    /** Props passed to the X axis. */
    xAxisProps?: XAxisProps;
    /** Props passed to the Y axis. */
    yAxisProps?: YAxisProps;
    /** Props passed to the Z (bubble size) axis. */
    zAxisProps?: ZAxisProps;
    /** Props passed to the grid primitive. */
    gridProps?: ChartGridProps;
    /** Props passed to the tooltip primitive. */
    tooltipProps?: ChartTooltipProps;
    /** Props passed to the legend primitive. */
    legendProps?: ChartLegendProps;
    /** Chart margin. */
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    /** Accessible label for screen readers. */
    'aria-label'?: string;
    /**
     * Enable Voronoi-based hover for easier tooltip triggering.
     * When true, the nearest data point to the cursor is highlighted regardless
     * of how close the cursor is to the actual dot, up to `voronoiMaxDistance`.
     * @default true
     */
    useVoronoi?: boolean;
    /**
     * Maximum pixel distance from the cursor to the nearest point for the
     * Voronoi tooltip to activate. Increase for sparser charts; decrease for
     * dense charts to avoid false activations.
     * @default 80
     */
    voronoiMaxDistance?: number;
}

// ---------------------------------------------------------------------------
// Internal Voronoi tooltip overlay — rendered as a plain HTML element so it
// can escape the SVG stacking context and receive normal CSS box-shadow etc.
// ---------------------------------------------------------------------------

interface VoronoiTooltipProps {
    activePoint: VoronoiActivePoint;
    /** Resolved series colors (index → color). */
    seriesColors: string[];
    theme: ReturnType<typeof useChartsTheme>;
    /** Offset from mouse position. */
    offsetX?: number;
    offsetY?: number;
}

function VoronoiTooltip({
    activePoint,
    theme,
    offsetX = 12,
    offsetY = -8,
}: VoronoiTooltipProps) {
    const { point } = activePoint;
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!tooltipRef.current) return;
        const { width, height } = tooltipRef.current.getBoundingClientRect();
        setTooltipSize((prev) =>
            prev.width !== width || prev.height !== height
                ? { width, height }
                : prev
        );
    }, [point.px, point.py, point.xValue, point.yValue, point.seriesName]);

    const PAD = 8;
    const { containerWidth, containerHeight } = activePoint;

    const tooltipWidth = tooltipSize.width;
    const tooltipHeight = tooltipSize.height;
    const horizontalGap = Math.max(0, offsetX);
    const verticalGap = Math.max(0, Math.abs(offsetY));

    // Horizontal placement: prefer right side of point, flip to left if needed.
    let left = point.px + horizontalGap;
    if (tooltipWidth > 0 && left + tooltipWidth + PAD > containerWidth) {
        left = point.px - horizontalGap - tooltipWidth;
    }

    // Vertical placement: prefer above point, fallback below if needed.
    let top = point.py - verticalGap - tooltipHeight;
    if (tooltipHeight > 0 && top < PAD) {
        top = point.py + verticalGap;
    }

    // Final hard clamp keeps the tooltip entirely inside the chart canvas.
    if (tooltipWidth > 0) {
        const maxLeft = Math.max(PAD, containerWidth - tooltipWidth - PAD);
        left = Math.max(PAD, Math.min(left, maxLeft));
    }
    if (tooltipHeight > 0) {
        const maxTop = Math.max(PAD, containerHeight - tooltipHeight - PAD);
        top = Math.max(PAD, Math.min(top, maxTop));
    }

    // Anchor the tooltip to the actual dot position (container-relative px/py),
    // not the cursor position. This prevents the tooltip from drifting as the
    // user moves around inside a Voronoi region.
    const containerStyle: CSSProperties = {
        position: 'absolute',
        left,
        top,
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundColor: theme.tooltip.backgroundColor,
        border: `1px solid ${theme.tooltip.borderColor}`,
        borderRadius: theme.tooltip.borderRadius,
        color: theme.tooltip.color,
        padding: theme.tooltip.padding,
        boxShadow: theme.tooltip.boxShadow,
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        whiteSpace: 'nowrap',
    };

    const dotStyle: CSSProperties = {
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: point.color,
        flexShrink: 0,
        marginRight: 6,
        verticalAlign: 'middle',
    };

    const rowStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    };

    const labelStyle: CSSProperties = {
        marginBottom: 4,
        fontWeight: 600,
        color: theme.tooltip.color,
    };

    return (
        <div ref={tooltipRef} style={containerStyle}>
            <div style={labelStyle}>{point.seriesName}</div>
            <div style={rowStyle}>
                <span style={dotStyle} />
                <span>
                    x: <strong>{point.xValue}</strong>
                </span>
            </div>
            <div style={rowStyle}>
                <span style={{ ...dotStyle, backgroundColor: 'transparent' }} />
                <span>
                    y: <strong>{point.yValue}</strong>
                </span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Active dot overlay — an SVG circle rendered on top of the hovered point
// so the user gets visual confirmation of which point is active.
// ---------------------------------------------------------------------------

interface ActiveDotOverlayProps {
    activePoint: VoronoiActivePoint;
    theme: ReturnType<typeof useChartsTheme>;
}

function ActiveDotOverlay({ activePoint, theme }: ActiveDotOverlayProps) {
    const { point } = activePoint;

    // point.px / point.py are now container-relative (the DOM-reading approach in
    // useVoronoiHover returns getBoundingClientRect-based positions relative to
    // the container div), so no margin offset is needed here.
    const cx = point.px;
    const cy = point.py;

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
            }}
        >
            <circle
                cx={cx}
                cy={cy}
                r={theme.activeDotRadius}
                fill={point.color}
                stroke={theme.tooltip.backgroundColor}
                strokeWidth={2}
                opacity={0.9}
            />
        </svg>
    );
}

// ---------------------------------------------------------------------------
// ScatterChart
// ---------------------------------------------------------------------------

/**
 * A fully themed scatter / bubble chart backed by Recharts.
 * Multiple series are supported, each with its own data array.
 * Animation disabled by default; pass `animate` to enable.
 *
 * **Voronoi hover** (enabled by default via `useVoronoi`): the nearest data
 * point to the cursor is highlighted and a tooltip is shown even when the
 * cursor is not exactly on top of a dot. Use `voronoiMaxDistance` to control
 * how far away the cursor can be.
 *
 * @example
 * ```tsx
 * <ScatterChart
 *   series={[{
 *     name: 'Model A',
 *     data: [{ x: 0.8, y: 0.9 }, { x: 0.75, y: 0.85 }]
 *   }]}
 *   xAxisLabel="Precision"
 *   yAxisLabel="Recall"
 *   aria-label="Precision-Recall scatter"
 * />
 * ```
 *
 * @example Log-log scatter (e.g. parameters vs FLOPs)
 * ```tsx
 * <ScatterChart
 *   series={[{ name: 'Models', data: modelData }]}
 *   xScale={{ scale: 'log', domain: [1e6, 'auto'] }}
 *   yScale={{ scale: 'log', domain: [1e8, 'auto'] }}
 *   xAxisLabel="Parameters"
 *   yAxisLabel="FLOPs"
 *   aria-label="Parameters vs FLOPs"
 * />
 * ```
 */
export function ScatterChart({
    series,
    width = '100%',
    height = 300,
    showGrid = true,
    showTooltip = true,
    showLegend = false,
    animate = false,
    xAxisLabel,
    yAxisLabel,
    xScale,
    yScale,
    xAxisProps,
    yAxisProps,
    zAxisProps,
    gridProps,
    tooltipProps,
    legendProps,
    margin: marginProp = { top: 8, right: 16, bottom: 8, left: 0 },
    'aria-label': ariaLabel,
    useVoronoi = true,
    voronoiMaxDistance = 80,
}: ScatterChartProps) {
    const theme = useChartsTheme();

    // Normalise margin so all four sides are always numbers.
    const margin = {
        top: marginProp.top ?? 8,
        right: marginProp.right ?? 16,
        bottom: marginProp.bottom ?? 8,
        left: marginProp.left ?? 0,
    };

    const axisStyle = {
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        fill: theme.typography.color,
    };

    // Resolve series colors once so we can pass them to the tooltip.
    const seriesColors = series.map(
        (s, i) => s.color ?? theme.dataColors[i % theme.dataColors.length]
    );

    // Voronoi hook — safe to call even when disabled (returns nulls).
    // seriesColors is threaded in so the hook can populate point.color correctly
    // without re-resolving the theme palette internally.
    const { containerRef, handleMouseMove, handleMouseLeave, activePoint } = useVoronoiHover({
        series,
        seriesColors,
        margin,
        maxDistance: voronoiMaxDistance,
        enabled: useVoronoi && showTooltip,
    });

    return (
        <div
            ref={containerRef}
            role="img"
            aria-label={ariaLabel}
            style={{ position: 'relative', width, height }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <ResponsiveContainer width="100%" height={height}>
                <RechartsScatterChart margin={margin}>
                    {showGrid && <ChartGrid {...gridProps} />}

                    <XAxis
                        dataKey={series[0].xKey ?? 'x'}
                        type="number"
                        name={xAxisLabel}
                        tick={axisStyle}
                        axisLine={{ stroke: theme.axis.lineColor, strokeWidth: theme.axis.strokeWidth }}
                        tickLine={{ stroke: theme.axis.tickColor }}
                        label={
                            xAxisLabel
                                ? {
                                      value: xAxisLabel,
                                      position: 'insideBottom',
                                      offset: -4,
                                      fill: theme.typography.color,
                                      fontSize: theme.typography.fontSize,
                                  }
                                : undefined
                        }
                        scale={xScale?.scale}
                        domain={xScale?.domain}
                        allowDataOverflow={xScale?.allowDataOverflow}
                        {...xAxisProps}
                    />
                    <YAxis
                        dataKey={series[0].yKey ?? 'y'}
                        type="number"
                        name={yAxisLabel}
                        tick={axisStyle}
                        axisLine={{ stroke: theme.axis.lineColor, strokeWidth: theme.axis.strokeWidth }}
                        tickLine={{ stroke: theme.axis.tickColor }}
                        label={
                            yAxisLabel
                                ? {
                                      value: yAxisLabel,
                                      angle: -90,
                                      position: 'insideLeft',
                                      fill: theme.typography.color,
                                      fontSize: theme.typography.fontSize,
                                  }
                                : undefined
                        }
                        scale={yScale?.scale}
                        domain={yScale?.domain}
                        allowDataOverflow={yScale?.allowDataOverflow}
                        {...yAxisProps}
                    />
                    {zAxisProps && <ZAxis {...zAxisProps} />}

                    {/* When Voronoi is active we suppress Recharts' built-in tooltip
                        to avoid double-tooltip rendering. */}
                    {showTooltip && !useVoronoi && <ChartTooltip {...tooltipProps} />}
                    {showTooltip && useVoronoi && <ChartTooltip cursor={false} {...tooltipProps} />}

                    {showLegend && <ChartLegend {...legendProps} />}

                    {series.map((s, index) => {
                        const color = seriesColors[index];
                        return (
                            <Scatter
                                key={s.name}
                                name={s.name}
                                data={s.data}
                                fill={color}
                                shape={s.shape ?? 'circle'}
                                isAnimationActive={animate}
                            />
                        );
                    })}
                </RechartsScatterChart>
            </ResponsiveContainer>

            {/* Voronoi active-point visual feedback layers */}
            {useVoronoi && activePoint && (
                <ActiveDotOverlay activePoint={activePoint} theme={theme} />
            )}
            {useVoronoi && showTooltip && activePoint && (
                <VoronoiTooltip
                    activePoint={activePoint}
                    seriesColors={seriesColors}
                    theme={theme}
                />
            )}
        </div>
    );
}
