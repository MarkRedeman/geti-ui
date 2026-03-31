import type { Annotation, OrientedBoundingBox, PolygonShape } from './types';
import { useAnnotation } from './AnnotationProvider';

// ---------------------------------------------------------------------------
// Internal sub-components for complex shapes
// ---------------------------------------------------------------------------

function OrientedBoundingBoxShape({ shape }: { shape: OrientedBoundingBox }) {
    const { cx, cy, width, height, angle } = shape;

    return (
        <rect
            x={cx - width / 2}
            y={cy - height / 2}
            width={width}
            height={height}
            transform={`rotate(${angle})`}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
    );
}

function PolygonSvgShape({ shape }: { shape: PolygonShape }) {
    const points = shape.points.map(({ x, y }) => `${x},${y}`).join(' ');

    return <polygon points={points} />;
}

// ---------------------------------------------------------------------------
// Internal renderer — receives a resolved annotation
// ---------------------------------------------------------------------------

function ShapeRenderer({ annotation }: { annotation: Annotation }) {
    const { shape } = annotation;

    switch (shape.type) {
        case 'bounding-box':
            return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} />;
        case 'polygon':
            return <PolygonSvgShape shape={shape} />;
        case 'circle':
            return <circle cx={shape.cx} cy={shape.cy} r={shape.r} />;
        case 'oriented-bounding-box':
            return <OrientedBoundingBoxShape shape={shape} />;
        default:
            return null;
    }
}

// ---------------------------------------------------------------------------
// Context-aware variant (uses useAnnotation hook)
// ---------------------------------------------------------------------------

function ContextAnnotationShape() {
    const annotation = useAnnotation();

    return <ShapeRenderer annotation={annotation} />;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface AnnotationShapeProps {
    /**
     * Override the annotation whose shape to render.
     * When omitted, reads from the nearest `AnnotationContext`.
     */
    annotation?: Annotation;
}

/**
 * Renders the correct SVG primitive for the annotation's shape type.
 *
 * Supports `bounding-box`, `polygon`, `circle`, and `oriented-bounding-box`.
 */
export function AnnotationShape({ annotation }: AnnotationShapeProps) {
    if (annotation) {
        return <ShapeRenderer annotation={annotation} />;
    }

    return <ContextAnnotationShape />;
}
