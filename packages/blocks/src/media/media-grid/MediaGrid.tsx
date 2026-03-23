import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Flex, Text, View } from '@geti-ai/ui';
import {
    GridLayout,
    GridList,
    GridListItem,
    type Key,
    type Selection,
    Size,
    Virtualizer,
} from 'react-aria-components';
import styles from './media-grid.module.css';
import type { MediaGridIdentifiable, MediaGridProps, MediaGridRenderContext, MediaGridSelection } from './types';

type GridVirtualItem<T extends MediaGridIdentifiable> = {
    key: string;
    index: number;
    item: T | undefined;
};

type UseFocusOnSelectOptions = {
    focusOnSelect: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    selection: MediaGridSelection;
};

const clampSelection = (value: MediaGridSelection | undefined): MediaGridSelection => value ?? new Set<string>();

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

        const root = containerRef.current;
        if (!root) {
            return;
        }

        const keyedNodes = root.querySelectorAll<HTMLElement>('[data-key]');
        const selectedNode = Array.from(keyedNodes).find((node) => node.getAttribute('data-key') === selectedKey);

        const selectedOption =
            selectedNode?.closest<HTMLElement>('[role="gridcell"]') ??
            selectedNode?.closest<HTMLElement>('[role="row"]') ??
            selectedNode;

        if (!selectedOption) {
            return;
        }

        selectedOption?.focus({ preventScroll: true });
        selectedOption?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        });
    }, [focusOnSelect, selection, containerRef]);
}

function getColumns(width: number, itemSize: number, gap: number): number {
    if (width <= 0) {
        return 1;
    }

    return Math.max(1, Math.floor((width + gap) / (itemSize + gap)));
}

