import type { CSSProperties, ReactNode } from 'react';
import type {
    MediaGridIdentifiable,
    MediaGridPressEvent,
    MediaGridRenderContext,
    MediaGridSelection,
    MediaGridSelectionMode,
} from '../media-grid/types';

export type MediaTableSortDirection = 'ascending' | 'descending';

export type MediaTableSortDescriptor = {
    column: string | number;
    direction: MediaTableSortDirection;
};

export type MediaTableRenderContext<T extends MediaGridIdentifiable> = MediaGridRenderContext<T> & {
    thumbnailSize: number;
};

export type MediaTableColumn<T extends MediaGridIdentifiable> = {
    key: string;
    name: string;
    allowsSorting?: boolean;
    isRowHeader?: boolean;
    textValue?: (context: MediaTableRenderContext<T>) => string;
    renderCell: (context: MediaTableRenderContext<T>) => ReactNode;
};

export type MediaTableProps<T extends MediaGridIdentifiable> = {
    totalItems: number;
    getItemAt: (index: number) => T | undefined;

    columns: MediaTableColumn<T>[];

    selectionMode?: MediaGridSelectionMode;
    selectedKeys?: MediaGridSelection;
    defaultSelectedKeys?: Iterable<string>;
    onSelectionChange?: (keys: MediaGridSelection) => void;

    focusOnSelect?: boolean;

    isLoading?: boolean;
    emptyState?: ReactNode;
    ariaLabel?: string;

    thumbnailSize?: number;
    thumbnailColumnKey?: string;
    thumbnailColumnHeader?: string;
    hideThumbnailColumn?: boolean;
    getThumbnailSrc?: (item: T) => string | undefined;
    getThumbnailAlt?: (item: T) => string;
    renderThumbnail?: (context: MediaTableRenderContext<T>) => ReactNode;

    sortDescriptor?: MediaTableSortDescriptor;
    onSortChange?: (descriptor: MediaTableSortDescriptor) => void;

    density?: 'compact' | 'regular' | 'spacious';
    overflowMode?: 'wrap' | 'truncate';

    onItemPress?: (context: MediaTableRenderContext<T>, event?: MediaGridPressEvent) => void;
    onItemDoublePress?: (context: MediaTableRenderContext<T>) => void;

    className?: string;
    style?: CSSProperties;
};
