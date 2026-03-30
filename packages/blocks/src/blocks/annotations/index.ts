// @geti-ui/blocks — Annotation block public API

// Composed component
export { Annotations } from './Annotations';

// Primitives
export { AnnotationContext, useAnnotation } from './AnnotationProvider';
export { AnnotationShape } from './AnnotationShape';
export { HoveredProvider, HoverableAnnotation, useHoveredAnnotation, useSetHoveredAnnotation, useIsHovered } from './HoveredProvider';
export { SelectedProvider, SelectableAnnotation, useSelectedAnnotation, useSetSelectedAnnotations } from './SelectedProvider';
export { MaskAnnotations } from './MaskAnnotations';
export { PredictedAnnotation } from './PredictedAnnotation';

// Types
export type {
    AnnotationPoint,
    BoundingBox,
    OrientedBoundingBox,
    CircleShape,
    PolygonShape,
    Shape,
    ShapeType,
    AnnotationLabel,
    Annotation,
    AnnotationsProps,
    AnnotationShapeProps,
    MaskAnnotationsProps,
    HoveredProviderProps,
    HoverableAnnotationProps,
    SelectedProviderProps,
    SelectableAnnotationProps,
    PredictedAnnotationProps,
} from './types';

export { DEFAULT_ANNOTATION_STYLES } from './types';
