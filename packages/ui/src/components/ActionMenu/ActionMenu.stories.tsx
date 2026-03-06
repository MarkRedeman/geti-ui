// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { Item } from '@adobe/react-spectrum';

import { ActionMenu } from './ActionMenu';

const meta: Meta<typeof ActionMenu> = {
    component: ActionMenu,
    title: 'Components/ActionMenu',
    parameters: {
        a11y: {},
    },
    argTypes: {
        isDisabled: { control: 'boolean' },
        isQuiet: { control: 'boolean' },
        align: {
            control: { type: 'select' },
            options: ['start', 'end'],
        },
        direction: {
            control: { type: 'select' },
            options: ['bottom', 'top', 'left', 'right', 'start', 'end'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {
    render: (args) => (
        <ActionMenu {...args} onAction={(key) => alert(`Selected: ${key}`)}>
            <Item key="edit">Edit</Item>
            <Item key="duplicate">Duplicate</Item>
            <Item key="delete">Delete</Item>
        </ActionMenu>
    ),
};

export const Quiet: Story = {
    render: (args) => (
        <ActionMenu {...args} isQuiet>
            <Item key="cut">Cut</Item>
            <Item key="copy">Copy</Item>
            <Item key="paste">Paste</Item>
        </ActionMenu>
    ),
};

export const Disabled: Story = {
    render: (args) => (
        <ActionMenu {...args} isDisabled>
            <Item key="edit">Edit</Item>
            <Item key="delete">Delete</Item>
        </ActionMenu>
    ),
};

export const WithLabel: Story = {
    render: (args) => (
        <ActionMenu {...args} aria-label="More actions">
            <Item key="share">Share</Item>
            <Item key="export">Export</Item>
            <Item key="print">Print</Item>
        </ActionMenu>
    ),
};
