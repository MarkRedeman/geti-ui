// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarGroup } from '@geti/ui';

const avatarMeta: Meta<typeof Avatar> = {
    tags: ['!dev'],
    component: Avatar,
    title: 'UI/Avatar',
    argTypes: {
        size: {
            control: { type: 'select' },
            options: [
                'avatar-size-50',
                'avatar-size-75',
                'avatar-size-100',
                'avatar-size-200',
                'avatar-size-300',
                'avatar-size-400',
                'avatar-size-500',
                'avatar-size-600',
                'avatar-size-700',
            ],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default avatarMeta;

type AvatarStory = StoryObj<typeof Avatar>;
type AvatarGroupStory = StoryObj<typeof AvatarGroup>;

const PLACEHOLDER_SRC = 'https://i.pravatar.cc/150?img=1';

/** Default avatar at default size. */
export const Default: AvatarStory = {
    args: {
        src: PLACEHOLDER_SRC,
        alt: 'User avatar',
    },
};

/** Small avatar. */
export const Small: AvatarStory = {
    args: {
        src: PLACEHOLDER_SRC,
        alt: 'Small avatar',
        size: 'avatar-size-50',
    },
};

/** Large avatar. */
export const Large: AvatarStory = {
    args: {
        src: PLACEHOLDER_SRC,
        alt: 'Large avatar',
        size: 'avatar-size-700',
    },
};

/** Disabled avatar. */
export const Disabled: AvatarStory = {
    args: {
        src: PLACEHOLDER_SRC,
        alt: 'Disabled avatar',
        isDisabled: true,
    },
};

/** Fallback when no valid image src is provided. */
export const FallbackSrc: AvatarStory = {
    args: {
        // Use a local missing path instead of a non-resolving domain to avoid
        // noisy DNS errors in docs runtime validation while still exercising
        // the broken-image fallback behavior.
        src: '/nonexistent-avatar-image.png',
        alt: 'Broken image avatar',
    },
};

/** Group of avatars with overflow count. */
export const Group: AvatarGroupStory = {
    render: () => (
        <AvatarGroup
            avatars={[
                { src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
                { src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
                { src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
                { src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' },
                { src: 'https://i.pravatar.cc/150?img=5', alt: 'User 5' },
            ]}
            max={3}
        />
    ),
    parameters: {
        docs: {
            source: {
                code: `<AvatarGroup
  avatars={[
    { src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
    { src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
    { src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
    { src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' },
    { src: 'https://i.pravatar.cc/150?img=5', alt: 'User 5' },
  ]}
  max={3}
/>`,
            },
        },
    },
};
