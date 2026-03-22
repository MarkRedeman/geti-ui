import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Text, View } from '@geti-ai/ui';
import { type InvalidationContext } from '@react-stately/virtualizer';
import {
    type Key,
    Layout,
    LayoutInfo,
    ListBox,
    ListBoxItem,
    Rect,
    type Rect as RectType,
    type Selection,
    Size,
    type Size as SizeType,
    Virtualizer,
} from 'react-aria-components';
import styles from './media-grid.module.css';
import type {
    MediaGridIdentifiable,
    MediaGridRenderContext,
    MediaGridSelection,
    MediaRowProps,
} from './types';

type HorizontalRowLayoutOptions = {
    itemSize: number;
    gap: number;
    overscan?: number;
};

class HorizontalRowLayout extends Layout {
    private itemSize = 200;
    private gap = 8;
    private overscan = 2;

    constructor(options: HorizontalRowLayoutOptions = { itemSize: 200, gap: 8 }) {
        super();
        this.itemSize = options.itemSize;
        this.gap = options.gap;
        this.overscan = options.overscan ?? 2;
    }

    getVisibleLayoutInfos(rect: RectType): LayoutInfo[] {
        if (!this.virtualizer) {
            return [];
        }

        const keys = Array.from(this.virtualizer.collection.getKeys());
        if (keys.length === 0) {
            return [];
        }

        const itemStride = this.itemSize + this.gap;
        const startIndex = Math.max(0, Math.floor(rect.x / itemStride) - this.overscan);
        const endIndex = Math.min(keys.length - 1, Math.ceil(rect.maxX / itemStride) + this.overscan);
        const layoutInfos: LayoutInfo[] = [];

        for (let index = startIndex; index <= endIndex; index += 1) {
            const layoutInfo = this.getLayoutInfo(keys[index]);
            if (layoutInfo) {
                layoutInfos.push(layoutInfo);
            }
        }

        for (const persistedKey of this.virtualizer.persistedKeys) {
            const layoutInfo = this.getLayoutInfo(persistedKey);
            if (layoutInfo && !layoutInfos.some((entry) => entry.key === persistedKey)) {
                layoutInfos.push(layoutInfo);
            }
        }

        return layoutInfos;
    }

    getLayoutInfo(key: Key): LayoutInfo | null {
        const node = this.virtualizer?.collection.getItem(key);
        if (!node || node.index == null) {
            return null;
        }

        const x = node.index * (this.itemSize + this.gap);
        return new LayoutInfo(node.type, node.key, new Rect(x, 0, this.itemSize, this.itemSize));
    }

    getContentSize(): SizeType {
        if (!this.virtualizer) {
            return new Size(0, 0);
        }

        const itemStride = this.itemSize + this.gap;
        const width = Math.max(0, this.virtualizer.collection.size * itemStride - this.gap);
        return new Size(width, this.itemSize);
    }

    update(invalidationContext: InvalidationContext<HorizontalRowLayoutOptions>): void {
        this.itemSize = invalidationContext.layoutOptions?.itemSize ?? this.itemSize;
        this.gap = invalidationContext.layoutOptions?.gap ?? this.gap;
        this.overscan = invalidationContext.layoutOptions?.overscan ?? this.overscan;
    }
}

const clampSelection = (value: MediaGridSelection | undefined): MediaGridSelection => value ?? new Set<string>();

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

        const options = containerRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
        const selectedOption = Array.from(options ?? []).find((node) => node.getAttribute('data-key') === selectedKey);

        selectedOption?.focus({ preventScroll: true });
        selectedOption?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        });
    }, [focusOnSelect, selection, containerRef]);
}

type MediaRowVirtualItem<T extends MediaGridIdentifiable> = {
    key: string;
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

    const isControlledSelection = selectedKeys !== undefined;
    const effectiveSelection = isControlledSelection ? clampSelection(selectedKeys) : internalSelection;
    const effectiveSelectionSet = effectiveSelection === 'all' ? new Set<string>() : new Set(effectiveSelection);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const items = useMemo<MediaRowVirtualItem<T>[]>(() => {
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
                <div className={styles.gridInner} style={{ height: itemSize + gap * 2 }}>
                    <Virtualizer layout={new HorizontalRowLayout({ itemSize, gap, overscan: 2 })}>
                        <ListBox
                            aria-label={ariaLabel}
                            className={styles.mediaRowListBox}
                            style={{ display: 'block', padding: 0, height: '100%' }}
                            orientation="horizontal"
                            selectionMode={selectionMode}
                            selectionBehavior="replace"
                            selectedKeys={effectiveSelection}
                            onSelectionChange={handleSelectionChange}
                            onAction={(key: Key) => {
                                const index = items.findIndex((entry) => entry.key === String(key));
                                if (index < 0) {
                                    return;
                                }

                                const entry = items[index];
                                if (!entry.item) {
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
                                    <ListBoxItem
                                        id={entry.key}
                                        key={entry.key}
                                        textValue={`Media item ${entry.index + 1}`}
                                        style={{
                                            width: itemSize,
                                            minWidth: itemSize,
                                            height: itemSize,
                                            minHeight: itemSize,
                                        }}
                                    >
                                        <div className={styles.mediaRowItem}>{renderItem(context)}</div>
                                    </ListBoxItem>
                                );
                            })}
                        </ListBox>
                    </Virtualizer>
                </div>
            </div>
        </View>
    );
}
