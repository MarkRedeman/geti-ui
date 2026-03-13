import { createContext, useContext } from 'react';
import type { useSeriesHighlight } from './useSeriesHighlight';

/**
 * Holds the shared highlight state provided by HighlightProvider.
 * Charts inside a provider read from this context instead of maintaining local state.
 */
export type HighlightContextValue = ReturnType<typeof useSeriesHighlight>;

export const HighlightContext = createContext<HighlightContextValue | null>(null);
HighlightContext.displayName = 'HighlightContext';

/**
 * Returns the current HighlightContext value, or `null` when no provider is present.
 * Charts should use `useChartHighlight` instead, which handles the fallback automatically.
 */
export function useHighlightContext(): HighlightContextValue | null {
    return useContext(HighlightContext);
}
