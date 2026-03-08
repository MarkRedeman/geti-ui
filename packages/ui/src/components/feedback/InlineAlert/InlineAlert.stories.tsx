// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Content, Heading } from '@adobe/react-spectrum';
import type { Meta, StoryObj } from '@storybook/react';

import { InlineAlert } from '@geti/ui';

const meta: Meta<typeof InlineAlert> = {
    tags: ["!dev"],
    component: InlineAlert,
    title: 'Feedback/InlineAlert',
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['neutral', 'info', 'positive', 'notice', 'negative'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof InlineAlert>;

/** Neutral inline alert — for general information. */
export const Neutral: Story = {
    args: {
        variant: 'neutral',
        children: (
            <>
                <Heading>Note</Heading>
                <Content>This is a neutral inline alert with some helpful context.</Content>
            </>
        ),
    },
};

/** Info inline alert — for informational messages. */
export const Info: Story = {
    args: {
        variant: 'info',
        children: (
            <>
                <Heading>Information</Heading>
                <Content>Your session will expire in 10 minutes.</Content>
            </>
        ),
    },
};

/** Positive inline alert — for success messages. */
export const Positive: Story = {
    args: {
        variant: 'positive',
        children: (
            <>
                <Heading>Success</Heading>
                <Content>Your changes have been saved successfully.</Content>
            </>
        ),
    },
};

/** Notice inline alert — for warning messages. */
export const Notice: Story = {
    args: {
        variant: 'notice',
        children: (
            <>
                <Heading>Warning</Heading>
                <Content>This action cannot be undone.</Content>
            </>
        ),
    },
};

/** Negative inline alert — for error messages. */
export const Negative: Story = {
    args: {
        variant: 'negative',
        children: (
            <>
                <Heading>Error</Heading>
                <Content>The form contains errors. Please review and try again.</Content>
            </>
        ),
    },
};
