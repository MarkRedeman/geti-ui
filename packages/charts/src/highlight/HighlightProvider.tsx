import type { ReactNode } from 'react';
import { HighlightContext } from './HighlightContext';
import type { UseSeriesHighlightOptions } from './useSeriesHighlight';
import { useSeriesHighlight } from './useSeriesHighlight';

export interface HighlightProviderProps extends UseSeriesHighlightOptions {
    children: ReactNode;
}

/**
 * Optional context provider that creates a shared highlight state for all
 * descendent charts. When present, charts will use the shared state instead
 * of maintaining their own local state.
 *
 * This is non-breaking: charts continue to work without a provider.
 *
 * @example
 * ```tsx
 * <HighlightProvider enabled mode="single">
 *   <LineChart highlight={...} />
 *   <BarChart highlight={...} />
 * </HighlightProvider>
 * ```
 */
export function HighlightProvider({ children, ...options }: HighlightProviderProps) {
    const highlightState = useSeriesHighlight(options);

    return <HighlightContext.Provider value={highlightState}>{children}</HighlightContext.Provider>;
}
