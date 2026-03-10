/**
 * useVoronoiHover — manages nearest-point hover state for ScatterChart.
 *
 * Returns ref callbacks + state needed to:
 *  1. Read actual rendered SVG circle positions from the DOM (single source of
 *     truth — avoids re-implementing Recharts' axis domain / tick logic).
 *  2. Convert mouse pixel events to plot-area coordinates.
 *  3. Find the nearest scatter point via d3-delaunay Voronoi lookup.
 *  4. Expose an `activePoint` that the parent chart can use to show a tooltip.
 */

import { useCallback, useRef, useState } from 'react';
import { buildVoronoiLookup, ScatterDataPoint } from '../utils/voronoiUtils';
import type { ScatterChartSeriesConfig } from '../components/ScatterChart';

export interface VoronoiActivePoint {
    point: ScatterDataPoint;
    /**
     * Mouse X relative to the container element (for reference / custom use).
     * The built-in tooltip is anchored to `point.px`/`point.py` instead so it
     * does not drift as the cursor moves around a Voronoi region.
     */
    mouseX: number;
    /** Mouse Y relative to the container element. */
    mouseY: number;
    /** Container width in px at the time of hover event. */
    containerWidth: number;
    /** Container height in px at the time of hover event. */
    containerHeight: number;
}

export interface UseVoronoiHoverOptions {
    series: ScatterChartSeriesConfig[];
    /** Resolved series colors (same length as `series`). Used to populate
     *  `point.color` from the parent's resolved palette. */
    seriesColors: string[];
    /** Maximum pixel distance from mouse to nearest point. Points farther than
     *  this threshold are ignored so the tooltip disappears in empty areas.
     *  @default 80 */
    maxDistance?: number;
    /** Whether Voronoi is enabled at all. @default true */
    enabled?: boolean;
}

export interface UseVoronoiHoverReturn {
    /** Attach to the outermost `div` wrapping the chart. */
    containerRef: React.RefCallback<HTMLDivElement>;
    /** Call when the mouse moves over the chart wrapper. */
    handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    /** Call when the mouse leaves the chart wrapper. */
    handleMouseLeave: () => void;
    /** The currently hovered point, or null if none is within range. */
    activePoint: VoronoiActivePoint | null;
}

/**
 * Reads the actual rendered `<circle>` positions from the Recharts SVG and
 * maps them back to `ScatterDataPoint` objects.
 *
 * Recharts renders each scatter series inside a `<g class="recharts-symbols">`.
 * Each individual dot is a `<circle>` (or custom symbol path). We query all
 * circles to get their pixel positions (already in SVG/container space), which
 * avoids duplicating Recharts' domain/tick/padding calculations.
 */
function readPointsFromDOM(
    containerEl: HTMLDivElement,
    series: ScatterChartSeriesConfig[],
    seriesColors: string[]
): ScatterDataPoint[] {
    const containerRect = containerEl.getBoundingClientRect();

    // Recharts v3 renders one `.recharts-scatter-symbol` node per data point.
    // These are direct `g` containers with transforms already applied.
    const symbolNodes = Array.from(
        containerEl.querySelectorAll<SVGGElement>('.recharts-scatter-symbol')
    );

    const points: ScatterDataPoint[] = [];

    let globalPointIndex = 0;

    for (let si = 0; si < series.length; si++) {
        const s = series[si];
        const xKey = s.xKey ?? 'x';
        const yKey = s.yKey ?? 'y';
        const color = seriesColors[si] ?? '';

        for (let pi = 0; pi < s.data.length; pi++) {
            const el = symbolNodes[globalPointIndex++];
            if (!el) continue;
            const d = s.data[pi];
            if (!d) continue;

            const xVal = d[xKey];
            const yVal = d[yKey];
            if (typeof xVal !== 'number' || typeof yVal !== 'number') continue;

            // Get the bounding rect of the symbol element in viewport space,
            // then convert to container-relative coordinates.
            const elRect = el.getBoundingClientRect();
            const centerX = elRect.left + elRect.width / 2 - containerRect.left;
            const centerY = elRect.top + elRect.height / 2 - containerRect.top;

            points.push({
                xValue: xVal,
                yValue: yVal,
                // px/py are container-relative (not plot-area-relative) so that
                // the Voronoi lookup, ActiveDotOverlay, and VoronoiTooltip all
                // work in the same coordinate space without needing margin offsets.
                px: centerX,
                py: centerY,
                payload: d,
                seriesName: s.name,
                color,
                seriesIndex: si,
                pointIndex: pi,
            });
        }
    }

    return points;
}

export function useVoronoiHover({
    series,
    seriesColors,
    maxDistance = 80,
    enabled = true,
}: UseVoronoiHoverOptions): UseVoronoiHoverReturn {
    const [activePoint, setActivePoint] = useState<VoronoiActivePoint | null>(null);

    // Store the container DOM element so we can measure it on demand.
    const containerEl = useRef<HTMLDivElement | null>(null);

    const containerRef = useCallback((el: HTMLDivElement | null) => {
        containerEl.current = el;
    }, []);

    const handleMouseLeave = useCallback(() => {
        setActivePoint(null);
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!enabled) return;
            const el = containerEl.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();

            // Mouse position relative to the container's top-left corner.
            const containerX = e.clientX - rect.left;
            const containerY = e.clientY - rect.top;

            // Read actual rendered dot positions from the DOM.
            // This is the single source of truth: Recharts has already computed
            // its own axis domains, padding, and tick layout — we simply read the
            // resulting pixel positions rather than re-implementing that logic.
            const points = readPointsFromDOM(el, series, seriesColors);

            if (points.length === 0) {
                setActivePoint(null);
                return;
            }

            const lookup = buildVoronoiLookup(points);
            if (!lookup) {
                setActivePoint(null);
                return;
            }

            // Look up the nearest point using container-relative coordinates.
            const result = lookup(containerX, containerY);
            if (!result || result.distance > maxDistance) {
                setActivePoint(null);
                return;
            }

            setActivePoint({
                point: result.point,
                mouseX: containerX,
                mouseY: containerY,
                containerWidth: rect.width,
                containerHeight: rect.height,
            });
        },
        [enabled, series, seriesColors, maxDistance]
    );

    return { containerRef, handleMouseMove, handleMouseLeave, activePoint };
}
