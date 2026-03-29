import { useEffect, useMemo, useId, useRef, useState } from 'react';
import { ChartContainer } from '../../primitives/ChartContainer';
import { useChartsTheme } from '../../hooks/useChartsTheme';
import type { HighlightConfig } from '../../highlight';
import { useChartHighlight } from '../../highlight';
import { getAxisLineStyle, getAxisTickStyle } from '../../utils/axisStyles';
import { interpolateColorStops, resolveChartColorScaleStops, type ChartColorScaleInput } from '../../utils/colorScales';
import { useDragSelection, type SelectionConfig, type SelectionRect } from '../../selection';

type SupportedColorMode = 'left' | 'right' | string;

type ChartMargin = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};

export interface ParallelCoordinatesAxis {
    /** Data key for this dimension (e.g. pc1, pc2, pc3). */
    dataKey: string;
    /** Optional axis label shown above the vertical axis line. */
    label?: string;
    /** Optional fixed numeric domain for this axis. */
    domain?: [number, number];
}

export interface ParallelCoordinatesProps {
    /** Input rows where each row is one polyline. */
    data: Record<string, unknown>[];
    /** Ordered axis definitions (minimum two). */
    axes: [ParallelCoordinatesAxis, ParallelCoordinatesAxis, ...ParallelCoordinatesAxis[]];
    /** Chart width. Defaults to '100%'. */
    width?: number | string;
    /** Chart height in pixels. @default 420 */
    height?: number;
    /** Which axis drives line color mapping: 'left', 'right', or a specific axis dataKey. @default 'left' */
    colorBy?: SupportedColorMode;
    /** Color gradient used for line colors. @default 'theme' */
    colorGradient?: ChartColorScaleInput;
    /** Optional explicit color domain for the color-driving axis. */
    colorDomain?: [number, number];
    /** Position for color legend. @default 'bottom' */
    legendLocation?: 'left' | 'right' | 'top' | 'bottom';
    /** @deprecated Use legendLocation instead. */
    colorLegendPosition?: 'left' | 'right' | 'top' | 'bottom';
    /** Base opacity for non-active lines. @default 0.22 */
    lineOpacity?: number;
    /** Opacity for active (hovered/pinned) lines. @default 0.95 */
    activeLineOpacity?: number;
    /** Polyline stroke width. @default 1.2 */
    strokeWidth?: number;
    /** Optional stroke width for invisible hover/click hit area. */
    hitAreaStrokeWidth?: number;
    /**
     * Renders a wider invisible interaction path per line to improve hover/click.
     * Defaults to true for small/medium datasets and false for very large ones.
     */
    wideHitArea?: boolean;
    /** Number of tick labels per axis. @default 4 */
    tickCount?: number;
    /** Chart margin. */
    margin?: ChartMargin;
    /** Data key used as row identifier. Ignored when getRowId is provided. @default 'id' */
    rowIdKey?: string;
    /** Optional row id resolver for hover/select interactions. */
    getRowId?: (row: Record<string, unknown>, index: number) => string;
    /** Called when a line is hovered/unhovered. */
    onHoverRowChange?: (row: Record<string, unknown> | null, rowId: string | null) => void;
    /** Called when a line is clicked (pinned/unpinned). */
    onSelectRowChange?: (row: Record<string, unknown>, rowId: string) => void;
    /** Optional line highlighting interactions (hover/pin). */
    highlight?: HighlightConfig;
    /** Optional drag-selection interactions (bounding-box / column / row). */
    selection?: SelectionConfig;
    /** Called whenever the selection rectangle is completed or cleared. */
    onSelectionChange?: (selection: SelectionRect | null) => void;
    /** If true, show only lines fully inside the selected region. */
    filterBySelection?: boolean;
    /** Accessible label for screen readers. */
    'aria-label'?: string;
}

interface PreparedLine {
    id: string;
    row: Record<string, unknown>;
    points: string;
    axisYs: number[];
    colorValue: number;
}

function toFiniteNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

function clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
}

function formatTick(value: number): string {
    if (Math.abs(value) >= 100 || Math.abs(value) < 0.01) {
        return value.toExponential(1);
    }
    return value.toFixed(2);
}

