import type { Meta, StoryObj } from '@storybook/react';

import { AvatarGroup } from '@geti-ai/ui';

const meta: Meta<typeof AvatarGroup> = {
    tags: ['!dev'],
    component: AvatarGroup,
    title: 'UI/AvatarGroup',
    parameters: {
        a11y: {},
    },
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

const avatars = [
    { src: 'https://i.pravatar.cc/150?img=11', alt: 'User 1' },
    { src: 'https://i.pravatar.cc/150?img=12', alt: 'User 2' },
    { src: 'https://i.pravatar.cc/150?img=13', alt: 'User 3' },
    { src: 'https://i.pravatar.cc/150?img=14', alt: 'User 4' },
    { src: 'https://i.pravatar.cc/150?img=15', alt: 'User 5' },
];

export const Default: Story = {
    args: {
        avatars,
        max: 3,
    },
};

export const NoOverflow: Story = {
    args: {
        avatars: avatars.slice(0, 3),
        max: 3,
    },
};
