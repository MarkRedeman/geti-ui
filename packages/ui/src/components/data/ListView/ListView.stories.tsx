// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { ListView, ListItem as Item } from '@geti/ui';

const meta: Meta<typeof ListView> = {
    tags: ["!dev"],
    component: ListView,
    title: 'Data/ListView',
    argTypes: {
        selectionMode: {
            control: { type: 'select' },
            options: ['none', 'single', 'multiple'],
        },
        density: {
            control: { type: 'select' },
            options: ['compact', 'regular', 'spacious'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof ListView>;

/** Default selectable list view. */
export const Default: Story = {
    render: () => (
        <ListView aria-label="List view" selectionMode="single" width="size-3000">
            <Item key="1">Adobe Photoshop</Item>
            <Item key="2">Adobe XD</Item>
            <Item key="3">Adobe Illustrator</Item>
            <Item key="4">Adobe After Effects</Item>
        </ListView>
    ),
};

/** Multi-select list view. */
export const MultiSelect: Story = {
    render: () => (
        <ListView aria-label="Multi-select list" selectionMode="multiple" width="size-3000">
            <Item key="1">Option One</Item>
            <Item key="2">Option Two</Item>
            <Item key="3">Option Three</Item>
        </ListView>
    ),
};

/** Compact density list view. */
export const Compact: Story = {
    render: () => (
        <ListView aria-label="Compact list" density="compact" selectionMode="single" width="size-3000">
            <Item key="1">Compact Item 1</Item>
            <Item key="2">Compact Item 2</Item>
            <Item key="3">Compact Item 3</Item>
        </ListView>
    ),
};

/** Spacious density list view. */
export const Spacious: Story = {
    render: () => (
        <ListView aria-label="Spacious list" density="spacious" selectionMode="single" width="size-3000">
            <Item key="1">Spacious Item 1</Item>
            <Item key="2">Spacious Item 2</Item>
            <Item key="3">Spacious Item 3</Item>
        </ListView>
    ),
};
