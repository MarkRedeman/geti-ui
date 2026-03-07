// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
    component: RadioGroup,
    title: 'Form/RadioGroup',
    argTypes: {
        label: { control: 'text' },
        orientation: {
            control: { type: 'select' },
            options: ['horizontal', 'vertical'],
        },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
    args: { label: 'Favorite pet' },
    render: (args) => (
        <RadioGroup {...args}>
            <Radio value="cats">Cats</Radio>
            <Radio value="dogs">Dogs</Radio>
            <Radio value="other">Other</Radio>
        </RadioGroup>
    ),
};

export const DefaultSelected: Story = {
    args: { label: 'Favorite pet', defaultValue: 'dogs' },
    render: (args) => (
        <RadioGroup {...args}>
            <Radio value="cats">Cats</Radio>
            <Radio value="dogs">Dogs</Radio>
            <Radio value="other">Other</Radio>
        </RadioGroup>
    ),
};

export const Horizontal: Story = {
    args: { label: 'Alignment', orientation: 'horizontal' },
    render: (args) => (
        <RadioGroup {...args}>
            <Radio value="left">Left</Radio>
            <Radio value="center">Center</Radio>
            <Radio value="right">Right</Radio>
        </RadioGroup>
    ),
};

export const Disabled: Story = {
    args: { label: 'Favorite pet', isDisabled: true },
    render: (args) => (
        <RadioGroup {...args}>
            <Radio value="cats">Cats</Radio>
            <Radio value="dogs">Dogs</Radio>
        </RadioGroup>
    ),
};
