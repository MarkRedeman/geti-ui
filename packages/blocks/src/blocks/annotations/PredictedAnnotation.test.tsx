import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { PredictedAnnotation } from './PredictedAnnotation';
import { AnnotationContext } from './AnnotationProvider';
import type { Annotation } from './types';

const USER_ANNOTATION: Annotation = {
    id: 'user-1',
    labels: [{ id: 'l1', name: 'Car', color: '#ff0000', isPrediction: false }],
    shape: { type: 'bounding-box', x: 0, y: 0, width: 100, height: 100 },
};

const PREDICTION_ANNOTATION: Annotation = {
    id: 'pred-1',
    labels: [{ id: 'l2', name: 'Car', color: '#ff0000', isPrediction: true, score: 0.95 }],
    shape: { type: 'bounding-box', x: 0, y: 0, width: 100, height: 100 },
};

describe('PredictedAnnotation', () => {
    it('does not apply prediction style for user annotations', () => {
        const { container } = render(
            <svg>
                <PredictedAnnotation annotation={USER_ANNOTATION}>
                    <rect data-testid='shape' />
                </PredictedAnnotation>
            </svg>,
        );

        const g = container.querySelector('g');
        const style = g?.getAttribute('style') ?? '';
        expect(style).not.toContain('--annotation-fill');
    });

    it('applies prediction fill style for predicted annotations', () => {
        const { container } = render(
            <svg>
                <PredictedAnnotation annotation={PREDICTION_ANNOTATION}>
                    <rect data-testid='shape' />
                </PredictedAnnotation>
            </svg>,
        );

        const g = container.querySelector('g');
        const style = g?.getAttribute('style') ?? '';
        expect(style).toContain('--annotation-fill');
    });

    it('reads from context when no annotation prop is given', () => {
        const { container } = render(
            <svg>
                <AnnotationContext.Provider value={PREDICTION_ANNOTATION}>
                    <PredictedAnnotation>
                        <rect data-testid='shape' />
                    </PredictedAnnotation>
                </AnnotationContext.Provider>
            </svg>,
        );

        const g = container.querySelector('g');
        const style = g?.getAttribute('style') ?? '';
        expect(style).toContain('--annotation-fill');
    });
});
