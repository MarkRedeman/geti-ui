import type { CSSProperties } from 'react';

import { useAnnotation } from './AnnotationProvider';
import type { Annotation, PredictedAnnotationProps } from './types';

// ---------------------------------------------------------------------------
// Internal renderer — receives a resolved annotation
// ---------------------------------------------------------------------------

function PredictionWrapper({ annotation, children }: { annotation: Annotation; children: React.ReactNode }) {
    const isPrediction = annotation.labels.some((label) => label.isPrediction);

    const style: CSSProperties = isPrediction
        ? { '--annotation-fill': 'var(--annotation-prediction-fill, #34d399)' } as CSSProperties
        : {};

    return <g style={style}>{children}</g>;
}

// ---------------------------------------------------------------------------
// Context-aware variant
// ---------------------------------------------------------------------------

function ContextPredictedAnnotation({ children }: { children: React.ReactNode }) {
    const annotation = useAnnotation();

    return <PredictionWrapper annotation={annotation}>{children}</PredictionWrapper>;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

/**
 * Wrapper that applies prediction-specific styling when the annotation's
 * labels include at least one prediction (`isPrediction: true`).
 *
 * Sets `--annotation-fill` to the prediction color so descendant shapes
 * pick it up automatically.
 *
 * When no `annotation` prop is provided, reads from `useAnnotation()` context.
 */
export function PredictedAnnotation({ children, annotation }: PredictedAnnotationProps) {
    if (annotation) {
        return <PredictionWrapper annotation={annotation}>{children}</PredictionWrapper>;
    }

    return <ContextPredictedAnnotation>{children}</ContextPredictedAnnotation>;
}
