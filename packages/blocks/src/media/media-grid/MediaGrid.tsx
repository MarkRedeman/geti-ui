import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Flex, Text, VirtualizedListLayout, View } from '@geti-ai/ui';
import type { ListLayoutOptions } from 'react-aria-components';
import styles from './media-grid.module.css';
import type { MediaGridProps, MediaGridRenderContext, MediaGridSelection } from './types';

type VirtualizedMediaRow = {
    id: string;
    rowIndex: number;
    startIndex: number;
    endIndex: number;
    itemSize: number;
    gap: number;
    columnCount: number;
};

type MediaGridRowProps<T extends { id: string | number }> = {
    row: VirtualizedMediaRow;
    totalItems: number;
    getItemAt: (index: number) => T | undefined;
    selectionMode: 'none' | 'single' | 'multiple';
    effectiveSelection: MediaGridSelection;
    effectiveSelectionSet: Set<string>;
    toggleKey: (key: string) => void;
    onItemPress?: (context: MediaGridRenderContext<T>) => void;
    onItemDoublePress?: (context: MediaGridRenderContext<T>) => void;
    renderItem: (context: MediaGridRenderContext<T>) => React.ReactNode;
    gap: number;
};

type UseFocusOnSelectOptions = {
    focusOnSelect: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    selection: MediaGridSelection;
};

const clampSelection = (value: MediaGridSelection | undefined): MediaGridSelection => value ?? new Set<string>();

function getColumns(width: number, itemSize: number, gap: number): number {
    if (width <= 0) {
        return 1;
    }

    return Math.max(1, Math.floor((width + gap) / (itemSize + gap)));
}

function getComputedItemWidth(width: number, columnCount: number, gap: number): number {
    if (columnCount <= 0) {
        return width;
    }

    const totalGap = Math.max(0, columnCount - 1) * gap;
    return Math.max(1, (width - totalGap) / columnCount);
}

function normalizeSelectionKeys(selection: MediaGridSelection): Set<string> {
    if (selection === 'all') {
        return new Set<string>();
    }
    return new Set(selection);
}

function getFirstSelectedKey(selection: MediaGridSelection): string | undefined {
    if (selection === 'all') {
        return undefined;
    }

    return Array.from(selection)[0];
}

function useFocusOnSelect({ focusOnSelect, containerRef, selection }: UseFocusOnSelectOptions) {
    useEffect(() => {
        if (!focusOnSelect) {
            return;
        }

        const selectedKey = getFirstSelectedKey(selection);
        if (!selectedKey) {
            return;
        }

        const options = containerRef.current?.querySelectorAll<HTMLElement>('[data-media-item-id]');
        const selectedOption = Array.from(options ?? []).find((node) => node.dataset.mediaItemId === selectedKey);

        selectedOption?.focus({ preventScroll: true });
        selectedOption?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        });
    }, [focusOnSelect, selection, containerRef]);
}

