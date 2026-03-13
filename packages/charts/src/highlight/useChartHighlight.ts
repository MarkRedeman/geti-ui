import { useHighlightContext } from './HighlightContext';
import type { UseSeriesHighlightOptions } from './useSeriesHighlight';
import { useSeriesHighlight } from './useSeriesHighlight';

/**
 * Returns the shared highlight state from a HighlightProvider ancestor when one is
 * present, otherwise creates and returns local state via useSeriesHighlight.
 *
 * This hook always calls both `useHighlightContext` and `useSeriesHighlight` to
 * satisfy the Rules of Hooks (hooks must not be called conditionally). The local
 * state is discarded when the provider is available.
 *
 * @param options - Passed to `useSeriesHighlight` when no provider is present.
 *
 * @example
 * ```tsx
 * // Inside a chart component:
 * const highlightState = useChartHighlight({ ...highlight, enabled: highlightEnabled });
 * ```
 */
export function useChartHighlight(options: UseSeriesHighlightOptions = {}) {
    const contextValue = useHighlightContext();
    // Always call the hook unconditionally (Rules of Hooks).
    // When a provider is present the local state is created but immediately discarded.
    const localState = useSeriesHighlight(options);

    return contextValue ?? localState;
}
