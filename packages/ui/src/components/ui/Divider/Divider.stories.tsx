// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Divider } from '@geti/ui';

const meta: Meta<typeof Divider> = {
    tags: ["!dev"],
    component: Divider,
    title: 'UI/Divider',
    argTypes: {
        orientation: {
            control: { type: 'select' },
            options: ['horizontal', 'vertical'],
        },
        size: {
            control: { type: 'select' },
            options: ['S', 'M', 'L'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Divider>;

/** Horizontal divider (default). */
export const Horizontal: Story = {
    args: {
        orientation: 'horizontal',
        size: 'M',
    },
};

/** Small horizontal divider. */
export const Small: Story = {
    args: {
        orientation: 'horizontal',
        size: 'S',
    },
};

/** Large horizontal divider. */
export const Large: Story = {
    args: {
        orientation: 'horizontal',
        size: 'L',
    },
};

/** Vertical divider for use within a flex row. */
export const Vertical: Story = {
    decorators: [
        (Story) => (
            <div style={{ display: 'flex', height: '60px', alignItems: 'stretch', gap: '16px' }}>
                <span>Left</span>
                <Story />
                <span>Right</span>
            </div>
        ),
    ],
    args: {
        orientation: 'vertical',
        size: 'M',
    },
};
