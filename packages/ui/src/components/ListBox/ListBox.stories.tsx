// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { ListBox, Item } from './ListBox';

const meta: Meta<typeof ListBox> = {
    component: ListBox,
    title: 'Components/ListBox',
    argTypes: {
        selectionMode: {
            control: { type: 'select' },
            options: ['none', 'single', 'multiple'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof ListBox>;

/** Default list box with no selection. */
export const Default: Story = {
    render: () => (
        <ListBox aria-label="Alignment" width="size-2400">
            <Item key="left">Left</Item>
            <Item key="center">Center</Item>
            <Item key="right">Right</Item>
        </ListBox>
    ),
};

/** List box with single selection mode. */
export const SingleSelection: Story = {
    render: () => (
        <ListBox aria-label="Pick a color" selectionMode="single" width="size-2400">
            <Item key="red">Red</Item>
            <Item key="orange">Orange</Item>
            <Item key="yellow">Yellow</Item>
            <Item key="green">Green</Item>
            <Item key="blue">Blue</Item>
        </ListBox>
    ),
};

/** List box with multiple selection mode. */
export const MultipleSelection: Story = {
    render: () => (
        <ListBox aria-label="Select toppings" selectionMode="multiple" width="size-2400">
            <Item key="cheese">Cheese</Item>
            <Item key="mushrooms">Mushrooms</Item>
            <Item key="olives">Olives</Item>
            <Item key="peppers">Peppers</Item>
            <Item key="onions">Onions</Item>
        </ListBox>
    ),
};
