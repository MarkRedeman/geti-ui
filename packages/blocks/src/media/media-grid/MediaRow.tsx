import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Text, VirtualizedHorizontalGrid, View } from '@geti-ai/ui';
import type { HorizontalLayoutOptions } from '@geti-ai/ui';
import styles from './media-grid.module.css';
import type {
    MediaGridIdentifiable,
    MediaGridRenderContext,
    MediaGridSelection,
    MediaRowProps,
} from './types';

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

type UseFocusOnSelectOptions = {
    focusOnSelect: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    selection: MediaGridSelection;
};

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

type MediaRowVirtualItem<T extends MediaGridIdentifiable> = {
    id: string;
    index: number;
    item: T | undefined;
};

export function MediaRow<T extends MediaGridIdentifiable>({
    totalItems,
    getItemAt,
    itemSize = 200,
    focusOnSelect = false,
    selectionMode = 'multiple',
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    isLoading = false,
    emptyState,
    ariaLabel = 'Media row',
    renderItem,
    onItemPress,
    onItemDoublePress,
    gap = 8,
    className,
    style,
}: MediaRowProps<T>) {
    const [internalSelection, setInternalSelection] = useState<MediaGridSelection>(
        defaultSelectedKeys ? new Set(Array.from(defaultSelectedKeys)) : new Set()
    );
    const [selectionAnchorIndex, setSelectionAnchorIndex] = useState<number | null>(null);

    const isControlledSelection = selectedKeys !== undefined;
    const effectiveSelection = isControlledSelection ? clampSelection(selectedKeys) : internalSelection;
    const effectiveSelectionSet = normalizeSelectionKeys(effectiveSelection);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const items = useMemo<MediaRowVirtualItem<T>[]>(() => {
        return Array.from({ length: Math.max(0, totalItems) }, (_, index) => {
            const item = getItemAt(index);
            const id = String(item?.id ?? `placeholder-${index}`);
            return { id, index, item };
        });
    }, [totalItems, getItemAt]);

    const handleSelectionChange = (keys: MediaGridSelection) => {
        if (!isControlledSelection) {
            setInternalSelection(keys);
        }
        onSelectionChange?.(keys);
    };

    const toggleKey = (key: string, index: number, shiftKey?: boolean) => {
        if (selectionMode === 'none') {
            return;
        }

        if (selectionMode === 'single') {
            const next = new Set<string>([key]);
            setSelectionAnchorIndex(index);
            handleSelectionChange(next);
            return;
        }

        if (shiftKey && selectionAnchorIndex !== null) {
            const start = Math.min(selectionAnchorIndex, index);
            const end = Math.max(selectionAnchorIndex, index);
            const next = new Set(effectiveSelectionSet);

            for (let currentIndex = start; currentIndex <= end; currentIndex += 1) {
                const currentItem = getItemAt(currentIndex);
                if (currentItem) {
                    next.add(String(currentItem.id));
                }
            }

            handleSelectionChange(next);
            return;
        }

        const next = new Set(effectiveSelectionSet);

        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }

        setSelectionAnchorIndex(index);
        handleSelectionChange(next);
    };

    const layoutOptions: HorizontalLayoutOptions = useMemo(
        () => ({
            size: itemSize,
            gap,
            overscan: 2,
        }),
        [itemSize, gap]
    );

    const rootClassName = [styles.root, className].filter(Boolean).join(' ');

    useFocusOnSelect({
        focusOnSelect,
        containerRef,
        selection: effectiveSelection,
    });

    if (!isLoading && totalItems === 0) {
        return (
            <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
                <View UNSAFE_className={styles.gridContainer}>
                    <View UNSAFE_className={styles.emptyState}>{emptyState ?? <Text>No media items available</Text>}</View>
                </View>
            </View>
        );
    }

    return (
        <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
            <div className={styles.gridContainer} role="region" aria-label={ariaLabel} ref={containerRef}>
                <div className={styles.gridInner} style={{ height: itemSize }}>
                    <VirtualizedHorizontalGrid
                        items={items}
                        height="100%"
                        layoutOptions={layoutOptions}
                        idFormatter={(entry: MediaRowVirtualItem<T>) => `${entry.id}-${entry.index}`}
                        textValueFormatter={(entry: MediaRowVirtualItem<T>) => `Media item ${entry.index + 1}`}
                        renderItem={(entry: MediaRowVirtualItem<T>) => {
                            const isPlaceholder = entry.item === undefined;
                            const itemId = String(entry.item?.id ?? `placeholder-${entry.index}`);
                            const isSelected =
                                !isPlaceholder && (effectiveSelection === 'all' || effectiveSelectionSet.has(String(itemId)));

                            const handlePress = (event?: { shiftKey?: boolean }) => {
                                if (!entry.item || isPlaceholder) {
                                    return;
                                }

                                toggleKey(String(entry.item.id), entry.index, event?.shiftKey);

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

                            const itemDataId = entry.item ? String(entry.item.id) : undefined;

                            return (
                                <div
                                    data-media-item-id={itemDataId}
                                    tabIndex={itemDataId ? -1 : undefined}
                                    style={{
                                        width: itemSize,
                                        height: itemSize,
                                    }}
                                >
                                    {renderItem(context)}
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </View>
    );
}
