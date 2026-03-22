import { CSSProperties, ReactNode } from 'react';

export type MediaGridSelectionMode = 'none' | 'single' | 'multiple';
export type MediaGridSelection = Set<string> | 'all';

export interface MediaGridIdentifiable {
    id: string | number;
}

export interface MediaGridViewModeConfig {
    label: string;
    itemSize: number;
}

export const DEFAULT_MEDIA_GRID_VIEW_MODE = 'medium';

export const DEFAULT_MEDIA_GRID_VIEW_MODES: Record<string, MediaGridViewModeConfig> = {
    small: { label: 'Small thumbnails', itemSize: 120 },
    medium: { label: 'Medium thumbnails', itemSize: 200 },
    large: { label: 'Large thumbnails', itemSize: 300 },
};

export interface MediaGridRenderContext<T extends MediaGridIdentifiable> {
    item: T | undefined;
    index: number;
    isPlaceholder: boolean;
    isSelected: boolean;
    selectionMode: MediaGridSelectionMode;
    onPress: () => void;
    onDoublePress: () => void;
}

export interface MediaGridProps<T extends MediaGridIdentifiable> {
    totalItems: number;
    getItemAt: (index: number) => T | undefined;
    itemSize?: number;

    selectionMode?: MediaGridSelectionMode;
    selectedKeys?: MediaGridSelection;
    defaultSelectedKeys?: Iterable<string>;
    onSelectionChange?: (keys: MediaGridSelection) => void;

    hasNextPage?: boolean;
    isLoadingMore?: boolean;
    onLoadMore?: () => void;
    loadMoreThresholdRows?: number;

    isLoading?: boolean;
    emptyState?: ReactNode;
    loadingState?: ReactNode;
    renderItem: (context: MediaGridRenderContext<T>) => ReactNode;

    onItemPress?: (context: MediaGridRenderContext<T>) => void;
    onItemDoublePress?: (context: MediaGridRenderContext<T>) => void;

    gap?: number;
    className?: string;
    style?: CSSProperties;
}

export interface MediaGridModeToggleButtonsProps {
    options?: Record<string, MediaGridViewModeConfig>;
    value: string;
    onChange: (nextMode: string) => void;
    isDisabled?: boolean;
}

export interface MediaGridItemProps {
    isSelected?: boolean;
    isPlaceholder?: boolean;
    onPress?: () => void;
    onDoublePress?: () => void;
    topLeft?: ReactNode;
    topRight?: ReactNode;
    bottomLeft?: ReactNode;
    bottomRight?: ReactNode;
    children: ReactNode;
}

export interface MediaGridThumbnailItemProps extends Omit<MediaGridItemProps, 'children'> {
    src?: string;
    alt?: string;
}
