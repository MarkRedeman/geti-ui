import { useRef, useState } from 'react';
import { Text, View } from '@geti-ai/ui';
import { InvalidationContext } from '@react-stately/virtualizer';
import {
    type Key,
    Layout,
    LayoutInfo,
    ListBox,
    ListBoxItem,
    Rect,
    type Selection,
    Size,
    Virtualizer,
} from 'react-aria-components';
import styles from './media-grid.module.css';
import type { MediaGridIdentifiable, MediaGridRenderContext, MediaGridSelection, MediaRowProps } from './types';
import { createMediaRenderContext, useFocusOnSelect, useVirtualMediaItems } from './hooks';

type HorizontalLayoutOptions = {
    gap?: number;
    size?: number;
    overscan?: number;
};

const DEFAULT_GAP = 8;
const DEFAULT_SIZE = 100;
const DEFAULT_OVERSCAN = 2;

class MediaRowHorizontalLayout extends Layout {
    protected gap: number;
    protected size: number;
    protected overscan: number;

    constructor(options: HorizontalLayoutOptions = {}) {
        super();
        this.gap = options.gap ?? DEFAULT_GAP;
        this.size = options.size ?? DEFAULT_SIZE;
        this.overscan = options.overscan ?? DEFAULT_OVERSCAN;
    }

    getVisibleLayoutInfos(rect: Rect): LayoutInfo[] {
        if (!this.virtualizer) {
            return [];
        }

        const sizeWithGap = this.size + this.gap;
        const keys = Array.from(this.virtualizer.collection.getKeys());
        const startIndex = Math.max(0, Math.floor(rect.x / sizeWithGap) - this.overscan);
        const endIndex = Math.min(keys.length - 1, Math.ceil(rect.maxX / sizeWithGap) + this.overscan);
        const layoutInfos: LayoutInfo[] = [];

        for (let i = startIndex; i <= endIndex; i += 1) {
            const layoutInfo = this.getLayoutInfo(keys[i]);
            if (layoutInfo) {
                layoutInfos.push(layoutInfo);
            }
        }

        for (const key of this.virtualizer.persistedKeys) {
            const item = this.virtualizer.collection.getItem(key);
            const layoutInfo = this.getLayoutInfo(key);
            const isValid = item?.index !== undefined && layoutInfo;

            if (isValid && item.index < startIndex) {
                layoutInfos.unshift(layoutInfo);
            }
            if (isValid && item.index > endIndex) {
                layoutInfos.push(layoutInfo);
            }
        }

        return layoutInfos;
    }

    getLayoutInfo(key: Key): LayoutInfo | null {
        const node = this.virtualizer?.collection.getItem(key);
        if (!node) {
            return null;
        }

        const sizeWithGap = this.size + this.gap;
        const rect = new Rect(node.index * sizeWithGap, 0, this.size, this.size);

        return new LayoutInfo(node.type, node.key, rect);
    }

    getContentSize(): Size {
        if (!this.virtualizer) {
            return new Size();
        }

        const numItems = this.virtualizer.collection.size;
        const sizeWithGap = this.size + this.gap;
        const contentWidth = Math.max(0, numItems * sizeWithGap - this.gap);

        return new Size(contentWidth, this.size);
    }

    update(invalidationContext: InvalidationContext<HorizontalLayoutOptions>): void {
        this.gap = invalidationContext?.layoutOptions?.gap ?? this.gap;
        this.size = invalidationContext?.layoutOptions?.size ?? this.size;
        this.overscan = invalidationContext?.layoutOptions?.overscan ?? this.overscan;
    }
}

const clampSelection = (value: MediaGridSelection | undefined): MediaGridSelection => value ?? new Set<string>();

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
    const listRef = useRef<HTMLDivElement | null>(null);

    const items = useVirtualMediaItems(totalItems, getItemAt);

    const handleSelectionChange = (keys: Selection) => {
        const typed = keys as MediaGridSelection;
        if (!isControlledSelection) {
            setInternalSelection(typed);
        }
        onSelectionChange?.(typed);
    };

    useFocusOnSelect({
        focusOnSelect,
        selection: effectiveSelection,
        containerRef: listRef,
    });

    const rootClassName = [styles.root, className].filter(Boolean).join(' ');

    if (!isLoading && totalItems === 0) {
        return (
            <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
                <View UNSAFE_className={styles.gridContainer}>
                    <View UNSAFE_className={styles.emptyState}>
                        {emptyState ?? <Text>No media items available</Text>}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
            <div className={styles.gridContainer} role="region" aria-label={ariaLabel} style={{ overflow: 'visible' }}>
                <div className={styles.gridInner} style={{ height: itemSize + 24, overflow: 'visible' }}>
                    <Virtualizer layout={MediaRowHorizontalLayout} layoutOptions={{ size: itemSize, gap, overscan: 2 }}>
                        <ListBox
                            ref={listRef}
                            aria-label={ariaLabel}
                            className={styles.mediaRowListBox}
                            style={{
                                height: itemSize + 16,
                            }}
                            orientation="horizontal"
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
                                    isSelected:
                                        effectiveSelection === 'all' ||
                                        effectiveSelectionSet.has(String(entry.item.id)),
                                    selectionMode,
                                    onPress: () => undefined,
                                    onDoublePress: () => undefined,
                                });
                            }}
                        >
                            {items.map((entry) => {
                                const context: MediaGridRenderContext<T> = createMediaRenderContext({
                                    entry,
                                    effectiveSelection,
                                    effectiveSelectionSet,
                                    selectionMode,
                                    onItemPress,
                                    onItemDoublePress,
                                });

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
