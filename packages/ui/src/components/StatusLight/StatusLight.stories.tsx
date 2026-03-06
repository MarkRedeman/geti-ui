// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { StatusLight } from './StatusLight';

const meta: Meta<typeof StatusLight> = {
    component: StatusLight,
    title: 'Components/StatusLight',
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: [
                'neutral',
                'positive',
                'negative',
                'notice',
                'info',
                'celery',
                'chartreuse',
                'yellow',
                'magenta',
                'fuchsia',
                'purple',
                'indigo',
                'seafoam',
            ],
        },
        children: { control: 'text' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof StatusLight>;

/** Neutral status — no semantic meaning. */
export const Neutral: Story = {
    args: { variant: 'neutral', children: 'Neutral' },
};

/** Positive status — indicates a healthy or successful state. */
export const Positive: Story = {
    args: { variant: 'positive', children: 'Active' },
};

/** Negative status — indicates an error or failure state. */
export const Negative: Story = {
    args: { variant: 'negative', children: 'Error' },
};

/** Notice status — indicates a warning or attention-required state. */
export const Notice: Story = {
    args: { variant: 'notice', children: 'Warning' },
};

/** Info status — indicates an informational state. */
export const Info: Story = {
    args: { variant: 'info', children: 'Info' },
};

/** Disabled status light. */
export const Disabled: Story = {
    args: { variant: 'positive', children: 'Disabled', isDisabled: true },
};
