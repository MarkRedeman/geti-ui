import { useEffect, useMemo, useRef, useState } from 'react';
import { Flex, Text, VirtualizedListLayout, View } from '@geti-ai/ui';
import type { ListLayoutOptions } from 'react-aria-components';
import styles from './media-grid.module.css';
import type { MediaGridProps, MediaGridRenderContext, MediaGridSelection } from './types';

interface VirtualizedMediaRow {
    id: string;
    rowIndex: number;
    startIndex: number;
    endIndex: number;
    itemSize: number;
    gap: number;
    columnCount: number;
}

const clampSelection = (value: MediaGridSelection | undefined): MediaGridSelection => value ?? new Set<string>();

function getColumns(width: number, itemSize: number, gap: number): number {
    if (width <= 0) {
        return 1;
    }

    return Math.max(1, Math.floor((width + gap) / (itemSize + gap)));
}

function normalizeSelectionKeys(selection: MediaGridSelection): Set<string> {
    if (selection === 'all') {
        return new Set<string>();
    }
    return new Set(selection);
}

export function MediaGrid<T extends { id: string | number }>({
    totalItems,
    getItemAt,
    itemSize = 200,
    selectionMode = 'none',
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    hasNextPage = false,
    isLoadingMore = false,
    onLoadMore,
    loadMoreThresholdRows = 2,
    isLoading = false,
    emptyState,
    loadingState,
    renderItem,
    onItemPress,
    onItemDoublePress,
    gap = 8,
    className,
    style,
}: MediaGridProps<T>) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [internalSelection, setInternalSelection] = useState<MediaGridSelection>(
        defaultSelectedKeys ? new Set(Array.from(defaultSelectedKeys)) : new Set()
    );

    const isControlledSelection = selectedKeys !== undefined;
    const effectiveSelection = isControlledSelection ? clampSelection(selectedKeys) : internalSelection;
    const effectiveSelectionSet = normalizeSelectionKeys(effectiveSelection);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width ?? 0;
            setContainerWidth(width);
        });

        observer.observe(node);
        setContainerWidth(node.getBoundingClientRect().width);

        return () => observer.disconnect();
    }, []);

    const columnCount = getColumns(containerWidth, itemSize, gap);
    const rowCount = Math.ceil(Math.max(0, totalItems) / columnCount);

    const rows = useMemo<VirtualizedMediaRow[]>(() => {
        return Array.from({ length: rowCount }, (_, rowIndex) => {
            const startIndex = rowIndex * columnCount;
            const endIndex = Math.min(totalItems, startIndex + columnCount);

            return {
                id: `row-${rowIndex}`,
                rowIndex,
                startIndex,
                endIndex,
                itemSize,
                gap,
                columnCount,
            };
        });
    }, [rowCount, columnCount, totalItems, itemSize, gap]);

    const loadedItemsCount = useMemo(() => {
        let loaded = 0;
        for (let index = 0; index < totalItems; index += 1) {
            if (getItemAt(index) !== undefined) {
                loaded += 1;
            }
        }
        return loaded;
    }, [getItemAt, totalItems]);

    const handleSelectionChange = (keys: MediaGridSelection) => {
        if (!isControlledSelection) {
            setInternalSelection(keys);
        }
        onSelectionChange?.(keys);
    };

    const toggleKey = (key: string) => {
        if (selectionMode === 'none') {
            return;
        }

        const next = new Set(effectiveSelectionSet);

        if (selectionMode === 'single') {
            if (next.has(key)) {
                next.clear();
            } else {
                next.clear();
                next.add(key);
            }
        } else {
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
        }

        handleSelectionChange(next);
    };

    const maybeLoadMore = (lastVisibleIndex: number) => {
        if (!onLoadMore || !hasNextPage || isLoadingMore) {
            return;
        }

        const thresholdItems = columnCount * loadMoreThresholdRows;
        const shouldLoad = lastVisibleIndex >= Math.max(0, totalItems - thresholdItems);

        if (shouldLoad) {
            onLoadMore();
        }
    };

    const renderRow = (row: VirtualizedMediaRow) => {
        maybeLoadMore(row.endIndex - 1);

        const cells = Array.from({ length: row.columnCount }, (_, offset) => row.startIndex + offset);

        return (
            <div
                className={styles.row}
                style={{
                    height: row.itemSize,
                    paddingBottom: row.gap,
                }}
            >
                <div
                    className={styles.rowItems}
                    style={{
                        gridTemplateColumns: `repeat(${row.columnCount}, minmax(0, 1fr))`,
                        gap: row.gap,
                    }}
                >
                    {cells.map((index) => {
                        if (index >= totalItems) {
                            return <div key={`empty-${index}`} />;
                        }

                        const item = getItemAt(index);
                        const isPlaceholder = item === undefined;
                        const key = String(item?.id ?? `placeholder-${index}`);
                        const isSelected = !isPlaceholder && effectiveSelectionSet.has(String(item.id));

                        const context: MediaGridRenderContext<T> = {
                            item,
                            index,
                            isPlaceholder,
                            isSelected,
                            selectionMode,
                            onPress: () => {
                                if (!isPlaceholder) {
                                    toggleKey(String(item.id));
                                    onItemPress?.(context);
                                }
                            },
                            onDoublePress: () => {
                                if (!isPlaceholder) {
                                    onItemDoublePress?.(context);
                                }
                            },
                        };

                        return (
                            <div className={styles.rowItem} key={key}>
                                {renderItem(context)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const listLayout: ListLayoutOptions = useMemo(
        () => ({
            estimatedRowHeight: itemSize + gap,
            rowHeight: itemSize + gap,
        }),
        [itemSize, gap]
    );

    const rootClassName = [styles.root, className].filter(Boolean).join(' ');

    if (!isLoading && totalItems === 0) {
        return (
            <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
                <Flex alignItems="center" justifyContent="center" UNSAFE_className={styles.emptyState}>
                    {emptyState ?? <Text>No media items available</Text>}
                </Flex>
            </View>
        );
    }

    return (
        <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
            <div className={styles.gridContainer} ref={containerRef}>
                <div className={styles.gridInner}>
                    <VirtualizedListLayout
                        items={rows}
                        isLoading={isLoadingMore}
                        layoutOptions={listLayout}
                        containerHeight="100%"
                        ariaLabel="Media grid"
                        idFormatter={(row) => row.id}
                        textValueFormatter={(row) => `Media row ${row.rowIndex + 1}`}
                        renderItem={renderRow}
                        renderLoading={() => loadingState ?? <Text>Loading more…</Text>}
                        onLoadMore={onLoadMore}
                    />
                </div>
            </div>

            {selectionMode !== 'none' ? (
                <Text>
                    {effectiveSelection === 'all'
                        ? `Selected all ${totalItems} items`
                        : `Selected ${effectiveSelectionSet.size} of ${loadedItemsCount} loaded items`}
                </Text>
            ) : null}
        </View>
    );
}
