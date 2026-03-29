/**
 * Voronoi nearest-point utilities for ScatterChart hover interactions.
 *
 * Uses d3-delaunay's Delaunay triangulation to find the nearest data point to
 * the current mouse position in O(log n) time, enabling a large hit area for
 * each scatter point regardless of data density.
 */

import { Delaunay } from 'd3-delaunay';

export interface ScatterDataPoint {
    /** Data-space X value. */
    xValue: number;
    /** Data-space Y value. */
    yValue: number;
    /**
     * Pixel X coordinate used for Voronoi lookup and tooltip/overlay positioning.
     * When populated by `useVoronoiHover` this is container-relative (i.e. relative
     * to the outer wrapper div, not the SVG plot area), derived from
     * `getBoundingClientRect` of the actual rendered dot element.
     */
    px: number;
    /**
     * Pixel Y coordinate used for Voronoi lookup and tooltip/overlay positioning.
     * Container-relative - see `px` for details.
     */
    py: number;
    /** The raw record from the data array. */
    payload: Record<string, unknown>;
    /** Series name. */
    seriesName: string;
    /** Series color. */
    color: string;
    /** Series index. */
    seriesIndex: number;
    /** Point index within the series. */
    pointIndex: number;
}

/** Result returned by the nearest-point lookup. */
export interface VoronoiHitResult {
    point: ScatterDataPoint;
    /** Euclidean pixel distance from mouse to point center. */
    distance: number;
}

/**
 * Given a list of scatter data points (with px/py pixel coordinates),
 * builds a Delaunay triangulation and returns a lookup function that
 * finds the nearest point to any (mouseX, mouseY) pixel position.
 *
 * Returns `null` when the point set is empty.
 */
export function buildVoronoiLookup(
    points: ScatterDataPoint[]
): ((mouseX: number, mouseY: number) => VoronoiHitResult | null) | null {
    if (points.length === 0) return null;

    // Single-point degenerate case: d3-delaunay needs ≥2 points for a real
    // triangulation but still handles find() correctly with 1 point.
    const coords = new Float64Array(points.length * 2);
    for (let i = 0; i < points.length; i++) {
        coords[i * 2] = points[i].px;
        coords[i * 2 + 1] = points[i].py;
    }

    const delaunay = new Delaunay(coords);

    return (mouseX: number, mouseY: number): VoronoiHitResult | null => {
        const idx = delaunay.find(mouseX, mouseY);
        if (idx < 0 || idx >= points.length) return null;

        const point = points[idx];
        const dx = mouseX - point.px;
        const dy = mouseY - point.py;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return { point, distance };
    };
}

/**
 * Linearly maps a data-space value to a pixel coordinate within the plot area.
 *
 * @param value  - Data value to project.
 * @param domain - [min, max] of the data domain.
 * @param range  - [startPx, endPx] pixel range (note: Y range is typically [height, 0]).
 */
export function linearProject(value: number, domain: [number, number], range: [number, number]): number {
    const [dMin, dMax] = domain;
    const [rStart, rEnd] = range;
    if (dMax === dMin) return (rStart + rEnd) / 2;
    return rStart + ((value - dMin) / (dMax - dMin)) * (rEnd - rStart);
}

/**
 * Computes the [min, max] domain from an array of numeric values.
 * Adds a small 5% padding so edge points are not right at the axis boundary.
 */
export function computeDomain(values: number[]): [number, number] {
    if (values.length === 0) return [0, 1];
    let min = Infinity;
    let max = -Infinity;
    for (const v of values) {
        if (v < min) min = v;
        if (v > max) max = v;
    }
    if (min === max) {
        return [min - 1, max + 1];
    }
    const pad = (max - min) * 0.05;
    return [min - pad, max + pad];
}
