import { useEffect, useMemo } from 'react';
import type { RefObject } from 'react';
import type {
    MediaGridIdentifiable,
    MediaGridRenderContext,
    MediaGridSelection,
    MediaGridSelectionMode,
} from './types';

export type VirtualMediaItem<T extends MediaGridIdentifiable> = {
    key: string;
    index: number;
    item: T | undefined;
};

export function useVirtualMediaItems<T extends MediaGridIdentifiable>(
    totalItems: number,
    getItemAt: (index: number) => T | undefined
): VirtualMediaItem<T>[] {
    return useMemo(() => {
        return Array.from({ length: Math.max(0, totalItems) }, (_, index) => {
            const item = getItemAt(index);
            return {
                key: String(item?.id ?? `placeholder-${index}`),
                index,
                item,
            };
        });
    }, [totalItems, getItemAt]);
}

type UseFocusOnSelectOptions = {
    focusOnSelect: boolean;
    selection: MediaGridSelection;
    containerRef: RefObject<HTMLElement | null>;
};

function getFirstSelectedKey(selection: MediaGridSelection): string | undefined {
    if (selection === 'all') {
        return undefined;
    }

    return Array.from(selection)[0];
}

function getSelectedElement(root: HTMLElement, selectedKey: string): HTMLElement | null {
    const keyedNodes = root.querySelectorAll<HTMLElement>('[data-key]');
    const selectedNode = Array.from(keyedNodes).find((node) => node.getAttribute('data-key') === selectedKey);

    return (
        selectedNode?.closest<HTMLElement>('[role="option"]') ??
        selectedNode?.closest<HTMLElement>('[role="gridcell"]') ??
        selectedNode?.closest<HTMLElement>('[role="row"]') ??
        selectedNode ??
        null
    );
}

export function useFocusOnSelect({ focusOnSelect, selection, containerRef }: UseFocusOnSelectOptions) {
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

        const selectedElement = getSelectedElement(root, selectedKey);
        if (!selectedElement) {
            return;
        }

        selectedElement.focus({ preventScroll: true });
        selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        });
    }, [focusOnSelect, selection, containerRef]);
}

type CreateMediaRenderContextOptions<T extends MediaGridIdentifiable> = {
    entry: VirtualMediaItem<T>;
    effectiveSelection: MediaGridSelection;
    effectiveSelectionSet: Set<string>;
    selectionMode: MediaGridSelectionMode;
    onItemPress?: (context: MediaGridRenderContext<T>) => void;
    onItemDoublePress?: (context: MediaGridRenderContext<T>) => void;
};

export function createMediaRenderContext<T extends MediaGridIdentifiable>({
    entry,
    effectiveSelection,
    effectiveSelectionSet,
    selectionMode,
    onItemPress,
    onItemDoublePress,
}: CreateMediaRenderContextOptions<T>): MediaGridRenderContext<T> {
    const isPlaceholder = entry.item === undefined;

    const getIsSelected = () => {
        if (!entry.item || isPlaceholder) {
            return false;
        }

        return effectiveSelection === 'all' || effectiveSelectionSet.has(String(entry.item.id));
    };

    const handlePress = () => {
        if (!entry.item || isPlaceholder) {
            return;
        }

        onItemPress?.({
            item: entry.item,
            index: entry.index,
            isPlaceholder: false,
            isSelected: getIsSelected(),
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
            isSelected: getIsSelected(),
            selectionMode,
            onPress: handlePress,
            onDoublePress: handleDoublePress,
        });
    };

    return {
        item: entry.item,
        index: entry.index,
        isPlaceholder,
        isSelected: getIsSelected(),
        selectionMode,
        onPress: handlePress,
        onDoublePress: handleDoublePress,
    };
}
