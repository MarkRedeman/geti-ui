export type Point = {
    x: number;
    y: number;
};

export type Size = {
    width: number;
    height: number;
};

/**
 * Computed layout config — derived from container/target sizes and props.
 * Changes on resize or target change, not on user interaction.
 */
export type ZoomConfig = {
    /** Fit-to-screen baseline scale and translation */
    initialCoordinates: Point & { scale: number };
    /** Upper bound for zoom scale */
    maxZoomIn: number;
};

/**
 * User-driven transform state — changes on zoom/pan interactions.
 */
export type ZoomTransformState = {
    /** Current zoom scale */
    scale: number;
    /** Current pan offset in pixels */
    translate: Point;
};
