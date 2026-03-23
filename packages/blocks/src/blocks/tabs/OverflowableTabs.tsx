import { useEffect, useMemo, useRef, useState, type Key, type ReactNode } from 'react';
import { Picker, PickerItem, TabItem, TabList } from '@geti-ai/ui';

export type OverflowableTabsProps<T> = {
    items: T[];
    selectedId: string;
    onSelectionChange: (id: string) => void;
    getItemId: (item: T) => string;
    getItemLabel: (item: T) => string;
    renderTab?: (item: T, isActive: boolean) => ReactNode;
    overflowAriaLabel?: string;
    estimatedTabWidth?: number;
    reservedWidth?: number;
    minVisibleTabs?: number;
    trailingContent?: ReactNode;
};

export function OverflowableTabs<T>({
    items,
    selectedId,
    onSelectionChange,
    getItemId,
    getItemLabel,
    renderTab,
    overflowAriaLabel = 'Collapsed items',
    estimatedTabWidth = 176,
    reservedWidth = 220,
    minVisibleTabs = 2,
    trailingContent,
}: OverflowableTabsProps<T>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [maxVisibleTabs, setMaxVisibleTabs] = useState(4);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return;
        }

        const recomputeVisibleTabs = () => {
            const width = element.getBoundingClientRect().width;
            if (width <= 0) {
                return;
            }

            const availableForTabs = Math.max(width - reservedWidth, estimatedTabWidth);
            const nextVisible = Math.max(minVisibleTabs, Math.floor(availableForTabs / estimatedTabWidth));

            setMaxVisibleTabs(Math.min(items.length, nextVisible));
        };

        recomputeVisibleTabs();

        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(() => recomputeVisibleTabs());
            observer.observe(element);

            return () => observer.disconnect();
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', recomputeVisibleTabs);
            return () => window.removeEventListener('resize', recomputeVisibleTabs);
        }

        return;
    }, [items.length, estimatedTabWidth, reservedWidth, minVisibleTabs]);

    const visibleItems = useMemo(() => {
        if (items.length <= maxVisibleTabs) {
            return items;
        }

        const selectedIndex = items.findIndex((item) => getItemId(item) === selectedId);
        if (selectedIndex < 0 || selectedIndex < maxVisibleTabs) {
            return items.slice(0, maxVisibleTabs);
        }

        return [...items.slice(0, maxVisibleTabs - 1), items[selectedIndex]];
    }, [items, maxVisibleTabs, selectedId, getItemId]);

    const visibleIds = new Set(visibleItems.map((item) => getItemId(item)));
    const collapsedItems = items.filter((item) => !visibleIds.has(getItemId(item)));

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
            }}
        >
            <TabList>
                {visibleItems.map((item) => {
                    const id = getItemId(item);
                    const label = getItemLabel(item);
                    const content = renderTab ? renderTab(item, selectedId === id) : label;

                    return (
                        <TabItem key={id} textValue={label}>
                            {content}
                        </TabItem>
                    );
                })}
            </TabList>

            {collapsedItems.length > 0 ? (
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
            ) : null}

            {trailingContent}
        </div>
    );
}
