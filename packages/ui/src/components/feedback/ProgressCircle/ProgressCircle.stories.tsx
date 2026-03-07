// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { ProgressCircle } from './ProgressCircle';

const meta: Meta<typeof ProgressCircle> = {
    component: ProgressCircle,
    title: 'Feedback/ProgressCircle',
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        isIndeterminate: { control: 'boolean' },
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

type Story = StoryObj<typeof ProgressCircle>;

/** Determinate progress circle at 60%. */
export const Determinate: Story = {
    args: {
        'aria-label': 'Loading',
        value: 60,
    },
};

/** Indeterminate spinner for unknown durations. */
export const Indeterminate: Story = {
    args: {
        'aria-label': 'Loading',
        isIndeterminate: true,
    },
};

/** Small size spinner. */
export const Small: Story = {
    args: {
        'aria-label': 'Loading',
        isIndeterminate: true,
        size: 'S',
    },
};

/** Medium size spinner (default). */
export const Medium: Story = {
    args: {
        'aria-label': 'Loading',
        isIndeterminate: true,
        size: 'M',
    },
};

/** Large size spinner. */
export const Large: Story = {
    args: {
        'aria-label': 'Loading',
        isIndeterminate: true,
        size: 'L',
    },
};
