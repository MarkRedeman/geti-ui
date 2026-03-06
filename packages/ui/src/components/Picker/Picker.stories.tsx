// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Item, Picker } from './Picker';

const meta: Meta<typeof Picker> = {
    component: Picker,
    title: 'Components/Picker',
    argTypes: {
        label: { control: 'text' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Picker>;

export const Default: Story = {
    args: { label: 'Choose a framework' },
    render: (args) => (
        <Picker {...args}>
            <Item key="react">React</Item>
            <Item key="vue">Vue</Item>
            <Item key="angular">Angular</Item>
            <Item key="svelte">Svelte</Item>
        </Picker>
    ),
};

export const DefaultSelected: Story = {
    args: { label: 'Choose a framework', defaultSelectedKey: 'react' },
    render: (args) => (
        <Picker {...args}>
            <Item key="react">React</Item>
            <Item key="vue">Vue</Item>
            <Item key="angular">Angular</Item>
        </Picker>
    ),
};

export const Disabled: Story = {
    args: { label: 'Choose a framework', isDisabled: true },
    render: (args) => (
        <Picker {...args}>
            <Item key="react">React</Item>
            <Item key="vue">Vue</Item>
        </Picker>
    ),
};
