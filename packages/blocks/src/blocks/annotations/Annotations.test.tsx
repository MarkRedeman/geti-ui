import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { Annotations } from './Annotations';
import type { Annotation } from './types';

const SAMPLE_ANNOTATIONS: Annotation[] = [
    {
        id: 'rect-1',
        labels: [{ id: 'l1', name: 'Car', color: '#ff0000' }],
        shape: { type: 'bounding-box', x: 10, y: 20, width: 100, height: 50 },
    },
    {
        id: 'circle-1',
        labels: [{ id: 'l2', name: 'Wheel', color: '#00ff00' }],
        shape: { type: 'circle', cx: 50, cy: 50, r: 30 },
    },
    {
        id: 'polygon-1',
        labels: [{ id: 'l3', name: 'Road', color: '#0000ff' }],
        shape: {
            type: 'polygon',
            points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 50, y: 80 },
            ],
        },
    },
];

describe('Annotations', () => {
    it('renders an SVG element with the specified dimensions', () => {
        const { container } = render(<Annotations annotations={SAMPLE_ANNOTATIONS} width={800} height={600} />);

        const svg = container.querySelector('svg');
        expect(svg).toBeDefined();
        expect(svg?.getAttribute('width')).toBe('800');
        expect(svg?.getAttribute('height')).toBe('600');
    });

    it('renders shapes for each annotation', () => {
        const { container } = render(<Annotations annotations={SAMPLE_ANNOTATIONS} width={800} height={600} />);

        // The mask also renders shapes, so we look at all shapes in the SVG
        const rects = container.querySelectorAll('rect');
        const circles = container.querySelectorAll('circle');
        const polygons = container.querySelectorAll('polygon');

        // At least one rect (annotation) + mask rects
        expect(rects.length).toBeGreaterThan(0);
        // At least one circle (annotation) + mask circle
        expect(circles.length).toBeGreaterThan(0);
        // At least one polygon (annotation) + mask polygon
        expect(polygons.length).toBeGreaterThan(0);
    });

    it('renders without interactive behaviors when interactive=false', () => {
        const { container } = render(
            <Annotations annotations={SAMPLE_ANNOTATIONS} width={800} height={600} interactive={false} />
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeDefined();

        // No mask element when non-interactive
        const mask = container.querySelector('mask');
        expect(mask).toBeNull();
    });

    it('renders with an empty annotations array', () => {
        const { container } = render(<Annotations annotations={[]} width={800} height={600} />);

        const svg = container.querySelector('svg');
        expect(svg).toBeDefined();
    });
});
