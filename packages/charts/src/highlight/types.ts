export type HighlightTrigger = 'hover' | 'focus' | 'legend-hover' | 'legend-click' | 'voronoi' | 'external';

export type HighlightMode = 'single' | 'multiple';

export interface HighlightInteractionModel {
    lineHover?: boolean;
    legendHover?: boolean;
    legendClick?: boolean;
    voronoi?: boolean;
}

export interface HighlightConfig {
    enabled?: boolean;
    mode?: HighlightMode;
    highlightedKeys?: string[];
    defaultHighlightedKeys?: string[];
    onHighlightedKeysChange?: (keys: string[], trigger: HighlightTrigger) => void;
    dimmedOpacity?: number;
    activeOpacity?: number;
    interaction?: HighlightInteractionModel;
    maxHighlighted?: number;
}
