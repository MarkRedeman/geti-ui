import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { SelectedProvider, SelectableAnnotation, useSelectedAnnotation } from './SelectedProvider';
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

function SelectionDisplay() {
    const selected = useSelectedAnnotation();
    const ids = Array.from(selected).sort().join(',');

    return <span data-testid='selected-ids'>{ids || 'none'}</span>;
}

function renderSelectable() {
    return render(
        <SelectedProvider>
            <svg>
                <AnnotationContext.Provider value={ANNOTATION_A}>
                    <SelectableAnnotation>
                        <rect data-testid='shape-a' width={100} height={100} />
                    </SelectableAnnotation>
                </AnnotationContext.Provider>
                <AnnotationContext.Provider value={ANNOTATION_B}>
                    <SelectableAnnotation>
                        <rect data-testid='shape-b' width={100} height={100} />
                    </SelectableAnnotation>
                </AnnotationContext.Provider>
            </svg>
            <SelectionDisplay />
        </SelectedProvider>,
    );
}

describe('SelectedProvider', () => {
    it('starts with no annotation selected', () => {
        renderSelectable();
        expect(screen.getByTestId('selected-ids').textContent).toBe('none');
    });

    it('selects an annotation on click', () => {
        renderSelectable();

        const g = screen.getByTestId('shape-a').parentElement!;
        fireEvent.click(g);

        expect(screen.getByTestId('selected-ids').textContent).toBe('a');
    });

    it('replaces selection on click without shift', () => {
        renderSelectable();

        fireEvent.click(screen.getByTestId('shape-a').parentElement!);
        expect(screen.getByTestId('selected-ids').textContent).toBe('a');

        fireEvent.click(screen.getByTestId('shape-b').parentElement!);
        expect(screen.getByTestId('selected-ids').textContent).toBe('b');
    });

    it('adds to selection with shift-click', () => {
        renderSelectable();

        fireEvent.click(screen.getByTestId('shape-a').parentElement!);
        expect(screen.getByTestId('selected-ids').textContent).toBe('a');

        fireEvent.click(screen.getByTestId('shape-b').parentElement!, { shiftKey: true });
        expect(screen.getByTestId('selected-ids').textContent).toBe('a,b');
    });

    it('removes from selection with shift-click on already selected', () => {
        renderSelectable();

        // Select both
        fireEvent.click(screen.getByTestId('shape-a').parentElement!);
        fireEvent.click(screen.getByTestId('shape-b').parentElement!, { shiftKey: true });
        expect(screen.getByTestId('selected-ids').textContent).toBe('a,b');

        // Shift-click A again to deselect
        fireEvent.click(screen.getByTestId('shape-a').parentElement!, { shiftKey: true });
        expect(screen.getByTestId('selected-ids').textContent).toBe('b');
    });
});
