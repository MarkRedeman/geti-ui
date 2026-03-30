import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { MaskAnnotations } from './MaskAnnotations';
import { HoveredProvider } from './HoveredProvider';
import type { Annotation } from './types';

const ANNOTATIONS: Annotation[] = [
    {
        id: 'a',
        labels: [{ id: 'l1', name: 'Car', color: '#ff0000' }],
        shape: { type: 'bounding-box', x: 0, y: 0, width: 100, height: 100 },
    },
    {
        id: 'b',
        labels: [{ id: 'l2', name: 'Truck', color: '#00ff00' }],
        shape: { type: 'circle', cx: 200, cy: 200, r: 50 },
    },
];

describe('MaskAnnotations', () => {
    it('renders an SVG mask element', () => {
        const { container } = render(
            <HoveredProvider>
                <svg>
                    <MaskAnnotations annotations={ANNOTATIONS} width={800} height={600}>
                        <rect data-testid='child' />
                    </MaskAnnotations>
                </svg>
            </HoveredProvider>,
        );

        const mask = container.querySelector('mask');
        expect(mask).toBeDefined();
    });

    it('renders mask shapes for each annotation', () => {
        const { container } = render(
            <HoveredProvider>
                <svg>
                    <MaskAnnotations annotations={ANNOTATIONS} width={800} height={600}>
                        <text>children</text>
                    </MaskAnnotations>
                </svg>
            </HoveredProvider>,
        );

        const mask = container.querySelector('mask');
        // One full-size white rect + shapes for each annotation
        const rects = mask!.querySelectorAll('rect');
        // White background rect + bounding-box rect = 2 rects inside mask
        expect(rects.length).toBe(2);

        const circles = mask!.querySelectorAll('circle');
        expect(circles.length).toBe(1);
    });

    it('renders children inside a <g>', () => {
        const { container } = render(
            <HoveredProvider>
                <svg>
                    <MaskAnnotations annotations={ANNOTATIONS} width={800} height={600}>
                        <text data-testid='child'>hello</text>
                    </MaskAnnotations>
                </svg>
            </HoveredProvider>,
        );

        const text = container.querySelector('[data-testid="child"]');
        expect(text).toBeDefined();
        expect(text?.parentElement?.tagName.toLowerCase()).toBe('g');
    });
});
