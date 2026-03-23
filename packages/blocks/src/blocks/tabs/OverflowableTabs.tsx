import { useMemo, useRef, type CSSProperties, type Key, type ReactNode } from 'react';
import { Picker, PickerItem, TabItem, TabList } from '@geti-ai/ui';
import { useOverflowVisibleTabs } from './useOverflowVisibleTabs';

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
    const tabsSectionRef = useRef<HTMLDivElement | null>(null);
    const collapseSectionRef = useRef<HTMLDivElement | null>(null);
    const trailingSectionRef = useRef<HTMLDivElement | null>(null);
    const activeKey = selectedKey;
    const maxVisibleTabs = useOverflowVisibleTabs({
        containerRef,
        tabsSectionRef,
        collapseSectionRef,
        trailingSectionRef,
        itemCount: items.length,
        minVisibleTabs,
        recalcDeps: [selectedKey, trailingContent],
    });

    const visibleItems = useMemo(() => {
        if (items.length <= maxVisibleTabs) {
            return items;
        }

        const selectedIndex = items.findIndex((item) => getItemId(item) === activeKey);
        if (selectedIndex < 0 || selectedIndex < maxVisibleTabs) {
            return items.slice(0, maxVisibleTabs);
        }

        return [...items.slice(0, maxVisibleTabs - 1), items[selectedIndex]];
    }, [items, maxVisibleTabs, activeKey, getItemId]);

    const collapsedItems = useMemo(() => {
        const visibleIds = new Set(visibleItems.map((item) => getItemId(item)));
        return items.filter((item) => !visibleIds.has(getItemId(item)));
    }, [items, visibleItems, getItemId]);
    const trailingBorderStyle: CSSProperties = {
        borderBottom: 'var(--spectrum-alias-border-size-thick) solid var(--spectrum-global-color-gray-300)',
    };

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '0px',
                width: '100%',
            }}
        >
            <div ref={tabsSectionRef} style={{ flex: '0 0 auto', minWidth: 0 }}>
                <TabList>
                    {visibleItems.map((item) => {
                        const id = getItemId(item);
                        const label = getItemLabel(item);
                        const content = renderTab ? renderTab(item, activeKey === id) : label;

                        return (
                            <TabItem key={id} textValue={label}>
                                {content}
                            </TabItem>
                        );
                    })}
                </TabList>
            </div>

            {collapsedItems.length > 0 ? (
                <div
                    ref={collapseSectionRef}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: '0 0 auto',
                        ...trailingBorderStyle,
                        padding: '0 var(--spectrum-global-dimension-size-200)',
                    }}
                >
                    <Picker
                        aria-label={overflowAriaLabel}
                        isQuiet
                        placeholder={`${collapsedItems.length} more`}
                        onSelectionChange={(key: Key | null) => {
                            if (key === null) {
                                return;
                            }

                            onSelectionChange(String(key));
                        }}
                    >
                        {collapsedItems.map((item) => (
                            <PickerItem key={getItemId(item)}>{getItemLabel(item)}</PickerItem>
                        ))}
                    </Picker>
                </div>
            ) : null}

            {trailingContent ? (
                <div
                    ref={trailingSectionRef}
                    style={{
                        display: 'flex',
                        flex: '1 1 auto',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        ...trailingBorderStyle,
                        ...trailingContentContainerStyle,
                    }}
                >
                    {trailingContent}
                </div>
            ) : null}
        </div>
    );
}