export function ParallelCoordinates({
    data,
    axes,
    width = '100%',
    height = 420,
    colorBy = 'left',
    colorGradient = 'theme',
    colorDomain,
    legendLocation,
    colorLegendPosition,
    lineOpacity = 0.22,
    activeLineOpacity = 0.95,
    strokeWidth = 1.2,
    hitAreaStrokeWidth,
    wideHitArea,
    tickCount = 4,
    margin = { top: 56, right: 24, bottom: 72, left: 24 },
    rowIdKey = 'id',
    getRowId,
    onHoverRowChange,
    onSelectRowChange,
    highlight,
    selection,
    onSelectionChange,
    filterBySelection = false,
    'aria-label': ariaLabel,
}: ParallelCoordinatesProps) {
    const theme = useChartsTheme();
    const axisStyle = getAxisTickStyle(theme);
    const axisLineStyle = getAxisLineStyle(theme);

    const highlightEnabled = highlight !== undefined && highlight.enabled !== false;
    const lineHoverEnabled = highlight?.interaction?.lineHover ?? true;
    const highlightState = useChartHighlight({
        ...highlight,
        enabled: highlightEnabled,
    });

    const gradientId = useId();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(900);

    useEffect(() => {
        const element = containerRef.current;
        if (!element || typeof ResizeObserver === 'undefined') {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) {
                return;
            }

            const nextWidth = entry.contentRect.width;
            if (Number.isFinite(nextWidth) && nextWidth > 0) {
                setContainerWidth(nextWidth);
            }
        });

        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, []);

    const resolvedLegendLocation = legendLocation ?? colorLegendPosition ?? 'bottom';
    const sideLegendGutter = resolvedLegendLocation === 'left' || resolvedLegendLocation === 'right' ? 86 : 0;
    const topLegendGutter = resolvedLegendLocation === 'top' ? 44 : 0;

    const mTop = (margin.top ?? 28) + topLegendGutter;
    const mRight = (margin.right ?? 20) + (resolvedLegendLocation === 'right' ? sideLegendGutter : 0);
    const mBottom = margin.bottom ?? 24;
    const mLeft = (margin.left ?? 20) + (resolvedLegendLocation === 'left' ? sideLegendGutter : 0);

    const viewWidth = Math.max(520, Math.round(containerWidth));
    const viewHeight = Math.max(320, height);
    const innerWidth = Math.max(1, viewWidth - mLeft - mRight);
    const innerHeight = Math.max(1, viewHeight - mTop - mBottom);

    const axisXPositions = useMemo(() => {
        if (axes.length === 1) {
            return [mLeft + innerWidth / 2];
        }
        return axes.map((_, index) => mLeft + (index / (axes.length - 1)) * innerWidth);
    }, [axes, innerWidth, mLeft]);

    const resolvedDomains = useMemo(() => {
        return axes.map((axis) => {
            if (axis.domain) {
                return axis.domain;
            }

            const values = data
                .map((row) => toFiniteNumber(row[axis.dataKey]))
                .filter((value): value is number => value !== null);

            if (values.length === 0) {
                return [0, 1] as [number, number];
            }

            const min = Math.min(...values);
            const max = Math.max(...values);

            if (min === max) {
                return [min - 1, max + 1] as [number, number];
            }

            return [min, max] as [number, number];
        });
    }, [axes, data]);

    const colorAxis = useMemo(() => {
        if (colorBy === 'right') {
            return axes[axes.length - 1];
        }

        if (colorBy === 'left') {
            return axes[0];
        }

        const matchedAxis = axes.find((axis) => axis.dataKey === colorBy);
        return matchedAxis ?? axes[0];
    }, [axes, colorBy]);

    const preparedLines = useMemo(() => {
        const rows: PreparedLine[] = [];

        data.forEach((row, rowIndex) => {
            const points: string[] = [];
            const axisYs: number[] = [];

            for (let axisIndex = 0; axisIndex < axes.length; axisIndex += 1) {
                const axis = axes[axisIndex];
                const rawValue = toFiniteNumber(row[axis.dataKey]);

                if (rawValue === null) {
                    return;
                }

                const [dMin, dMax] = resolvedDomains[axisIndex];
                const normalized = dMax === dMin ? 0.5 : (rawValue - dMin) / (dMax - dMin);
                const y = mTop + (1 - clamp01(normalized)) * innerHeight;
                const x = axisXPositions[axisIndex];

                points.push(`${x},${y}`);
                axisYs.push(y);
            }

            const rowId = getRowId ? getRowId(row, rowIndex) : String(row[rowIdKey] ?? `row-${rowIndex}`);

            const colorValue = toFiniteNumber(row[colorAxis.dataKey]) ?? 0;

            rows.push({
                id: rowId,
                row,
                points: points.join(' '),
                axisYs,
                colorValue,
            });
        });

        return rows;
    }, [axes, axisXPositions, colorAxis.dataKey, data, getRowId, innerHeight, mTop, resolvedDomains, rowIdKey]);

    const resolvedColorDomain = useMemo(() => {
        if (colorDomain) {
            return colorDomain;
        }

        const values = preparedLines.map((line) => line.colorValue);
        if (values.length === 0) {
            return [0, 1] as [number, number];
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        if (min === max) {
            return [min - 1, max + 1] as [number, number];
        }
        return [min, max] as [number, number];
    }, [colorDomain, preparedLines]);

    const resolvedGradientStops = useMemo(
        () => resolveChartColorScaleStops(colorGradient, theme.dataColors),
        [colorGradient, theme.dataColors]
    );

    const getLineColor = (value: number): string => {
        const [cMin, cMax] = resolvedColorDomain;
        const t = cMax === cMin ? 0.5 : (value - cMin) / (cMax - cMin);
        return interpolateColorStops(resolvedGradientStops, t);
    };

    const resolvedTickCount = Math.max(2, Math.floor(tickCount));
    const resolvedWideHitArea = wideHitArea ?? data.length <= 700;
    const resolvedHitAreaStrokeWidth = hitAreaStrokeWidth ?? Math.max(4, Math.min(14, Math.round(strokeWidth * 5)));

    const handleLineMouseEnter = (line: PreparedLine) => {
        if (highlightEnabled) {
            highlightState.setHovered([line.id]);
        }
        onHoverRowChange?.(line.row, line.id);
    };

    const handleLineMouseLeave = () => {
        if (highlightEnabled) {
            highlightState.clearHover();
        }
        onHoverRowChange?.(null, null);
    };

    const handleLineClick = (line: PreparedLine) => {
        if (highlightEnabled) {
            highlightState.togglePinnedKey(line.id, 'focus');
        }
        onSelectRowChange?.(line.row, line.id);
    };

    const selectionBounds = {
        left: mLeft,
        top: mTop,
        right: mLeft + innerWidth,
        bottom: mTop + innerHeight,
    };

    const {
        dragRect,
        clearSelection,
        onPointerDown: onSelectionPointerDown,
        onPointerMove: onSelectionPointerMove,
        onPointerUp: onSelectionPointerUp,
        onPointerLeave: onSelectionPointerLeave,
    } = useDragSelection({
        enabled: selection?.enabled ?? false,
        mode: selection?.mode ?? 'bounding-box',
        bounds: selectionBounds,
        onSelectionEnd: onSelectionChange,
    });

    const selectionEnabled = selection?.enabled ?? false;
    const selectionMode = selection?.mode ?? 'bounding-box';
    const effectiveSelectionRect = dragRect;

    const lineIsInsideSelection = (line: PreparedLine): boolean => {
        if (!effectiveSelectionRect) {
            return true;
        }

        const selectedAxisIndices = axisXPositions
            .map((x, index) => ({ x, index }))
            .filter(({ x }) => x >= effectiveSelectionRect.x0 && x <= effectiveSelectionRect.x1)
            .map(({ index }) => index);

        const axisIndicesToCheck =
            selectedAxisIndices.length > 0
                ? selectedAxisIndices
                : [
                      axisXPositions.reduce((bestIndex, x, index) => {
                          const bestDistance = Math.abs(
                              axisXPositions[bestIndex] - (effectiveSelectionRect.x0 + effectiveSelectionRect.x1) / 2
                          );
                          const distance = Math.abs(x - (effectiveSelectionRect.x0 + effectiveSelectionRect.x1) / 2);
                          return distance < bestDistance ? index : bestIndex;
                      }, 0),
                  ];

        const axisMatches = axisIndicesToCheck.map((axisIndex) => {
            const y = line.axisYs[axisIndex];
            return Number.isFinite(y) && y >= effectiveSelectionRect.y0 && y <= effectiveSelectionRect.y1;
        });

        if (selectionMode === 'column') {
            return axisMatches.every(Boolean);
        }

        if (selectionMode === 'row') {
            return axisMatches.every(Boolean);
        }

        return axisMatches.every(Boolean);
    };

    const renderedLines =
        filterBySelection && effectiveSelectionRect
            ? preparedLines.filter((line) => lineIsInsideSelection(line))
            : preparedLines;

    return (
        <ChartContainer width={width} height={height} aria-label={ariaLabel}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1={resolvedLegendLocation === 'left' || resolvedLegendLocation === 'right' ? '0%' : '0%'}
                            y1={resolvedLegendLocation === 'left' || resolvedLegendLocation === 'right' ? '100%' : '0%'}
                            x2={resolvedLegendLocation === 'left' || resolvedLegendLocation === 'right' ? '0%' : '100%'}
                            y2={resolvedLegendLocation === 'left' || resolvedLegendLocation === 'right' ? '0%' : '0%'}
                        >
                            {resolvedGradientStops.map((stop, index) => (
                                <stop
                                    key={`${gradientId}-stop-${index}`}
                                    offset={`${(index / (resolvedGradientStops.length - 1)) * 100}%`}
                                    stopColor={stop}
                                />
                            ))}
                        </linearGradient>
                    </defs>

                    {axes.map((axis, axisIndex) => {
                        const x = axisXPositions[axisIndex];
                        const [dMin, dMax] = resolvedDomains[axisIndex];

                        return (
                            <g key={axis.dataKey}>
                                <line
                                    x1={x}
                                    y1={mTop}
                                    x2={x}
                                    y2={mTop + innerHeight}
                                    stroke={axisLineStyle.stroke}
                                    strokeWidth={axisLineStyle.strokeWidth}
                                    opacity={0.95}
                                />

                                <text
                                    x={x}
                                    y={mTop - 10}
                                    textAnchor="middle"
                                    fill={axisStyle.fill}
                                    fontFamily={axisStyle.fontFamily}
                                    fontSize={Math.max(14, axisStyle.fontSize + 2)}
                                    fontWeight={600}
                                >
                                    {axis.label ?? axis.dataKey}
                                </text>

                                {Array.from({ length: resolvedTickCount }).map((_, tickIndex) => {
                                    const t = tickIndex / (resolvedTickCount - 1);
                                    const y = mTop + t * innerHeight;
                                    const value = dMax - (dMax - dMin) * t;

                                    return (
                                        <g key={`${axis.dataKey}-tick-${tickIndex}`}>
                                            <line
                                                x1={x - 4}
                                                y1={y}
                                                x2={x + 4}
                                                y2={y}
                                                stroke={theme.axis.tickColor}
                                                strokeWidth={1}
                                            />
                                            <text
                                                x={x + 8}
                                                y={y + 4}
                                                textAnchor="start"
                                                fill={axisStyle.fill}
                                                fontFamily={axisStyle.fontFamily}
                                                fontSize={Math.max(12, axisStyle.fontSize + 1)}
                                                opacity={0.85}
                                            >
                                                {formatTick(value)}
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}

                    {renderedLines.map((line) => {
                        const isActive = highlightState.activeKeys.includes(line.id);
                        const opacity =
                            highlightState.activeKeys.length === 0
                                ? lineOpacity
                                : isActive
                                  ? activeLineOpacity
                                  : lineOpacity * highlightState.getOpacity(line.id);

                        return (
                            <g key={line.id}>
                                <polyline
                                    points={line.points}
                                    fill="none"
                                    stroke={getLineColor(line.colorValue)}
                                    strokeWidth={strokeWidth}
                                    strokeOpacity={opacity}
                                    pointerEvents={resolvedWideHitArea ? 'none' : 'stroke'}
                                    onMouseEnter={
                                        !resolvedWideHitArea && lineHoverEnabled
                                            ? () => handleLineMouseEnter(line)
                                            : undefined
                                    }
                                    onMouseLeave={
                                        !resolvedWideHitArea && lineHoverEnabled ? handleLineMouseLeave : undefined
                                    }
                                    onClick={
                                        !resolvedWideHitArea && highlightEnabled
                                            ? () => handleLineClick(line)
                                            : undefined
                                    }
                                />
                                {resolvedWideHitArea ? (
                                    <polyline
                                        points={line.points}
                                        fill="none"
                                        stroke="transparent"
                                        strokeWidth={resolvedHitAreaStrokeWidth}
                                        strokeOpacity={0}
                                        pointerEvents="stroke"
                                        onMouseEnter={lineHoverEnabled ? () => handleLineMouseEnter(line) : undefined}
                                        onMouseLeave={lineHoverEnabled ? handleLineMouseLeave : undefined}
                                        onClick={highlightEnabled ? () => handleLineClick(line) : undefined}
                                    />
                                ) : null}
                            </g>
                        );
                    })}

                    {resolvedLegendLocation === 'bottom' || resolvedLegendLocation === 'top' ? (
                        <g
                            transform={`translate(${mLeft}, ${resolvedLegendLocation === 'top' ? Math.max(8, mTop - 38) : viewHeight - Math.max(16, mBottom - 18)})`}
                        >
                            <rect x={0} y={0} width={180} height={14} fill={`url(#${gradientId})`} rx={4} />
                            <text
                                x={0}
                                y={34}
                                fill={axisStyle.fill}
                                fontFamily={axisStyle.fontFamily}
                                fontSize={Math.max(12, axisStyle.fontSize + 1)}
                            >
                                {`${colorAxis.label ?? colorAxis.dataKey} (min ${formatTick(resolvedColorDomain[0])})`}
                            </text>
                            <text
                                x={180}
                                y={34}
                                textAnchor="end"
                                fill={axisStyle.fill}
                                fontFamily={axisStyle.fontFamily}
                                fontSize={Math.max(12, axisStyle.fontSize + 1)}
                            >
                                {`max ${formatTick(resolvedColorDomain[1])}`}
                            </text>
                        </g>
                    ) : (
                        <g
                            transform={`translate(${resolvedLegendLocation === 'left' ? Math.max(10, mLeft - sideLegendGutter + 18) : viewWidth - mRight + 22}, ${mTop})`}
                        >
                            <rect x={0} y={0} width={14} height={innerHeight} fill={`url(#${gradientId})`} rx={4} />
                            <text
                                x={7}
                                y={-10}
                                textAnchor="middle"
                                fill={axisStyle.fill}
                                fontFamily={axisStyle.fontFamily}
                                fontSize={Math.max(12, axisStyle.fontSize + 1)}
                            >
                                {`${colorAxis.label ?? colorAxis.dataKey}`}
                            </text>
                            <text
                                x={22}
                                y={10}
                                textAnchor="start"
                                fill={axisStyle.fill}
                                fontFamily={axisStyle.fontFamily}
                                fontSize={Math.max(11, axisStyle.fontSize)}
                            >
                                {`max ${formatTick(resolvedColorDomain[1])}`}
                            </text>
                            <text
                                x={22}
                                y={innerHeight}
                                textAnchor="start"
                                fill={axisStyle.fill}
                                fontFamily={axisStyle.fontFamily}
                                fontSize={Math.max(11, axisStyle.fontSize)}
                            >
                                {`min ${formatTick(resolvedColorDomain[0])}`}
                            </text>
                        </g>
                    )}

                    {selectionEnabled ? (
                        <g>
                            {effectiveSelectionRect ? (
                                <rect
                                    x={effectiveSelectionRect.x0}
                                    y={effectiveSelectionRect.y0}
                                    width={Math.max(0, effectiveSelectionRect.x1 - effectiveSelectionRect.x0)}
                                    height={Math.max(0, effectiveSelectionRect.y1 - effectiveSelectionRect.y0)}
                                    fill={selection?.overlayStyle?.fill ?? theme.dataColors[0]}
                                    fillOpacity={selection?.overlayStyle?.fillOpacity ?? 0.14}
                                    stroke={selection?.overlayStyle?.stroke ?? theme.dataColors[1]}
                                    strokeWidth={selection?.overlayStyle?.strokeWidth ?? 1.5}
                                    strokeDasharray="4 3"
                                    pointerEvents="none"
                                />
                            ) : null}
                            <rect
                                x={selectionBounds.left}
                                y={selectionBounds.top}
                                width={selectionBounds.right - selectionBounds.left}
                                height={selectionBounds.bottom - selectionBounds.top}
                                fill="transparent"
                                pointerEvents="all"
                                cursor="crosshair"
                                onPointerDown={onSelectionPointerDown}
                                onPointerMove={onSelectionPointerMove}
                                onPointerUp={onSelectionPointerUp}
                                onPointerLeave={onSelectionPointerLeave}
                                onDoubleClick={() => {
                                    clearSelection();
                                    onSelectionChange?.(null);
                                }}
                            />
                        </g>
                    ) : null}
                </svg>
            </div>
        </ChartContainer>
    );
}
