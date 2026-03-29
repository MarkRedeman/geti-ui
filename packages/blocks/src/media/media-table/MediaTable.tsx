import { useCallback, useMemo, useRef, useState } from 'react';
import {
    Column,
    TableBody,
    TableHeader,
    TableView,
    Text,
    View,
    type AriaSelection,
} from '@geti-ui/ui';
import styles from './media-table.module.css';
import {
    createMediaRenderContext,
    useFocusOnSelect,
    useVirtualMediaItems,
    type VirtualMediaItem,
} from '../media-grid/hooks';
import type { MediaGridIdentifiable, MediaGridRenderContext, MediaGridSelection } from '../media-grid/types';
import { MediaEntry } from './MediaEntry';
import type { MediaTableProps, MediaTableRenderContext, MediaTableSortDescriptor } from './types';

const DEFAULT_THUMBNAIL_SIZE = 50;
const DEFAULT_THUMBNAIL_COLUMN_KEY = '__thumbnail__';

const clampSelection = (value: MediaGridSelection | undefined): MediaGridSelection => value ?? new Set<string>();

function normalizeSelectionKeys(selection: MediaGridSelection): Set<string> {
    if (selection === 'all') {
        return new Set<string>();
    }
    return new Set(selection);
}

function isMediaTableSortDescriptor(value: unknown): value is MediaTableSortDescriptor {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const descriptor = value as Record<string, unknown>;
    return (
        (typeof descriptor.column === 'string' || typeof descriptor.column === 'number') &&
        (descriptor.direction === 'ascending' || descriptor.direction === 'descending')
    );
}

export function MediaTable<T extends MediaGridIdentifiable>({
    totalItems,
    getItemAt,
    columns,
    selectionMode = 'multiple',
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    focusOnSelect = false,
    isLoading = false,
    emptyState,
    ariaLabel = 'Media table',
    thumbnailSize = DEFAULT_THUMBNAIL_SIZE,
    thumbnailColumnKey = DEFAULT_THUMBNAIL_COLUMN_KEY,
    thumbnailColumnHeader = 'Thumbnail',
    hideThumbnailColumn = false,
    EntryComponent = MediaEntry,
    sortDescriptor,
    onSortChange,
    density = 'regular',
    overflowMode = 'wrap',
    onItemPress,
    onItemDoublePress,
    className,
    style,
}: MediaTableProps<T>) {
    type HeaderColumn = {
        key: string;
        name: string;
        allowsSorting?: boolean;
        isRowHeader?: boolean;
    };

    const [internalSelection, setInternalSelection] = useState<MediaGridSelection>(
        defaultSelectedKeys ? new Set(defaultSelectedKeys) : new Set()
    );

    const isControlledSelection = selectedKeys !== undefined;
    const effectiveSelection = isControlledSelection ? clampSelection(selectedKeys) : internalSelection;
    const effectiveSelectionSet = useMemo(() => normalizeSelectionKeys(effectiveSelection), [effectiveSelection]);
    const tableRef = useRef<HTMLDivElement | null>(null);

    const items = useVirtualMediaItems(totalItems, getItemAt);

    useFocusOnSelect({
        focusOnSelect,
        containerRef: tableRef,
        selection: effectiveSelection,
    });

    const handleSelectionChange = (keys: AriaSelection) => {
        const typed = keys as MediaGridSelection;
        if (!isControlledSelection) {
            setInternalSelection(typed);
        }
        onSelectionChange?.(typed);
    };

    const handleSortChange = useCallback(
        (next: unknown) => {
            if (!isMediaTableSortDescriptor(next)) {
                return;
            }

            onSortChange?.(next);
        },
        [onSortChange]
    );

    const rootClassName = [styles.root, className].filter(Boolean).join(' ');

    const hasCustomThumbnailColumn = useMemo(
        () => columns.some((column) => column.key === thumbnailColumnKey),
        [columns, thumbnailColumnKey]
    );

    const shouldRenderAutoThumbnailColumn = !hideThumbnailColumn && !hasCustomThumbnailColumn;

    const headerColumns = useMemo<HeaderColumn[]>(() => {
        const baseColumns = columns.map(({ key, name, allowsSorting, isRowHeader }) => ({
            key,
            name,
            allowsSorting,
            isRowHeader,
        }));

        if (!shouldRenderAutoThumbnailColumn) {
            return baseColumns;
        }

        return [
            {
                key: thumbnailColumnKey,
                name: thumbnailColumnHeader,
                allowsSorting: false,
                isRowHeader: false,
            },
            ...baseColumns,
        ];
    }, [columns, shouldRenderAutoThumbnailColumn, thumbnailColumnKey, thumbnailColumnHeader]);

    const columnMap = useMemo(() => {
        return new Map(columns.map((column) => [column.key, column]));
    }, [columns]);

    const createTableRenderContext = useCallback(
        (gridContext: MediaGridRenderContext<T>): MediaTableRenderContext<T> => {
            const baseContext: MediaTableRenderContext<T> = {
                ...gridContext,
                thumbnailSize,
            };

            return {
                ...baseContext,
                onPress: (event) => onItemPress?.(baseContext, event),
            };
        },
        [onItemPress, thumbnailSize]
    );

    if (!isLoading && totalItems === 0) {
        return (
            <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
                <View UNSAFE_className={styles.emptyState}>{emptyState ?? <Text>No media items available</Text>}</View>
            </View>
        );
    }

    return (
        <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
            <div className={styles.tableContainer} ref={tableRef}>
                <TableView
                    aria-label={ariaLabel}
                    selectionMode={selectionMode}
                    selectedKeys={effectiveSelection}
                    onSelectionChange={handleSelectionChange}
                    sortDescriptor={sortDescriptor}
                    density={density}
                    overflowMode={overflowMode}
                    onSortChange={handleSortChange}
                    height="100%"
                    UNSAFE_className={styles.tableView}
                >
                    <TableHeader columns={headerColumns}>
                        {(column: HeaderColumn) => (
                            <Column
                                key={column.key}
                                allowsSorting={column.allowsSorting}
                                isRowHeader={column.isRowHeader}
                            >
                                {column.name}
                            </Column>
                        )}
                    </TableHeader>
                    <TableBody items={items}>
                        {(entry: VirtualMediaItem<T>) => {
                            const gridContext = createMediaRenderContext({
                                entry,
                                effectiveSelection,
                                effectiveSelectionSet,
                                selectionMode,
                                onItemPress: (context) => onItemPress?.(createTableRenderContext(context)),
                                onItemDoublePress: (context) => onItemDoublePress?.(createTableRenderContext(context)),
                            });

                            const context = createTableRenderContext(gridContext);

                            const entryProps = {
                                entry,
                                context,
                                getColumn: (key: string) => columnMap.get(key),
                                thumbnailColumnKey,
                                shouldRenderAutoThumbnailColumn,
                                thumbnailSize,
                            };

                            return EntryComponent(entryProps);
                        }}
                    </TableBody>
                </TableView>
            </div>
        </View>
    );
}
