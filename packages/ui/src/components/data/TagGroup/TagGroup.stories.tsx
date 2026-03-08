// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { TagGroup, TagItem as Item } from '@geti/ui';

const meta: Meta<typeof TagGroup> = {
    tags: ['!dev'],
    component: TagGroup,
    title: 'Data/TagGroup',
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof TagGroup>;

/** Default tag group. */
export const Default: Story = {
    render: () => (
        <TagGroup aria-label="Static TagGroup items example">
            <Item key="news">News</Item>
            <Item key="travel">Travel</Item>
            <Item key="gaming">Gaming</Item>
            <Item key="shopping">Shopping</Item>
        </TagGroup>
    ),
};

/** Removable tag group — user can dismiss individual tags. */
export const Removable: Story = {
    render: () => (
        <TagGroup
            aria-label="Removable tags"
            onRemove={(keys) => {
                console.log('Removed keys:', keys);
            }}
        >
            <Item key="chocolate">Chocolate</Item>
            <Item key="vanilla">Vanilla</Item>
            <Item key="strawberry">Strawberry</Item>
            <Item key="mint">Mint Chip</Item>
        </TagGroup>
    ),
};

/** Tag group with a label. */
export const WithLabel: Story = {
    render: () => (
        <TagGroup label="Categories">
            <Item key="design">Design</Item>
            <Item key="development">Development</Item>
            <Item key="marketing">Marketing</Item>
        </TagGroup>
    ),
};
