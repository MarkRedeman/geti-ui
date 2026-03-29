import {
    type ComponentProps,
    type CSSProperties,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
    type Key,
    type ReactNode,
    type Ref,
    type RefObject,
} from 'react';

import { Picker, PickerItem, TabItem, TabList } from '@geti-ui/ui';

function useResizeObserver<T extends Element>(ref: RefObject<T | null>) {
    const [width, setWidth] = useState(0);
    const target = ref.current;

    useLayoutEffect(() => {
        if (!target || typeof ResizeObserver === 'undefined') {
            setWidth(0);
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });

        observer.observe(target);
        return () => observer.disconnect();
    }, [target]);

    return width;
}

type UseOverflowTabsArgs = {
    containerRef: RefObject<HTMLDivElement | null>;
    collapseRef: RefObject<HTMLDivElement | null>;
    trailingRef: RefObject<HTMLDivElement | null>;
    tabRefs: RefObject<(HTMLElement | null)[]>;
    itemCount: number;
    minVisibleTabs: number;
    recomputeDeps?: unknown[];
};

function useOverflowTabs({
    containerRef,
    collapseRef,
    trailingRef,
    tabRefs,
    itemCount,
    minVisibleTabs,
    recomputeDeps = [],
}: UseOverflowTabsArgs) {
    const containerWidth = useResizeObserver(containerRef);
    const collapseWidth = useResizeObserver(collapseRef);
    const trailingWidth = useResizeObserver(trailingRef);

    const [maxVisibleTabs, setMaxVisibleTabs] = useState(itemCount);

    useLayoutEffect(() => {
        const tabs = (tabRefs.current ?? []).filter((tab): tab is HTMLElement => tab !== null);
        if (tabs.length === 0 || containerWidth === 0) return;

        const tabWidths = tabs.map((t) => t.getBoundingClientRect().width);

        const availableWithoutCollapse = Math.max(0, containerWidth - trailingWidth);
        const availableWithCollapse = Math.max(0, containerWidth - trailingWidth - collapseWidth);

        let accumulated = 0;
        let visible = 0;

        for (let i = 0; i < tabWidths.length; i++) {
            const tabWidth = tabWidths[i];

            const hasHiddenAfter = i < tabWidths.length - 1;
            const maxWidth = hasHiddenAfter ? availableWithCollapse : availableWithoutCollapse;

            if (accumulated + tabWidth > maxWidth && visible >= minVisibleTabs) {
                break;
            }

            accumulated += tabWidth;
            visible += 1;
        }

        if (itemCount === 0) {
            setMaxVisibleTabs(0);
            return;
        }

        const bounded = Math.min(itemCount, Math.max(minVisibleTabs, visible));
        setMaxVisibleTabs(bounded);
    }, [containerWidth, collapseWidth, trailingWidth, itemCount, minVisibleTabs, tabRefs, ...recomputeDeps]);

    return maxVisibleTabs;
}

type OverflowPickerProps<T> = {
    items: T[];
    getItemId: (item: T) => string;
    getItemLabel: (item: T) => string;
    onSelectionChange: (id: string) => void;
    ariaLabel: string;
};

function OverflowPicker<T>({ items, getItemId, getItemLabel, onSelectionChange, ariaLabel }: OverflowPickerProps<T>) {
    const handleSelection = useCallback(
        (key: Key | null) => {
            if (key !== null) {
                onSelectionChange(String(key));
            }
        },
        [onSelectionChange]
    );

    return (
        <Picker aria-label={ariaLabel} isQuiet placeholder={`${items.length} more`} onSelectionChange={handleSelection}>
            {items.map((item) => (
                <PickerItem key={getItemId(item)}>{getItemLabel(item)}</PickerItem>
            ))}
        </Picker>
    );
}

export type OverflowableTabsProps<T> = {
    items: T[];
    selectedKey: string;
    onSelectionChange: (id: string) => void;

    getItemId: (item: T) => string;
    getItemLabel: (item: T) => string;

    renderTab?: (item: T, isActive: boolean) => ReactNode;

    overflowAriaLabel?: string;
    minVisibleTabs?: number;

    trailingContent?: ReactNode;
    trailingContentContainerStyle?: CSSProperties;
};

export function OverflowableTabs<T>({
    items,
    selectedKey,
    onSelectionChange,
    getItemId,
    getItemLabel,
    renderTab,
    overflowAriaLabel = 'Collapsed items',
    minVisibleTabs = 2,
    trailingContent,
    trailingContentContainerStyle,
}: OverflowableTabsProps<T>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const collapseRef = useRef<HTMLDivElement | null>(null);
    const trailingRef = useRef<HTMLDivElement | null>(null);

    const tabRefs = useRef<(HTMLElement | null)[]>([]);

    const TabItemWithRef = TabItem as unknown as (
        props: ComponentProps<typeof TabItem> & { ref?: Ref<HTMLElement> }
    ) => ReactNode;

    const registerTab = useCallback((index: number) => {
        return (el: HTMLElement | null) => {
            tabRefs.current[index] = el;
        };
    }, []);

    const tabIdentity = useMemo(() => items.map((item) => getItemId(item)).join('|'), [items, getItemId]);

    const computedMaxVisibleTabs = useOverflowTabs({
        containerRef,
        collapseRef,
        trailingRef,
        tabRefs,
        itemCount: items.length,
        minVisibleTabs,
        recomputeDeps: [selectedKey, tabIdentity, trailingContent],
    });

    const maxVisibleTabs = computedMaxVisibleTabs;

    const { visibleItems, collapsedItems } = useMemo(() => {
        const selectedIndex = items.findIndex((i) => getItemId(i) === selectedKey);

        let visible = items.slice(0, maxVisibleTabs);

        if (selectedIndex >= maxVisibleTabs) {
            visible = [...items.slice(0, maxVisibleTabs - 1), items[selectedIndex]];
        }

        const visibleIds = new Set(visible.map(getItemId));

        return {
            visibleItems: visible,
            collapsedItems: items.filter((i) => !visibleIds.has(getItemId(i))),
        };
    }, [items, maxVisibleTabs, selectedKey, getItemId]);

    const borderStyle: CSSProperties = {
        borderBottom: 'var(--spectrum-alias-border-size-thick) solid var(--spectrum-global-color-gray-300)',
    };

    tabRefs.current.length = visibleItems.length;

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                width: '100%',
                alignItems: 'stretch',
            }}
        >
            <TabList>
                {visibleItems.map((item, index) => {
                    const id = getItemId(item);
                    const label = getItemLabel(item);
                    const content = renderTab ? renderTab(item, selectedKey === id) : label;

                    return (
                        <TabItemWithRef key={id} textValue={label} ref={registerTab(index)}>
                            {content}
                        </TabItemWithRef>
                    );
                })}
            </TabList>

            {collapsedItems.length > 0 && (
                <div
                    ref={collapseRef}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 var(--spectrum-global-dimension-size-200)',
                        ...borderStyle,
                    }}
                >
                    <OverflowPicker
                        items={collapsedItems}
                        getItemId={getItemId}
                        getItemLabel={getItemLabel}
                        onSelectionChange={onSelectionChange}
                        ariaLabel={overflowAriaLabel}
                    />
                </div>
            )}

            {trailingContent && (
                <div
                    ref={trailingRef}
                    style={{
                        display: 'flex',
                        flex: '1 1 auto',
                        alignItems: 'center',
                        ...borderStyle,
                        ...trailingContentContainerStyle,
                    }}
                >
                    {trailingContent}
                </div>
            )}
        </div>
    );
}
