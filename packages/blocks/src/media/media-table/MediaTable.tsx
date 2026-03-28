import { useMemo, useRef, useState } from 'react';
import {
    Cell,
    Column,
    Row,
    TableBody,
    TableHeader,
    TableView,
    Text,
    View,
    type AriaSelection,
} from '@geti-ai/ui';
import styles from './media-table.module.css';
import { createMediaRenderContext, useFocusOnSelect, useVirtualMediaItems } from '../media-grid/hooks';
import type { MediaGridIdentifiable, MediaGridSelection } from '../media-grid/types';
import type { MediaTableColumn, MediaTableProps, MediaTableRenderContext, MediaTableSortDescriptor } from './types';

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

function defaultThumbnailAlt<T extends MediaGridIdentifiable>(item: T) {
    return `Thumbnail ${String(item.id)}`;
}

function createPlaceholderCell(size: number) {
    return (
        <div className={styles.thumbnailPlaceholder} style={{ width: size, height: size }} aria-hidden="true" />
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
    getThumbnailSrc,
    getThumbnailAlt = defaultThumbnailAlt,
    renderThumbnail,
    sortDescriptor,
    onSortChange,
    density = 'regular',
    overflowMode = 'wrap',
    onItemPress,
    onItemDoublePress,
    className,
    style,
}: MediaTableProps<T>) {
    const [internalSelection, setInternalSelection] = useState<MediaGridSelection>(
        defaultSelectedKeys ? new Set(Array.from(defaultSelectedKeys)) : new Set()
    );

    const isControlledSelection = selectedKeys !== undefined;
    const effectiveSelection = isControlledSelection ? clampSelection(selectedKeys) : internalSelection;
    const effectiveSelectionSet = normalizeSelectionKeys(effectiveSelection);
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

    const rootClassName = [styles.root, className].filter(Boolean).join(' ');

    const tableColumns = useMemo(() => {
        if (hideThumbnailColumn) {
            return columns;
        }

        const hasCustomThumbnailColumn = columns.some((column) => column.key === thumbnailColumnKey);
        if (hasCustomThumbnailColumn) {
            return columns;
        }

        const thumbnailColumn: MediaTableColumn<T> = {
            key: thumbnailColumnKey,
            name: thumbnailColumnHeader,
            renderCell: (context) => {
                if (renderThumbnail) {
                    return renderThumbnail(context);
                }

                if (context.isPlaceholder || !context.item) {
                    return createPlaceholderCell(thumbnailSize);
                }

                const src = getThumbnailSrc?.(context.item);
                const alt = getThumbnailAlt(context.item);
                if (!src) {
                    return createPlaceholderCell(thumbnailSize);
                }

                return (
                    <img
                        className={styles.thumbnail}
                        src={src}
                        alt={alt}
                        width={thumbnailSize}
                        height={thumbnailSize}
                        draggable={false}
                        style={{ minWidth: thumbnailSize, minHeight: thumbnailSize }}
                    />
                );
            },
            textValue: (context) => {
                if (!context.item || context.isPlaceholder) {
                    return 'Loading thumbnail';
                }

                return getThumbnailAlt(context.item);
            },
        };

        return [thumbnailColumn, ...columns];
    }, [
        columns,
        hideThumbnailColumn,
        thumbnailColumnKey,
        thumbnailColumnHeader,
        thumbnailSize,
        getThumbnailSrc,
        getThumbnailAlt,
        renderThumbnail,
    ]);

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
                    onSortChange={(next) => {
                        if (!isMediaTableSortDescriptor(next)) {
                            return;
                        }

                        onSortChange?.(next);
                    }}
                    height="100%"
                    UNSAFE_className={styles.tableView}
                >
                    <TableHeader columns={tableColumns}>
                        {(column) => (
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
                        {(entry) => {
                            const gridContext = createMediaRenderContext({
                                entry,
                                effectiveSelection,
                                effectiveSelectionSet,
                                selectionMode,
                                onItemPress: (context) => onItemPress?.({ ...context, thumbnailSize }),
                                onItemDoublePress: (context) => onItemDoublePress?.({ ...context, thumbnailSize }),
                            });

                            const context: MediaTableRenderContext<T> = {
                                ...gridContext,
                                onPress: (event) => onItemPress?.({ ...gridContext, thumbnailSize }, event),
                                thumbnailSize,
                            };

                            return (
                                <Row key={entry.key} textValue={context.item ? String(context.item.id) : `placeholder-${entry.index}`}>
                                    {(columnKey) => {
                                        const column = tableColumns.find((candidate) => candidate.key === String(columnKey));
                                        if (!column) {
                                            return <Cell>{null}</Cell>;
                                        }

                                        const textValue = column.textValue?.(context);

                                        return (
                                            <Cell textValue={textValue}>
                                                {column.key === thumbnailColumnKey ? (
                                                    <div className={styles.thumbnailCell}>{column.renderCell(context)}</div>
                                                ) : (
                                                    column.renderCell(context)
                                                )}
                                            </Cell>
                                        );
                                    }}
                                </Row>
                            );
                        }}
                    </TableBody>
                </TableView>
            </div>
        </View>
    );
}
