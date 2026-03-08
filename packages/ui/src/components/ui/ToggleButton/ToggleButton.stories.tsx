// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { ToggleButton } from '@geti/ui';

const meta: Meta<typeof ToggleButton> = {
    tags: ['!dev'],
    component: ToggleButton,
    title: 'UI/ToggleButton',
    argTypes: {
        isSelected: { control: 'boolean' },
        isEmphasized: { control: 'boolean' },
        isQuiet: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
        children: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
    args: { children: 'Toggle me', defaultSelected: false },
};

export const Selected: Story = {
    args: { defaultSelected: true, children: 'Selected' },
};

export const Emphasized: Story = {
    args: { isEmphasized: true, children: 'Emphasized' },
};

export const Quiet: Story = {
    args: { isQuiet: true, children: 'Quiet' },
};

export const Disabled: Story = {
    args: { isDisabled: true, children: 'Disabled' },
};
