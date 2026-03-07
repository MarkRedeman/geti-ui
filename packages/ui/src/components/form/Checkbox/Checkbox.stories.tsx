// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    component: Checkbox,
    title: 'Form/Checkbox',
    argTypes: {
        children: { control: 'text' },
        defaultSelected: { control: 'boolean' },
        isIndeterminate: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: { children: 'Accept terms' },
};

export const DefaultSelected: Story = {
    args: { children: 'Selected by default', defaultSelected: true },
};

export const Indeterminate: Story = {
    args: { children: 'Indeterminate state', isIndeterminate: true },
};

export const Disabled: Story = {
    args: { children: 'Disabled', isDisabled: true },
};

export const DisabledSelected: Story = {
    args: { children: 'Disabled selected', isDisabled: true, defaultSelected: true },
};
