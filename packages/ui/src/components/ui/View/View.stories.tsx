// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { View } from '@geti/ui';

const meta: Meta<typeof View> = {
    tags: ['!dev'],
    component: View,
    title: 'UI/View',
    argTypes: {
        backgroundColor: { control: 'text' },
        padding: { control: 'text' },
        borderWidth: {
            control: { type: 'select' },
            options: ['thin', 'thick', 'thicker', 'thickest'],
        },
        borderColor: { control: 'text' },
        borderRadius: {
            control: { type: 'select' },
            options: ['xsmall', 'small', 'medium', 'large'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof View>;

/** Basic View with background color and padding. */
export const Default: Story = {
    args: {
        backgroundColor: 'gray-100',
        padding: 'size-200',
        children: <span>Default View content</span>,
    },
};

/** View with padding and a border. */
export const WithBorder: Story = {
    args: {
        backgroundColor: 'gray-75',
        padding: 'size-300',
        borderWidth: 'thin',
        borderColor: 'dark',
        borderRadius: 'medium',
        children: <span>View with border</span>,
    },
};

/** View with custom dimensions. */
export const CustomSize: Story = {
    args: {
        backgroundColor: 'blue-100',
        padding: 'size-400',
        width: 'size-3600',
        height: 'size-1200',
        children: <span>Custom-sized View</span>,
    },
};
