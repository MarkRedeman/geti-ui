import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActionButton,
    Button,
    Flex,
    Menu,
    MenuItem,
    MenuTrigger,
    Picker,
    PickerItem,
    TabItem,
    TabList,
    TabPanels,
    Tabs,
    Text,
    View,
} from '@geti-ai/ui';

type MenuAction = {
    key: string;
    label: string;
};

type MenuTabProps = {
    label: string;
    isActive: boolean;
    actions: MenuAction[];
    onAction: (actionKey: string) => void;
};

function MenuTab({ label, isActive, actions, onAction }: MenuTabProps) {
    return (
        <Flex direction="row" alignItems="center" gap="size-50">
            <Text>{label}</Text>
            {isActive ? (
                <MenuTrigger>
                    <ActionButton isQuiet aria-label={`Actions for ${label}`}>
                        ...
                    </ActionButton>
                    <Menu onAction={(key) => onAction(String(key))}>
                        {actions.map((action) => (
                            <MenuItem key={action.key}>{action.label}</MenuItem>
                        ))}
                    </Menu>
                </MenuTrigger>
            ) : null}
        </Flex>
    );
}

type DatasetTab = {
    id: string;
    name: string;
    images: number;
    updatedAt: string;
};

export interface DatasetTabsBlockProps {
    initialDatasets?: DatasetTab[];
}

type TabsWithOverflowProps<T> = {
    ariaLabel: string;
    items: T[];
    selectedId: string;
    onSelectionChange: (id: string) => void;
    getItemId: (item: T) => string;
    getItemLabel: (item: T) => string;
    renderTab: (item: T, isActive: boolean) => React.ReactNode;
    renderPanel: (item: T) => React.ReactNode;
    overflowAriaLabel?: string;
    addAction?: {
        label: string;
        onPress: () => void;
    };
    estimatedTabWidth?: number;
    reservedWidth?: number;
    minVisibleTabs?: number;
};

function TabsWithOverflow<T>({
    ariaLabel,
    items,
    selectedId,
    onSelectionChange,
    getItemId,
    getItemLabel,
    renderTab,
    renderPanel,
    overflowAriaLabel = 'Collapsed items',
    addAction,
    estimatedTabWidth = 176,
    reservedWidth = 220,
    minVisibleTabs = 2,
}: TabsWithOverflowProps<T>) {
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

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', recomputeVisibleTabs);
            return () => window.removeEventListener('resize', recomputeVisibleTabs);
        }

        const observer = new ResizeObserver(() => recomputeVisibleTabs());
        observer.observe(element);

        return () => observer.disconnect();
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
        <Tabs aria-label={ariaLabel} selectedKey={selectedId} onSelectionChange={(key) => onSelectionChange(String(key))}>
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

                        return <TabItem key={id}>{renderTab(item, selectedId === id)}</TabItem>;
                    })}
                </TabList>

                {collapsedItems.length > 0 ? (
                    <Picker
                        aria-label={overflowAriaLabel}
                        isQuiet
                        placeholder={`${collapsedItems.length} more`}
                        onSelectionChange={(key) => onSelectionChange(String(key))}
                    >
                        {collapsedItems.map((item) => (
                            <PickerItem key={getItemId(item)}>{getItemLabel(item)}</PickerItem>
                        ))}
                    </Picker>
                ) : null}

                {addAction ? (
                    <Button variant="accent" onPress={addAction.onPress}>
                        {addAction.label}
                    </Button>
                ) : null}
            </div>

            <TabPanels>
                {visibleItems.map((item) => (
                    <TabItem key={getItemId(item)}>
                        <View paddingTop="size-150">{renderPanel(item)}</View>
                    </TabItem>
                ))}
            </TabPanels>
        </Tabs>
    );
}

const DATASET_ACTIONS: MenuAction[] = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
    { key: 'export', label: 'Export' },
    { key: 'import', label: 'Import' },
];

const MOCK_DATASETS: DatasetTab[] = [
    { id: 'training', name: 'Training set', images: 1240, updatedAt: '2h ago' },
    { id: 'validation', name: 'Validation set', images: 340, updatedAt: '1d ago' },
    { id: 'testing', name: 'Testing set', images: 510, updatedAt: '3h ago' },
    { id: 'edge-cases', name: 'Edge cases', images: 94, updatedAt: '4d ago' },
    { id: 'night-shift', name: 'Night shift', images: 188, updatedAt: '5d ago' },
    { id: 'drift-watch', name: 'Drift watch', images: 72, updatedAt: '1w ago' },
];

const buildDataset = (index: number): DatasetTab => {
    const datasetNumber = index + 1;

    return {
        id: `dataset-${datasetNumber}`,
        name: `Dataset ${datasetNumber}`,
        images: 100 + datasetNumber * 25,
        updatedAt: 'just now',
    };
};

export function DatasetTabsBlock({ initialDatasets = MOCK_DATASETS }: DatasetTabsBlockProps) {
    const [datasets, setDatasets] = useState(initialDatasets);
    const [selectedId, setSelectedId] = useState(initialDatasets[0]?.id ?? '');
    const [lastAction, setLastAction] = useState('No action yet.');

    const handleAction = (action: string, item: DatasetTab) => {
        if (action === 'delete') {
            if (datasets.length <= 1) {
                setLastAction('Cannot delete the only remaining dataset.');
                return;
            }

            const nextDatasets = datasets.filter((dataset) => dataset.id !== item.id);
            setDatasets(nextDatasets);
            setSelectedId(nextDatasets[0]?.id ?? '');
            setLastAction(`Deleted dataset "${item.name}".`);
            return;
        }

        if (action === 'edit') {
            setDatasets((current) =>
                current.map((dataset) => {
                    if (dataset.id !== item.id || dataset.name.endsWith(' (edited)')) {
                        return dataset;
                    }

                    return {
                        ...dataset,
                        name: `${dataset.name} (edited)`,
                    };
                })
            );
            setLastAction(`Edited dataset "${item.name}".`);
            return;
        }

        setLastAction(`${action} triggered for "${item.name}".`);
    };

    const handleAddDataset = () => {
        const nextDataset = buildDataset(datasets.length);
        setDatasets((current) => [...current, nextDataset]);
        setSelectedId(nextDataset.id);
        setLastAction(`Added dataset "${nextDataset.name}".`);
    };

    return (
        <TabsWithOverflow
            ariaLabel="Datasets"
            items={datasets}
            selectedId={selectedId}
            onSelectionChange={setSelectedId}
            getItemId={(dataset) => dataset.id}
            getItemLabel={(dataset) => dataset.name}
            overflowAriaLabel="Collapsed datasets"
            renderTab={(dataset, isActive) => (
                <MenuTab
                    label={dataset.name}
                    isActive={isActive}
                    actions={DATASET_ACTIONS}
                    onAction={(action) => handleAction(action, dataset)}
                />
            )}
            addAction={{ label: 'Add dataset', onPress: handleAddDataset }}
            estimatedTabWidth={180}
            reservedWidth={230}
            renderPanel={(dataset) => (
                <>
                    <Text>
                        <strong>{dataset.name}</strong>
                    </Text>
                    <Text>{dataset.images} images</Text>
                    <Text>Updated {dataset.updatedAt}</Text>
                    <Text>Last action: {lastAction}</Text>
                </>
            )}
        />
    );
}
