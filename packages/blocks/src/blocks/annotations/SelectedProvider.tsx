import { createContext, useContext, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { useAnnotation } from './AnnotationProvider';
import type { SelectedProviderProps, SelectableAnnotationProps } from './types';

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------

type SelectedAnnotations = Set<string>;

const SelectedAnnotationContext = createContext<SelectedAnnotations>(new Set());
const SetSelectedAnnotationContext = createContext<Dispatch<SetStateAction<SelectedAnnotations>>>(() => {});

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Returns the `Set<string>` of currently selected annotation IDs. */
export function useSelectedAnnotation(): SelectedAnnotations {
    return useContext(SelectedAnnotationContext);
}

/** Returns a setter to programmatically change the set of selected annotations. */
export function useSetSelectedAnnotations(): Dispatch<SetStateAction<SelectedAnnotations>> {
    return useContext(SetSelectedAnnotationContext);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Provides selection-state context for a set of annotations.
 *
 * Place this above any `<SelectableAnnotation>` elements.
 * The composed `<Annotations>` component includes this provider automatically.
 */
export function SelectedProvider({ children }: SelectedProviderProps) {
    const [selectedAnnotations, setSelectedAnnotations] = useState<SelectedAnnotations>(new Set());

    return (
        <SelectedAnnotationContext.Provider value={selectedAnnotations}>
            <SetSelectedAnnotationContext.Provider value={setSelectedAnnotations}>
                {children}
            </SetSelectedAnnotationContext.Provider>
        </SelectedAnnotationContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Selectable wrapper
// ---------------------------------------------------------------------------

/**
 * Wraps children in an SVG `<g>` that handles click-to-select with
 * shift-click multi-select support.
 *
 * Must be used inside both a `<SelectedProvider>` and an `<AnnotationContext.Provider>`.
 */
export function SelectableAnnotation({ children }: SelectableAnnotationProps) {
    const annotation = useAnnotation();
    const selected = useSelectedAnnotation();
    const setSelected = useSetSelectedAnnotations();
    const isSelected = selected.has(annotation.id);

    const handleClick = (e: React.MouseEvent) => {
        const isShift = e.shiftKey;

        setSelected((prev) => {
            if (!isShift) {
                return new Set([annotation.id]);
            }

            const next = new Set(prev);

            if (next.has(annotation.id)) {
                next.delete(annotation.id);
            } else {
                next.add(annotation.id);
            }

            return next;
        });
    };

    return (
        <g
            onClick={handleClick}
            style={{
                ...(isSelected
                    ? {
                          fillOpacity: 'var(--annotation-selected-fill-opacity, 0.7)' as unknown as number,
                          stroke: 'var(--annotation-selected-stroke, var(--energy-blue-light, #00c7fd))',
                          strokeWidth: 'calc(var(--annotation-selected-stroke-width, calc(var(--annotation-stroke-width, 2px) * 1.5)) / var(--zoom-scale, 1))',
                      }
                    : {}),
                transitionProperty: 'fill-opacity',
                transitionTimingFunction: 'ease-in-out',
                transitionDuration: '0.1s',
                transitionDelay: isSelected ? '0s' : '0.25s',
            }}
        >
            {children}
        </g>
    );
}
