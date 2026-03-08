// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Link } from '@geti/ui';

const meta: Meta<typeof Link> = {
    tags: ['!dev'],
    component: Link,
    title: 'Navigation/Link',
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'overBackground'],
        },
        isQuiet: { control: 'boolean' },
        children: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
    args: { children: 'Learn more', href: 'https://example.com' },
};

export const Primary: Story = {
    args: { variant: 'primary', children: 'Primary link', href: 'https://example.com' },
};

export const Secondary: Story = {
    args: { variant: 'secondary', children: 'Secondary link', href: 'https://example.com' },
};

export const Quiet: Story = {
    args: { isQuiet: true, children: 'Quiet link', href: 'https://example.com' },
};

export const OverBackground: Story = {
    args: { variant: 'overBackground', children: 'Over background link', href: 'https://example.com' },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};
