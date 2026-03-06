// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { CardView } from './CardView';

interface SampleItem {
    id: number;
    name: string;
    description: string;
}

const sampleItems: SampleItem[] = [
    { id: 1, name: 'Project Alpha', description: 'Detection · 94% accuracy' },
    { id: 2, name: 'Project Beta', description: 'Classification · 87% accuracy' },
    { id: 3, name: 'Project Gamma', description: 'Segmentation · 91% accuracy' },
    { id: 4, name: 'Project Delta', description: 'Detection · 78% accuracy' },
    { id: 5, name: 'Project Epsilon', description: 'Classification · 96% accuracy' },
    { id: 6, name: 'Project Zeta', description: 'Segmentation · 83% accuracy' },
];

const meta: Meta<typeof CardView<SampleItem>> = {
    component: CardView,
    title: 'Components/CardView',
    argTypes: {
        columns: {
            control: { type: 'number', min: 1, max: 6 },
        },
        gap: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof CardView<SampleItem>>;

/** Default collection of static summary cards. */
export const Default: Story = {
    args: {
        items: sampleItems,
        'aria-label': 'Project collection',
        columns: 3,
        gap: '16px',
        renderCard: (item) => ({
            'aria-label': item.name,
            children: (
                <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                </div>
            ),
        }),
    },
};

/** Collection with selectable interactive cards. */
export const Selectable: Story = {
    args: {
        items: sampleItems.slice(0, 4),
        'aria-label': 'Select a project',
        columns: 2,
        gap: '12px',
        renderCard: (item, index) => ({
            'aria-label': item.name,
            isSelected: index === 0,
            onPress: () => {},
            children: (
                <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                </div>
            ),
        }),
    },
};

/** Two-column card layout. */
export const TwoColumn: Story = {
    args: {
        items: sampleItems.slice(0, 4),
        'aria-label': 'Projects',
        columns: 2,
        gap: '20px',
        renderCard: (item) => ({
            'aria-label': item.name,
            children: (
                <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                </div>
            ),
        }),
    },
};
