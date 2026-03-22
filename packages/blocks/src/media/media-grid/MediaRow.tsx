import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, VirtualizedHorizontalGrid } from '@geti-ai/ui';
import type { HorizontalLayoutOptions } from '@geti-ai/ui';
import type { Key } from 'react';
import type { Selection } from 'react-aria-components';
import styles from './media-grid.module.css';
import type {
    MediaGridIdentifiable,
    MediaGridRenderContext,
    MediaGridSelection,
    MediaRowProps,
} from './types';

const clampSelection = (value: MediaGridSelection | undefined): MediaGridSelection => value ?? new Set<string>();

function getFirstSelectedKey(selection: MediaGridSelection): string | undefined {
    if (selection === 'all') {
        return undefined;
    }

    return Array.from(selection)[0];
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
    const gridRootRef = useRef<HTMLDivElement | null>(null);

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

    const handleSelectionChange = (keys: Selection) => {
        const typed = keys as MediaGridSelection;
        if (!isControlledSelection) {
            setInternalSelection(typed);
        }
        onSelectionChange?.(typed);
    };

    useEffect(() => {
        if (!focusOnSelect) {
            return;
        }

        const selectedKey = getFirstSelectedKey(effectiveSelection);
        if (!selectedKey) {
            return;
        }

        const options = gridRootRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
        const selectedOption = Array.from(options ?? []).find((node) => node.getAttribute('data-key') === selectedKey);

        selectedOption?.focus({ preventScroll: true });
        selectedOption?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        });
    }, [focusOnSelect, effectiveSelection]);

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

    const layoutOptions: HorizontalLayoutOptions = {
        size: itemSize,
        gap,
        overscan: 2,
    };

    return (
        <View UNSAFE_className={rootClassName} UNSAFE_style={style}>
            <div className={styles.gridContainer} role="region" aria-label={ariaLabel} ref={gridRootRef}>
                <div className={styles.gridInner} style={{ height: itemSize }}>
                    <VirtualizedHorizontalGrid
                        items={items}
                        height="100%"
                        layoutOptions={layoutOptions}
                        ariaLabel={ariaLabel}
                        selectionMode={selectionMode}
                        selectionBehavior="replace"
                        selectedKeys={effectiveSelection}
                        onSelectionChange={handleSelectionChange}
                        onAction={(key: Key) => {
                            const entry = items.find((item) => item.key === String(key));
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
                        idFormatter={(entry: MediaRowVirtualItem<T>) => entry.key}
                        textValueFormatter={(entry: MediaRowVirtualItem<T>) => `Media item ${entry.index + 1}`}
                        listBoxItemStyles={{ height: '100%', minHeight: 0 }}
                        renderItem={(entry: MediaRowVirtualItem<T>) => {
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

                            return <div className={styles.mediaRowItem}>{renderItem(context)}</div>;
                        }}
                    />
                </div>
            </div>
        </View>
    );
}