export function MediaGrid<T extends MediaGridIdentifiable>({
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
    const effectiveGap = Math.min(Math.max(0, gap), 4);

    const [containerWidth, setContainerWidth] = useState(0);
    const [internalSelection, setInternalSelection] = useState<MediaGridSelection>(
        defaultSelectedKeys ? new Set(Array.from(defaultSelectedKeys)) : new Set()
    );

    const isControlledSelection = selectedKeys !== undefined;
    const effectiveSelection = isControlledSelection ? clampSelection(selectedKeys) : internalSelection;
    const effectiveSelectionSet = normalizeSelectionKeys(effectiveSelection);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const loadMorePendingRef = useRef(false);

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

    useEffect(() => {
        if (!isLoadingMore) {
            loadMorePendingRef.current = false;
        }
    }, [isLoadingMore]);

    const columnCount = useMemo(() => {
        const explicitColumns = columns ? Math.max(1, Math.floor(columns)) : undefined;
        return explicitColumns ?? getColumns(containerWidth, itemSize, effectiveGap);
    }, [columns, containerWidth, itemSize, effectiveGap]);

    const items = useMemo<GridVirtualItem<T>[]>(() => {
        return Array.from({ length: Math.max(0, totalItems) }, (_, index) => {
            const item = getItemAt(index);
            return {
                key: String(item?.id ?? `placeholder-${index}`),
                index,
                item,
            };
        });
    }, [totalItems, getItemAt]);

    useFocusOnSelect({
        focusOnSelect,
        containerRef,
        selection: effectiveSelection,
    });

    const handleSelectionChange = (keys: Selection) => {
        const typed = keys as MediaGridSelection;
        if (!isControlledSelection) {
            setInternalSelection(typed);
        }
        onSelectionChange?.(typed);
    };

    const rootClassName = [styles.root, className].filter(Boolean).join(' ');
    const shouldLoadMore = hasNextPage && loadMoreThresholdRows > 0;

    useEffect(() => {
        if (!shouldLoadMore || !onLoadMore) {
            return;
        }

        const scrollRoot = containerRef.current?.querySelector<HTMLElement>('[role="grid"]');
        const target = loadMoreRef.current;

        if (!scrollRoot || !target) {
            return;
        }

        const preloadDistance = Math.max(0, loadMoreThresholdRows) * (itemSize + effectiveGap);
        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries.some((entry) => entry.isIntersecting);
                if (!isVisible || isLoadingMore || loadMorePendingRef.current) {
                    return;
                }

                loadMorePendingRef.current = true;
                onLoadMore();
            },
            {
                root: scrollRoot,
                rootMargin: `0px 0px ${preloadDistance}px 0px`,
                threshold: 0,
            }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [shouldLoadMore, onLoadMore, isLoadingMore, loadMoreThresholdRows, itemSize, effectiveGap]);

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
                    <Virtualizer
                        layout={GridLayout}
                        layoutOptions={{
                            minItemSize: new Size(itemSize, itemSize),
                            minSpace: new Size(effectiveGap, effectiveGap),
                            maxColumns: columnCount,
                        }}
                    >
                        <GridList
                            aria-label={ariaLabel}
                            className={styles.gridListBox}
                            style={{ display: 'block', padding: 0, height: '100%', width: '100%' }}
                            layout="grid"
                            selectionMode={selectionMode}
                            selectionBehavior="replace"
                            selectedKeys={effectiveSelection}
                            onSelectionChange={handleSelectionChange}
                            onAction={(key: Key) => {
                                const entry = items.find((itemEntry) => itemEntry.key === String(key));
                                if (!entry?.item) {
                                    return;
                                }

                                onItemPress?.({
                                    item: entry.item,
                                    index: entry.index,
                                    isPlaceholder: false,
                                    isSelected: effectiveSelection === 'all' || effectiveSelectionSet.has(String(entry.item.id)),
                                    selectionMode,
                                    onPress: () => undefined,
                                    onDoublePress: () => undefined,
                                });
                            }}
                        >
                            {items.map((entry) => {
                                const isPlaceholder = entry.item === undefined;
                                const isSelected =
                                    !isPlaceholder &&
                                    (effectiveSelection === 'all' || effectiveSelectionSet.has(String(entry.item?.id ?? '')));

                                const handlePress = () => {
                                    if (!entry.item || isPlaceholder) {
                                        return;
                                    }

                                    onItemPress?.({
                                        item: entry.item,
                                        index: entry.index,
                                        isPlaceholder: false,
                                        isSelected: effectiveSelection === 'all' || effectiveSelectionSet.has(String(entry.item.id)),
                                        selectionMode,
                                        onPress: handlePress,
                                        onDoublePress: handleDoublePress,
                                    });
                                };

                                const handleDoublePress = () => {
                                    if (!entry.item || isPlaceholder) {
                                        return;
                                    }

                                    onItemDoublePress?.({
                                        item: entry.item,
                                        index: entry.index,
                                        isPlaceholder: false,
                                        isSelected: effectiveSelection === 'all' || effectiveSelectionSet.has(String(entry.item.id)),
                                        selectionMode,
                                        onPress: handlePress,
                                        onDoublePress: handleDoublePress,
                                    });
                                };

                                const context: MediaGridRenderContext<T> = {
                                    item: entry.item,
                                    index: entry.index,
                                    isPlaceholder,
                                    isSelected,
                                    selectionMode,
                                    onPress: handlePress,
                                    onDoublePress: handleDoublePress,
                                };

                                return (
                                    <GridListItem
                                        id={entry.key}
                                        key={entry.key}
                                        textValue={`Media item ${entry.index + 1}`}
                                        style={{ height: '100%' }}
                                    >
                                        <div className={styles.mediaGridCell}>{renderItem(context)}</div>
                                    </GridListItem>
                                );
                            })}
                        </GridList>
                    </Virtualizer>
                    {shouldLoadMore ? <div ref={loadMoreRef} style={{ height: 1 }} /> : null}
                    {isLoadingMore && shouldLoadMore ? (
                        <div style={{ paddingTop: 8 }}>{loadingState ?? <Text>Loading more…</Text>}</div>
                    ) : null}
                </div>
            </div>
        </View>
    );
}
