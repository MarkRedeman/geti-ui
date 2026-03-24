import { type CSSProperties, type Key, useState } from 'react';
import { ActionButton, TabItem, TabList, TabPanels, Tabs, Text, View } from '@geti-ai/ui';
import { Add } from '@geti-ai/ui/icons';
import { ManagedTab, type ManagedTabAction } from '../tabs/ManagedTab';

type DatasetTab = {
    id: string;
    name: string;
    images: number;
    updatedAt: string;
};

export interface DatasetTabsBlockProps {
    initialDatasets?: DatasetTab[];
}

const DATASET_ACTIONS: ManagedTabAction[] = [
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
        <Tabs
            aria-label="Datasets"
            selectedKey={selectedId}
            onSelectionChange={(key: Key) => setSelectedId(String(key))}
            UNSAFE_style={
                {
                    '--spectrum-tabs-selection-indicator-color': 'var(--energy-blue)',
                    '--spectrum-tabs-emphasized-selection-indicator-color': 'var(--energy-blue)',
                    '--spectrum-tabs-quiet-emphasized-selection-indicator-color': 'var(--energy-blue)',
                    '--spectrum-tabs-item-gap': '0px',
                } as CSSProperties
            }
        >
            <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
                <div style={{ flex: '0 0 auto', minWidth: 0 }}>
                    <TabList>
                        {datasets.map((dataset) => (
                            <TabItem key={dataset.id} textValue={dataset.name}>
                                <ManagedTab
                                    label={dataset.name}
                                    isSelected={selectedId === dataset.id}
                                    actions={DATASET_ACTIONS}
                                    onAction={(action) => handleAction(action, dataset)}
                                />
                            </TabItem>
                        ))}
                    </TabList>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flex: '1 1 auto',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        borderBottom:
                            'var(--spectrum-alias-border-size-thick) solid var(--spectrum-global-color-gray-300)',
                    }}
                >
                    <ActionButton isQuiet aria-label="Add dataset" onPress={handleAddDataset}>
                        <Add />
                    </ActionButton>
                </div>
            </div>

            <TabPanels>
                {datasets.map((dataset) => (
                    <TabItem key={dataset.id}>
                        <View paddingTop="size-150">
                            <Text>
                                <strong>{dataset.name}</strong>
                            </Text>
                            <Text>{dataset.images} images</Text>
                            <Text>Updated {dataset.updatedAt}</Text>
                            <Text>Last action: {lastAction}</Text>
                        </View>
                    </TabItem>
                ))}
            </TabPanels>
        </Tabs>
    );
}
