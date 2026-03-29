export type Point = {
    x: number;
    y: number;
};

export type Size = {
    width: number;
    height: number;
};

/** A rectangle in content-space coordinates. */
export type Rect = {
    /** Left edge (x coordinate of top-left corner) */
    x: number;
    /** Top edge (y coordinate of top-left corner) */
    y: number;
    /** Width of the rectangle */
    width: number;
    /** Height of the rectangle */
    height: number;
};

/** Options for the `zoomTo` action. */
export type ZoomToOptions = {
    /**
     * Extra padding (in viewport pixels) around the target rectangle.
     * @default 0
     */
    padding?: number;
};

/**
 * Computed layout config - derived from container/target sizes and props.
 * Changes on resize or target change, not on user interaction.
 */
export type ZoomConfig = {
    /** Fit-to-screen baseline scale and translation */
    initialCoordinates: Point & { scale: number };
    /** Lower bound for zoom scale (can be below fit-to-screen) */
    minScale: number;
    /** Upper bound for zoom scale */
    maxScale: number;
};

/**
 * User-driven transform state - changes on zoom/pan interactions.
 */
export type ZoomTransformState = {
    /** Current zoom scale */
    scale: number;
    /** Current pan offset in pixels */
    translate: Point;
};
