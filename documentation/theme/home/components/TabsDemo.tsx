import { useState } from 'react';
import { ManagedTab, OverflowableTabs } from '@geti-ui/blocks';
import type { ManagedTabAction } from '@geti-ui/blocks';
import { ActionButton, Tabs, TabPanels, TabItem, View, Text, Icon } from '@geti-ui/ui';
import { Add } from '@geti-ui/ui/icons';

type TabsDataset = { id: string; name: string; images: number };

const TAB_ACTIONS: ManagedTabAction[] = [
    { key: 'edit', label: 'Edit dataset name' },
    { key: 'delete', label: 'Delete dataset' },
    { key: 'export', label: 'Export dataset' },
];

const initialTabDatasets: TabsDataset[] = [
    { id: 'train', name: 'Training set', images: 1240 },
    { id: 'val', name: 'Validation set', images: 340 },
    { id: 'test', name: 'Testing set', images: 510 },
    { id: 'night', name: 'Night shift', images: 188 },
    { id: 'drift', name: 'Drift watch', images: 72 },
    { id: 'archive', name: 'Archive', images: 3210 },
    { id: 'edge', name: 'Edge cases', images: 94 },
];

const createDataset = (index: number): TabsDataset => ({
    id: `dataset-${index + 1}`,
    name: `Dataset ${index + 1}`,
    images: 100 + (index + 1) * 25,
});

export function TabsDemo() {
    const [datasets, setDatasets] = useState(initialTabDatasets);
    const [selectedId, setSelectedId] = useState(initialTabDatasets[0].id);
    const [lastAction, setLastAction] = useState('No action yet.');

    const onItemAction = (action: string, dataset: TabsDataset) => {
        if (action === 'delete') {
            if (datasets.length <= 1) {
                setLastAction('Cannot delete the only remaining dataset.');
                return;
            }
            const next = datasets.filter((d) => d.id !== dataset.id);
            setDatasets(next);
            setSelectedId(next[0].id);
            setLastAction(`Deleted dataset "${dataset.name}".`);
            return;
        }
        if (action === 'edit') {
            setDatasets((current) =>
                current.map((d) =>
                    d.id === dataset.id && !d.name.endsWith(' (edited)') ? { ...d, name: `${d.name} (edited)` } : d
                )
            );
            setLastAction(`Edited dataset "${dataset.name}".`);
            return;
        }
        setLastAction(`${action} triggered for "${dataset.name}".`);
    };

    const onAddDataset = () => {
        const next = createDataset(datasets.length);
        setDatasets((current) => [...current, next]);
        setSelectedId(next.id);
        setLastAction(`Added dataset "${next.name}".`);
    };

    return (
        <Tabs aria-label="Datasets" selectedKey={selectedId} onSelectionChange={(key) => setSelectedId(String(key))}>
            <OverflowableTabs
                items={datasets}
                selectedKey={selectedId}
                onSelectionChange={setSelectedId}
                getItemId={(d: TabsDataset) => d.id}
                getItemLabel={(d: TabsDataset) => d.name}
                overflowAriaLabel="Collapsed datasets"
                renderTab={(dataset: TabsDataset, isActive: boolean) => (
                    <ManagedTab
                        label={dataset.name}
                        isSelected={isActive}
                        actions={TAB_ACTIONS}
                        onAction={(action: string) => onItemAction(action, dataset)}
                    />
                )}
                trailingContent={
                    <ActionButton isQuiet aria-label="Add dataset" onPress={onAddDataset}>
                        <Icon>
                            <Add />
                        </Icon>
                    </ActionButton>
                }
            />
            <TabPanels>
                {datasets.map((dataset) => (
                    <TabItem key={dataset.id}>
                        <View paddingTop="size-150">
                            <Text>
                                <strong>{dataset.name}</strong>
                            </Text>
                            <Text>{dataset.images} images</Text>
                            <Text>Last action: {lastAction}</Text>
                        </View>
                    </TabItem>
                ))}
            </TabPanels>
        </Tabs>
    );
}
