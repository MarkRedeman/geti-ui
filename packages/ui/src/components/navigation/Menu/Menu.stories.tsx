// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from '@adobe/react-spectrum';

import { MenuItem as Item, Menu, MenuTrigger, MenuSection as Section } from '@geti/ui';

const meta: Meta<typeof Menu> = {
    tags: ["!dev"],
    component: Menu,
    title: 'Navigation/Menu',
    parameters: {
        a11y: {},
    },
    argTypes: {
        selectionMode: {
            control: { type: 'select' },
            options: ['none', 'single', 'multiple'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
    render: (args) => (
        <MenuTrigger>
            <ActionButton>Edit</ActionButton>
            <Menu {...args} onAction={(key) => alert(`Selected: ${key}`)}>
                <Item key="cut">Cut</Item>
                <Item key="copy">Copy</Item>
                <Item key="paste">Paste</Item>
                <Item key="delete">Delete</Item>
            </Menu>
        </MenuTrigger>
    ),
};

export const SingleSelect: Story = {
    render: (args) => (
        <MenuTrigger>
            <ActionButton>Sort by</ActionButton>
            <Menu {...args} selectionMode="single" defaultSelectedKeys={['name']}>
                <Item key="name">Name</Item>
                <Item key="date">Date</Item>
                <Item key="size">Size</Item>
                <Item key="type">Type</Item>
            </Menu>
        </MenuTrigger>
    ),
};

export const MultiSelect: Story = {
    render: (args) => (
        <MenuTrigger>
            <ActionButton>Columns</ActionButton>
            <Menu {...args} selectionMode="multiple" defaultSelectedKeys={['name', 'date']}>
                <Item key="name">Name</Item>
                <Item key="date">Date Modified</Item>
                <Item key="size">File Size</Item>
                <Item key="kind">Kind</Item>
            </Menu>
        </MenuTrigger>
    ),
};

export const Sectioned: Story = {
    render: (args) => (
        <MenuTrigger>
            <ActionButton>Actions</ActionButton>
            <Menu {...args}>
                <Section title="Clipboard">
                    <Item key="cut">Cut</Item>
                    <Item key="copy">Copy</Item>
                    <Item key="paste">Paste</Item>
                </Section>
                <Section title="Document">
                    <Item key="bold">Bold</Item>
                    <Item key="italic">Italic</Item>
                    <Item key="underline">Underline</Item>
                </Section>
            </Menu>
        </MenuTrigger>
    ),
};
