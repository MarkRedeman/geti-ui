import { createContext, useContext, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { useAnnotation } from './AnnotationProvider';
import type { HoveredProviderProps, HoverableAnnotationProps } from './types';

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------

const HoveredAnnotationContext = createContext<string | null>(null);
const SetHoveredAnnotationContext = createContext<Dispatch<SetStateAction<string | null>>>(() => {});

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Returns the ID of the currently hovered annotation, or `null`. */
export function useHoveredAnnotation(): string | null {
    return useContext(HoveredAnnotationContext);
}

/** Returns a setter to programmatically change the hovered annotation. */
export function useSetHoveredAnnotation(): Dispatch<SetStateAction<string | null>> {
    return useContext(SetHoveredAnnotationContext);
}

/** Returns `true` when any annotation is hovered. */
export function useIsHovered(): boolean {
    return useContext(HoveredAnnotationContext) !== null;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Provides hover-state context for a set of annotations.
 *
 * Place this above any `<HoverableAnnotation>` elements.
 * The composed `<Annotations>` component includes this provider automatically.
 */
export function HoveredProvider({ children }: HoveredProviderProps) {
    const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null);

    return (
        <HoveredAnnotationContext.Provider value={hoveredAnnotation}>
            <SetHoveredAnnotationContext.Provider value={setHoveredAnnotation}>
                {children}
            </SetHoveredAnnotationContext.Provider>
        </HoveredAnnotationContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Hoverable wrapper
// ---------------------------------------------------------------------------

/**
 * Wraps children in an SVG `<g>` that tracks pointer enter/leave and applies
 * hover styling via CSS transitions.
 *
 * Must be used inside both a `<HoveredProvider>` and an `<AnnotationContext.Provider>`.
 */
export function HoverableAnnotation({ children }: HoverableAnnotationProps) {
    const annotation = useAnnotation();
    const hoveredId = useHoveredAnnotation();
    const setHoveredAnnotation = useSetHoveredAnnotation();
    const isHovered = hoveredId === annotation.id;

    return (
        <g
            onPointerEnter={() => setHoveredAnnotation(annotation.id)}
            onPointerLeave={() => isHovered && setHoveredAnnotation(null)}
            style={{
                fill: isHovered ? 'var(--annotation-hover-fill, yellow)' : undefined,
                fillOpacity: (isHovered
                    ? 'var(--annotation-hover-opacity, 0.4)'
                    : 'var(--annotation-fill-opacity, 0.1)') as unknown as number,
                transitionProperty: 'fill, fill-opacity',
                transitionTimingFunction: 'ease-in-out',
                transitionDuration: '0.15s',
                transitionDelay: isHovered ? '0s' : '0.25s',
            }}
        >
            {children}
        </g>
    );
}
