// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { ActionButton } from './ActionButton';

const meta: Meta<typeof ActionButton> = {
    component: ActionButton,
    title: 'Components/ActionButton',
    argTypes: {
        colorVariant: {
            control: { type: 'select' },
            options: ['dark', 'light', 'blue'],
        },
        children: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof ActionButton>;

export const Default: Story = {
    args: { children: 'Action' },
};

export const Dark: Story = {
    args: { colorVariant: 'dark', children: 'Dark' },
};

export const Light: Story = {
    args: { colorVariant: 'light', children: 'Light' },
};

export const Blue: Story = {
    args: { colorVariant: 'blue', children: 'Blue' },
};

export const Quiet: Story = {
    args: { isQuiet: true, children: 'Quiet' },
};

export const Disabled: Story = {
    args: { isDisabled: true, children: 'Disabled' },
};
