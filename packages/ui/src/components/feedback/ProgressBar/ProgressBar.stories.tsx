// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    component: ProgressBar,
    title: 'Feedback/ProgressBar',
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        minValue: { control: { type: 'number' } },
        maxValue: { control: { type: 'number' } },
        isIndeterminate: { control: 'boolean' },
        label: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

/** Determinate progress bar showing 60% completion. */
export const Determinate: Story = {
    args: {
        label: 'Loading…',
        value: 60,
    },
};

/** Indeterminate progress bar for unknown durations. */
export const Indeterminate: Story = {
    args: {
        label: 'Processing…',
        isIndeterminate: true,
    },
};

/** Progress bar with no visible label (aria-label required for accessibility). */
export const NoLabel: Story = {
    args: {
        'aria-label': 'Uploading file',
        value: 40,
    },
};

/** Progress bar with a custom value label. */
export const CustomValueLabel: Story = {
    args: {
        label: 'Uploading',
        value: 3,
        maxValue: 10,
        valueLabel: '3 of 10 files',
    },
};
