import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { HoveredProvider, HoverableAnnotation, useHoveredAnnotation, useIsHovered } from './HoveredProvider';
import { AnnotationContext } from './AnnotationProvider';
import type { Annotation } from './types';

const ANNOTATION_A: Annotation = {
    id: 'a',
    labels: [{ id: 'l1', name: 'Car', color: '#ff0000' }],
    shape: { type: 'bounding-box', x: 0, y: 0, width: 100, height: 100 },
};

const ANNOTATION_B: Annotation = {
    id: 'b',
    labels: [{ id: 'l2', name: 'Truck', color: '#00ff00' }],
    shape: { type: 'bounding-box', x: 200, y: 0, width: 100, height: 100 },
};

function HoverDisplay() {
    const hoveredId = useHoveredAnnotation();
    const isHovered = useIsHovered();

    return (
        <div>
            <span data-testid='hovered-id'>{hoveredId ?? 'none'}</span>
            <span data-testid='is-hovered'>{String(isHovered)}</span>
        </div>
    );
}

describe('HoveredProvider', () => {
    it('starts with no annotation hovered', () => {
        render(
            <HoveredProvider>
                <HoverDisplay />
            </HoveredProvider>,
        );

        expect(screen.getByTestId('hovered-id').textContent).toBe('none');
        expect(screen.getByTestId('is-hovered').textContent).toBe('false');
    });

    it('sets hovered annotation on pointer enter', () => {
        render(
            <HoveredProvider>
                <svg>
                    <AnnotationContext.Provider value={ANNOTATION_A}>
                        <HoverableAnnotation>
                            <rect data-testid='shape-a' width={100} height={100} />
                        </HoverableAnnotation>
                    </AnnotationContext.Provider>
                </svg>
                <HoverDisplay />
            </HoveredProvider>,
        );

        const shapeA = screen.getByTestId('shape-a');
        // pointerEnter triggers on the parent <g>
        fireEvent.pointerEnter(shapeA.parentElement!);

        expect(screen.getByTestId('hovered-id').textContent).toBe('a');
        expect(screen.getByTestId('is-hovered').textContent).toBe('true');
    });

    it('clears hovered annotation on pointer leave', () => {
        render(
            <HoveredProvider>
                <svg>
                    <AnnotationContext.Provider value={ANNOTATION_A}>
                        <HoverableAnnotation>
                            <rect data-testid='shape-a' width={100} height={100} />
                        </HoverableAnnotation>
                    </AnnotationContext.Provider>
                </svg>
                <HoverDisplay />
            </HoveredProvider>,
        );

        const g = screen.getByTestId('shape-a').parentElement!;
        fireEvent.pointerEnter(g);
        expect(screen.getByTestId('hovered-id').textContent).toBe('a');

        fireEvent.pointerLeave(g);
        expect(screen.getByTestId('hovered-id').textContent).toBe('none');
    });
});
