import { useEffect, useMemo, useRef, useState, type CSSProperties, type Key, type ReactNode } from 'react';
import { Picker, PickerItem, TabItem, TabList } from '@geti-ai/ui';

export type OverflowableTabsProps<T> = {
    items: T[];
    selectedId: string;
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
    selectedId,
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
    const [maxVisibleTabs, setMaxVisibleTabs] = useState(8);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return;
        }

        const recomputeVisibleTabs = () => {
            const containerWidth = element.getBoundingClientRect().width;
            if (containerWidth <= 0) {
                return;
            }

            const tabsSection = tabsSectionRef.current;
            if (!tabsSection) {
                return;
            }

            const tabElements = Array.from(tabsSection.querySelectorAll('[role="tab"]')) as HTMLElement[];
            if (tabElements.length === 0) {
                return;
            }

            const trailingWidth = trailingSectionRef.current?.getBoundingClientRect().width ?? 0;
            const collapseWidth = collapseSectionRef.current?.getBoundingClientRect().width ?? 0;

            const availableWithoutCollapse = Math.max(0, containerWidth - trailingWidth);
            const availableWithCollapse = Math.max(0, containerWidth - trailingWidth - collapseWidth);

            let accumulatedWidth = 0;
            let nextVisible = 0;

            for (const tabElement of tabElements) {
                const tabWidth = tabElement.getBoundingClientRect().width;
                if (tabWidth <= 0) {
                    continue;
                }

                const hasHiddenTabsAfterThis = nextVisible < tabElements.length - 1;
                const maxWidthForThisStep = hasHiddenTabsAfterThis ? availableWithCollapse : availableWithoutCollapse;

                if (accumulatedWidth + tabWidth > maxWidthForThisStep && nextVisible >= minVisibleTabs) {
                    break;
                }

                accumulatedWidth += tabWidth;
                nextVisible += 1;
            }

            const boundedVisible = Math.max(minVisibleTabs, Math.min(items.length, nextVisible));

            setMaxVisibleTabs(boundedVisible);
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
    }, [items.length, minVisibleTabs]);

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
                        const content = renderTab ? renderTab(item, selectedId === id) : label;

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
