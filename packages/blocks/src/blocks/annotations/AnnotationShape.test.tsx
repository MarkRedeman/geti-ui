import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { AnnotationShape } from './AnnotationShape';
import { AnnotationContext } from './AnnotationProvider';
import type { Annotation } from './types';

const RECT_ANNOTATION: Annotation = {
    id: 'rect-1',
    labels: [{ id: 'l1', name: 'Car', color: '#ff0000' }],
    shape: { type: 'bounding-box', x: 10, y: 20, width: 100, height: 50 },
};

const CIRCLE_ANNOTATION: Annotation = {
    id: 'circle-1',
    labels: [{ id: 'l2', name: 'Wheel', color: '#00ff00' }],
    shape: { type: 'circle', cx: 50, cy: 50, r: 30 },
};

const POLYGON_ANNOTATION: Annotation = {
    id: 'polygon-1',
    labels: [{ id: 'l3', name: 'Road', color: '#0000ff' }],
    shape: {
        type: 'polygon',
        points: [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
        ],
    },
};

const ORIENTED_BBOX_ANNOTATION: Annotation = {
    id: 'obb-1',
    labels: [{ id: 'l4', name: 'Sign', color: '#ffff00' }],
    shape: { type: 'oriented-bounding-box', cx: 50, cy: 50, width: 80, height: 40, angle: 45 },
};

function renderWithSvg(ui: React.ReactNode) {
    return render(<svg>{ui}</svg>);
}

describe('AnnotationShape', () => {
    it('renders a rect for bounding-box shapes', () => {
        const { container } = renderWithSvg(<AnnotationShape annotation={RECT_ANNOTATION} />);
        const rect = container.querySelector('rect');

        expect(rect).toBeDefined();
        expect(rect?.getAttribute('x')).toBe('10');
        expect(rect?.getAttribute('y')).toBe('20');
        expect(rect?.getAttribute('width')).toBe('100');
        expect(rect?.getAttribute('height')).toBe('50');
    });

    it('renders a circle for circle shapes', () => {
        const { container } = renderWithSvg(<AnnotationShape annotation={CIRCLE_ANNOTATION} />);
        const circle = container.querySelector('circle');

        expect(circle).toBeDefined();
        expect(circle?.getAttribute('cx')).toBe('50');
        expect(circle?.getAttribute('cy')).toBe('50');
        expect(circle?.getAttribute('r')).toBe('30');
    });

    it('renders a polygon for polygon shapes', () => {
        const { container } = renderWithSvg(<AnnotationShape annotation={POLYGON_ANNOTATION} />);
        const polygon = container.querySelector('polygon');

        expect(polygon).toBeDefined();
        expect(polygon?.getAttribute('points')).toBe('0,0 100,0 100,100 0,100');
    });

    it('renders an oriented bounding box as a rotated rect', () => {
        const { container } = renderWithSvg(<AnnotationShape annotation={ORIENTED_BBOX_ANNOTATION} />);
        const rect = container.querySelector('rect');

        expect(rect).toBeDefined();
        expect(rect?.getAttribute('width')).toBe('80');
        expect(rect?.getAttribute('height')).toBe('40');
        expect(rect?.getAttribute('transform')).toBe('rotate(45)');
    });

    it('reads from AnnotationContext when no annotation prop is given', () => {
        const { container } = renderWithSvg(
            <AnnotationContext.Provider value={RECT_ANNOTATION}>
                <AnnotationShape />
            </AnnotationContext.Provider>,
        );

        const rect = container.querySelector('rect');
        expect(rect).toBeDefined();
        expect(rect?.getAttribute('x')).toBe('10');
    });
});