function MediaGridRow<T extends { id: string | number }>({
    row,
    totalItems,
    getItemAt,
    selectionMode,
    effectiveSelection,
    effectiveSelectionSet,
    toggleKey,
    onItemPress,
    onItemDoublePress,
    renderItem,
    gap,
}: MediaGridRowProps<T>) {
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
                    columnGap: gap,
                }}
            >
                {cells.map((index) => {
                    if (index >= totalItems) {
                        return <div key={`empty-${index}`} />;
                    }

                    const item = getItemAt(index);
                    const isPlaceholder = item === undefined;
                    const key = String(item?.id ?? `placeholder-${index}`);
                    const isSelected = !isPlaceholder && (effectiveSelection === 'all' || effectiveSelectionSet.has(String(item.id)));

                    const handlePress = () => {
                        if (isPlaceholder || !item) {
                            return;
                        }

                        const itemId = String(item.id);
                        toggleKey(itemId);

                        onItemPress?.({
                            item,
                            index,
                            isPlaceholder: false,
                            isSelected: effectiveSelection === 'all' || effectiveSelectionSet.has(itemId),
                            selectionMode,
                            onPress: handlePress,
                            onDoublePress: handleDoublePress,
                        });
                    };

                    const handleDoublePress = () => {
                        if (isPlaceholder || !item) {
                            return;
                        }

                        const itemId = String(item.id);
                        onItemDoublePress?.({
                            item,
                            index,
                            isPlaceholder: false,
                            isSelected: effectiveSelection === 'all' || effectiveSelectionSet.has(itemId),
                            selectionMode,
                            onPress: handlePress,
                            onDoublePress: handleDoublePress,
                        });
                    };

                    const context: MediaGridRenderContext<T> = {
                        item,
                        index,
                        isPlaceholder,
                        isSelected,
                        selectionMode,
                        onPress: handlePress,
                        onDoublePress: handleDoublePress,
                    };

                    return (
                        <div
                            className={styles.rowItem}
                            key={key}
                            data-media-item-id={item ? String(item.id) : undefined}
                            tabIndex={item ? -1 : undefined}
                        >
                            {renderItem(context)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function MediaGrid<T extends { id: string | number }>({
    totalItems,
    getItemAt,
    itemSize = 200,
    columns,
    focusOnSelect = false,
    selectionMode = 'multiple',
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
    ariaLabel = 'Media grid',
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

    const explicitColumns = columns ? Math.max(1, Math.floor(columns)) : undefined;
    const columnCount = explicitColumns ?? getColumns(containerWidth, itemSize, gap);
    const computedItemWidth = getComputedItemWidth(containerWidth, columnCount, gap);
    const rowHeight = computedItemWidth;
    const verticalGap = Math.max(0, Math.round(gap / 2));
    const rowCount = Math.ceil(Math.max(0, totalItems) / columnCount);

    useFocusOnSelect({
        focusOnSelect,
        containerRef,
        selection: effectiveSelection,
    });

    const rows = useMemo<VirtualizedMediaRow[]>(() => {
        return Array.from({ length: rowCount }, (_, rowIndex) => {
            const startIndex = rowIndex * columnCount;
            const endIndex = Math.min(totalItems, startIndex + columnCount);

            return {
                id: `row-${rowIndex}`,
                rowIndex,
                startIndex,
                endIndex,
                itemSize: rowHeight,
                gap: verticalGap,
                columnCount,
            };
        });
    }, [rowCount, columnCount, totalItems, rowHeight, verticalGap]);

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

    const listLayout: ListLayoutOptions = useMemo(
        () => ({
            estimatedRowHeight: rowHeight + verticalGap,
            rowHeight: rowHeight + verticalGap,
        }),
        [rowHeight, verticalGap]
    );

    const rootClassName = [styles.root, className].filter(Boolean).join(' ');
    const loadMoreItemsCount = Math.max(1, columnCount * Math.max(1, loadMoreThresholdRows));
    const shouldLoadMore = hasNextPage && loadMoreItemsCount > 0;

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
                        ariaLabel={ariaLabel}
                        idFormatter={(row: VirtualizedMediaRow) => row.id}
                        textValueFormatter={(row: VirtualizedMediaRow) => `Media row ${row.rowIndex + 1}`}
                        renderItem={(row: VirtualizedMediaRow) => (
                            <MediaGridRow
                                row={row}
                                totalItems={totalItems}
                                getItemAt={getItemAt}
                                selectionMode={selectionMode}
                                effectiveSelection={effectiveSelection}
                                effectiveSelectionSet={effectiveSelectionSet}
                                toggleKey={toggleKey}
                                onItemPress={onItemPress}
                                onItemDoublePress={onItemDoublePress}
                                renderItem={renderItem}
                                gap={gap}
                            />
                        )}
                        renderLoading={() => loadingState ?? <Text>Loading more…</Text>}
                        onLoadMore={shouldLoadMore ? onLoadMore : undefined}
                    />
                </div>
            </div>
        </View>
    );
}
