// Annotation domain types for the @geti-ui/blocks annotation block.

/** A 2D point. */
export interface AnnotationPoint {
    x: number;
    y: number;
}

/** Axis-aligned bounding box. */
export interface BoundingBox {
    type: 'bounding-box';
    x: number;
    y: number;
    width: number;
    height: number;
}

/** Rotated bounding box defined by its center, dimensions, and rotation angle (degrees). */
export interface OrientedBoundingBox {
    type: 'oriented-bounding-box';
    cx: number;
    cy: number;
    width: number;
    height: number;
    /** Rotation angle in degrees. */
    angle: number;
}

/** Circle defined by center and radius. */
export interface CircleShape {
    type: 'circle';
    cx: number;
    cy: number;
    r: number;
}

/** Polygon defined by an ordered list of vertices. */
export interface PolygonShape {
    type: 'polygon';
    points: AnnotationPoint[];
}

/** Discriminated union of all supported annotation shapes. */
export type Shape = BoundingBox | OrientedBoundingBox | CircleShape | PolygonShape;

/** All supported shape type string literals. */
export type ShapeType = Shape['type'];

/** A label attached to an annotation. */
export interface AnnotationLabel {
    id: string;
    name: string;
    color: string;
    /** When `true`, this label comes from a model prediction rather than a human annotator. */
    isPrediction?: boolean;
    /** Prediction confidence score in [0, 1]. */
    score?: number;
}

/** A single annotation: a shape with one or more labels. */
export interface Annotation {
    id: string;
    labels: ReadonlyArray<AnnotationLabel>;
    shape: Shape;
}

// ---------------------------------------------------------------------------
// Component prop types
// ---------------------------------------------------------------------------

export interface AnnotationsProps {
    /** The annotations to render. */
    annotations: ReadonlyArray<Annotation>;
    /** Natural width of the coordinate space (e.g. image width in pixels). */
    width: number;
    /** Natural height of the coordinate space (e.g. image height in pixels). */
    height: number;
    /**
     * When `true`, annotations respond to hover and click interactions.
     * @default true
     */
    interactive?: boolean;
}

export interface AnnotationShapeProps {
    /** Override the annotation to render. When omitted, reads from `useAnnotation()` context. */
    annotation?: Annotation;
}

export interface MaskAnnotationsProps {
    /** The full set of annotations (needed to build the SVG mask). */
    annotations: ReadonlyArray<Annotation>;
    /** Coordinate-space width. */
    width: number;
    /** Coordinate-space height. */
    height: number;
    children: React.ReactNode;
}

export interface HoveredProviderProps {
    children: React.ReactNode;
}

export interface HoverableAnnotationProps {
    children: React.ReactNode;
}

export interface SelectedProviderProps {
    children: React.ReactNode;
}

export interface SelectableAnnotationProps {
    children: React.ReactNode;
}

export interface PredictedAnnotationProps {
    children: React.ReactNode;
    annotation?: Annotation;
}

// ---------------------------------------------------------------------------
// Default SVG styling applied to the root <svg> by the composed <Annotations>.
// Uses CSS custom properties so consumers can override colors/opacity globally.
// ---------------------------------------------------------------------------

export const DEFAULT_ANNOTATION_STYLES: React.CSSProperties = {
    fillOpacity: 'var(--annotation-fill-opacity, 0.1)' as unknown as number,
    fill: 'var(--annotation-fill, currentColor)',
    stroke: 'var(--annotation-stroke, currentColor)',
    strokeLinecap: 'round',
    strokeWidth: 'calc(var(--annotation-stroke-width, 2px) / var(--zoom-scale, 1))',
    strokeDashoffset: 0,
    strokeDasharray: '0',
    strokeOpacity: 'var(--annotation-border-opacity, 1)' as unknown as number,
};
