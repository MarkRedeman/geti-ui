// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from '@geti/ui';

const meta: Meta<typeof Skeleton> = {
    tags: ["!dev"],
    component: Skeleton,
    title: 'Feedback/Skeleton',
    argTypes: {
        isCircle: { control: 'boolean' },
        isAspectRatioOne: { control: 'boolean' },
        width: { control: 'text' },
        height: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

/** Rectangle skeleton — for text or card content. */
export const Rectangle: Story = {
    args: {
        width: '100%',
        height: 24,
        'aria-label': 'Loading content',
    },
};

/** Circle skeleton — for avatars or icons. */
export const Circle: Story = {
    args: {
        isCircle: true,
        width: 48,
        height: 48,
        'aria-label': 'Loading avatar',
    },
};

/** Square skeleton with enforced aspect ratio. */
export const Square: Story = {
    args: {
        isAspectRatioOne: true,
        width: 80,
        'aria-label': 'Loading image',
    },
};

/** Multiple skeleton lines simulating a text block. */
export const TextBlock: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 300 }}>
            <Skeleton width="100%" height={16} aria-label="Loading line 1" />
            <Skeleton width="90%" height={16} aria-label="Loading line 2" />
            <Skeleton width="75%" height={16} aria-label="Loading line 3" />
        </div>
    ),
};

/** Card skeleton simulating a media card layout. */
export const Card: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: 300 }}>
            <Skeleton isCircle width={48} height={48} aria-label="Loading avatar" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skeleton width="80%" height={16} aria-label="Loading name" />
                <Skeleton width="60%" height={12} aria-label="Loading subtitle" />
            </div>
        </div>
    ),
};
