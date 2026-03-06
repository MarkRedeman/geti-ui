// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { ComboBox, Item } from './ComboBox';

const meta: Meta<typeof ComboBox> = {
    component: ComboBox,
    title: 'Components/ComboBox',
    argTypes: {
        label: { control: 'text' },
        defaultInputValue: { control: 'text' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {
    args: { label: 'Favorite animal' },
    render: (args) => (
        <ComboBox {...args}>
            <Item key="red-panda">Red Panda</Item>
            <Item key="cat">Cat</Item>
            <Item key="dog">Dog</Item>
            <Item key="aardvark">Aardvark</Item>
        </ComboBox>
    ),
};

export const DefaultSelected: Story = {
    args: { label: 'Favorite animal', defaultSelectedKey: 'cat' },
    render: (args) => (
        <ComboBox {...args}>
            <Item key="red-panda">Red Panda</Item>
            <Item key="cat">Cat</Item>
            <Item key="dog">Dog</Item>
        </ComboBox>
    ),
};

export const DefaultInputValue: Story = {
    args: { label: 'Favorite animal', defaultInputValue: 'Ca' },
    render: (args) => (
        <ComboBox {...args}>
            <Item key="red-panda">Red Panda</Item>
            <Item key="cat">Cat</Item>
            <Item key="dog">Dog</Item>
        </ComboBox>
    ),
};

export const Disabled: Story = {
    args: { label: 'Favorite animal', isDisabled: true },
    render: (args) => (
        <ComboBox {...args}>
            <Item key="cat">Cat</Item>
            <Item key="dog">Dog</Item>
        </ComboBox>
    ),
};
