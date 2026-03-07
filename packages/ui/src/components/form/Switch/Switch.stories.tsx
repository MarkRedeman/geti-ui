// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
    tags: ["!dev"],
    component: Switch,
    title: 'Form/Switch',
    argTypes: {
        children: { control: 'text' },
        defaultSelected: { control: 'boolean' },
        isEmphasized: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    args: { children: 'Toggle feature' },
};

export const Emphasized: Story = {
    args: { children: 'Toggle feature', isEmphasized: true },
};

export const Selected: Story = {
    args: { children: 'Toggle feature', defaultSelected: true },
};

export const Disabled: Story = {
    args: { children: 'Toggle feature', isDisabled: true },
};
