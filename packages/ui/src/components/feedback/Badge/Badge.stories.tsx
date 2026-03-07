// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import Checkmark from '@spectrum-icons/workflow/Checkmark';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
    tags: ["!dev"],
    component: Badge,
    title: 'Feedback/Badge',
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: [
                'neutral',
                'info',
                'positive',
                'negative',
                'indigo',
                'yellow',
                'magenta',
                'fuchsia',
                'purple',
                'seafoam',
            ],
        },
        children: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Badge>;

/** Neutral badge — default styling. */
export const Neutral: Story = {
    args: { variant: 'neutral', children: 'Neutral' },
};

/** Info badge. */
export const Info: Story = {
    args: { variant: 'info', children: 'Info' },
};

/** Positive badge — for success or healthy states. */
export const Positive: Story = {
    args: { variant: 'positive', children: 'Active' },
};

/** Negative badge — for error or failure states. */
export const Negative: Story = {
    args: { variant: 'negative', children: 'Failed' },
};

/** Badge with an icon and a label. */
export const WithIcon: Story = {
    args: {
        variant: 'positive',
        children: (
            <>
                <Checkmark />
                <span>Approved</span>
            </>
        ),
    },
};

/** Badge with only an icon. */
export const IconOnly: Story = {
    args: {
        variant: 'info',
        'aria-label': 'Information',
        children: <Checkmark />,
    },
};
