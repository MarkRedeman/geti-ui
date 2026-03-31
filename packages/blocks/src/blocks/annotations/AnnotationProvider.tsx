import { createContext, useContext } from 'react';

import type { Annotation } from './types';

const AnnotationContext = createContext<Annotation | null>(null);

/**
 * Read the current `Annotation` from context.
 *
 * Must be used inside an `<AnnotationContext.Provider>` (which the composed
 * `<Annotations>` component sets up automatically for each annotation).
 */
export function useAnnotation(): Annotation {
    const ctx = useContext(AnnotationContext);

    if (ctx === null) {
        throw new Error('useAnnotation must be used within an AnnotationContext.Provider');
    }

    return ctx;
}

export { AnnotationContext };
