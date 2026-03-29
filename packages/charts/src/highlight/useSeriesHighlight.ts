import { useCallback, useMemo, useState } from 'react';
import type { HighlightConfig, HighlightMode, HighlightTrigger } from './types';

export interface UseSeriesHighlightOptions extends HighlightConfig {
    enabled?: boolean;
}

function limitKeys(keys: string[], mode: HighlightMode, maxHighlighted?: number): string[] {
    const deduped = Array.from(new Set(keys.filter(Boolean)));

    if (mode === 'single') {
        return deduped.slice(0, 1);
    }

    if (typeof maxHighlighted === 'number' && Number.isFinite(maxHighlighted) && maxHighlighted > 0) {
        return deduped.slice(0, maxHighlighted);
    }

    return deduped;
}

function areKeyArraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function useSeriesHighlight(options: UseSeriesHighlightOptions = {}) {
    const {
        enabled = false,
        mode = 'single',
        highlightedKeys,
        defaultHighlightedKeys = [],
        onHighlightedKeysChange,
        dimmedOpacity = 0.2,
        activeOpacity = 1,
        maxHighlighted,
    } = options;

    const [uncontrolledPinnedKeys, setUncontrolledPinnedKeys] = useState<string[]>(() =>
        limitKeys(defaultHighlightedKeys, mode, maxHighlighted)
    );
    const [hoveredKeys, setHoveredKeys] = useState<string[]>([]);

    const controlled = Array.isArray(highlightedKeys);
    const pinnedKeys = controlled ? limitKeys(highlightedKeys ?? [], mode, maxHighlighted) : uncontrolledPinnedKeys;

    const activeKeys = pinnedKeys.length > 0 ? pinnedKeys : hoveredKeys;

    const setPinnedKeys = useCallback(
        (keys: string[], trigger: HighlightTrigger) => {
            const next = limitKeys(keys, mode, maxHighlighted);
            if (!enabled) return;

            if (controlled) {
                onHighlightedKeysChange?.(next, trigger);
                return;
            }

            setUncontrolledPinnedKeys(next);
            onHighlightedKeysChange?.(next, trigger);
        },
        [controlled, enabled, maxHighlighted, mode, onHighlightedKeysChange]
    );

    const setHovered = useCallback(
        (keys: string[]) => {
            if (!enabled) return;
            const next = limitKeys(keys, mode, maxHighlighted);
            setHoveredKeys((previous) => (areKeyArraysEqual(previous, next) ? previous : next));
        },
        [enabled, maxHighlighted, mode]
    );

    const clearHover = useCallback(() => {
        if (!enabled) return;
        setHoveredKeys((previous) => (previous.length === 0 ? previous : []));
    }, [enabled]);

    const togglePinnedKey = useCallback(
        (key: string, trigger: HighlightTrigger = 'legend-click') => {
            if (!enabled || !key) return;

            if (!controlled) {
                setUncontrolledPinnedKeys((previous) => {
                    const prev = limitKeys(previous, mode, maxHighlighted);

                    let next: string[];
                    if (mode === 'single') {
                        next = prev[0] === key ? [] : [key];
                    } else {
                        const exists = prev.includes(key);
                        next = exists ? prev.filter((k) => k !== key) : [...prev, key];
                    }

                    const normalized = limitKeys(next, mode, maxHighlighted);
                    onHighlightedKeysChange?.(normalized, trigger);
                    return normalized;
                });
                return;
            }

            const next =
                mode === 'single'
                    ? pinnedKeys[0] === key
                        ? []
                        : [key]
                    : pinnedKeys.includes(key)
                      ? pinnedKeys.filter((k) => k !== key)
                      : [...pinnedKeys, key];
            setPinnedKeys(next, trigger);
        },
        [controlled, enabled, maxHighlighted, mode, onHighlightedKeysChange, pinnedKeys, setPinnedKeys]
    );

    const clearPinned = useCallback(() => {
        setPinnedKeys([], 'external');
    }, [setPinnedKeys]);

    const getOpacity = useCallback(
        (key: string) => {
            if (!enabled || activeKeys.length === 0) {
                return 1;
            }
            return activeKeys.includes(key) ? activeOpacity : dimmedOpacity;
        },
        [activeKeys, activeOpacity, dimmedOpacity, enabled]
    );

    return useMemo(
        () => ({
            enabled,
            mode,
            pinnedKeys,
            hoveredKeys,
            activeKeys,
            setHovered,
            clearHover,
            togglePinnedKey,
            clearPinned,
            getOpacity,
        }),
        [
            activeKeys,
            clearHover,
            clearPinned,
            enabled,
            getOpacity,
            hoveredKeys,
            mode,
            pinnedKeys,
            setHovered,
            togglePinnedKey,
        ]
    );
}
