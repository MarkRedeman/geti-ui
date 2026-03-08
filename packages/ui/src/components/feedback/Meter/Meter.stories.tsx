// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Meter } from '@geti/ui';

const meta: Meta<typeof Meter> = {
    tags: ["!dev"],
    component: Meter,
    title: 'Feedback/Meter',
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        variant: {
            control: { type: 'select' },
            options: ['informative', 'positive', 'warning', 'critical'],
        },
        label: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Meter>;

/** Default informative meter at 50%. */
export const Default: Story = {
    args: {
        label: 'Storage space',
        value: 50,
    },
};

/** Positive variant indicating a good level. */
export const Positive: Story = {
    args: {
        label: 'Disk health',
        value: 80,
        variant: 'positive',
    },
};

/** Warning variant indicating a cautionary level. */
export const Warning: Story = {
    args: {
        label: 'Memory usage',
        value: 65,
        variant: 'warning',
    },
};

/** Critical variant indicating a dangerous level. */
export const Critical: Story = {
    args: {
        label: 'CPU usage',
        value: 90,
        variant: 'critical',
    },
};

/** Meter with a custom value label. */
export const CustomValueLabel: Story = {
    args: {
        label: 'Models trained',
        value: 7,
        maxValue: 10,
        valueLabel: '7 of 10',
    },
};
