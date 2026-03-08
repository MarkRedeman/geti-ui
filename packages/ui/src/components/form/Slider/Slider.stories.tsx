// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from '@geti/ui';

const meta: Meta<typeof Slider> = {
    tags: ['!dev'],
    component: Slider,
    title: 'Form/Slider',
    argTypes: {
        label: { control: 'text' },
        defaultValue: { control: { type: 'number' } },
        minValue: { control: { type: 'number' } },
        maxValue: { control: { type: 'number' } },
        step: { control: { type: 'number' } },
        isFilled: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    args: {
        label: 'Opacity',
        defaultValue: 50,
        minValue: 0,
        maxValue: 100,
    },
};

export const Filled: Story = {
    args: {
        label: 'Opacity',
        defaultValue: 50,
        minValue: 0,
        maxValue: 100,
        isFilled: true,
    },
};

export const WithRange: Story = {
    args: {
        label: 'Volume',
        defaultValue: 30,
        minValue: 0,
        maxValue: 200,
        step: 10,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Opacity',
        defaultValue: 50,
        minValue: 0,
        maxValue: 100,
        isDisabled: true,
    },
};
