/**
 * Minimal type declarations for d3-delaunay v6.
 * Only the surface area used by voronoiUtils.ts is declared here.
 *
 * Full API: https://github.com/d3/d3-delaunay#api-reference
 */
declare module 'd3-delaunay' {
    /**
     * Computes the Delaunay triangulation of a set of 2D points.
     */
    export class Delaunay {
        /** Flat array of point coordinates: [x0, y0, x1, y1, ...] */
        readonly points: Float64Array;

        /**
         * Creates a Delaunay triangulation from a flat Float64Array of coordinates.
         * The array must have an even length: [x0, y0, x1, y1, ...].
         */
        constructor(points: ArrayLike<number>);

        /**
         * Returns the index of the point nearest to the given (x, y) coordinates.
         * Optionally, an initial search hint index `i` can be provided to speed
         * up repeated queries near the same location.
         */
        find(x: number, y: number, i?: number): number;
    }
}
