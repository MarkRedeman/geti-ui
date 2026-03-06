// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { NumberField } from './NumberField';

const meta: Meta<typeof NumberField> = {
    component: NumberField,
    title: 'Components/NumberField',
    argTypes: {
        label: { control: 'text' },
        defaultValue: { control: 'number' },
        minValue: { control: 'number' },
        maxValue: { control: 'number' },
        step: { control: 'number' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
    args: { label: 'Quantity', defaultValue: 0 },
};

export const WithMinMax: Story = {
    args: { label: 'Age', defaultValue: 18, minValue: 0, maxValue: 120 },
};

export const WithStep: Story = {
    args: { label: 'Step by 5', defaultValue: 0, step: 5 },
};

export const Disabled: Story = {
    args: { label: 'Quantity', defaultValue: 10, isDisabled: true },
};
