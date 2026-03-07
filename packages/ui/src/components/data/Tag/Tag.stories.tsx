// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
    tags: ["!dev"],
    component: Tag,
    title: 'Data/Tag',
    argTypes: {
        text: { control: 'text' },
        withDot: { control: 'boolean' },
        darkMode: { control: 'boolean' },
        tooltip: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Tag>;

/** Default tag with accent dot. */
export const Default: Story = {
    args: { text: 'Label' },
};

/** Tag without the accent dot. */
export const NoDot: Story = {
    args: { text: 'No Dot', withDot: false },
};

/** Tag with a custom prefix element. */
export const WithPrefix: Story = {
    args: {
        text: 'With Prefix',
        prefix: <span style={{ width: 12, height: 12, background: 'currentColor', borderRadius: '50%' }} />,
    },
};

/** Tag with a suffix element. */
export const WithSuffix: Story = {
    args: {
        text: 'With Suffix',
        suffix: <span style={{ fontSize: '0.75rem', marginLeft: 4 }}>✕</span>,
    },
};

/** Tag with a tooltip on hover. */
export const WithTooltip: Story = {
    args: { text: 'Hover me', tooltip: 'This is a tooltip' },
};

/** Tag in dark mode. */
export const DarkMode: Story = {
    args: { text: 'Dark Mode', darkMode: true },
};
