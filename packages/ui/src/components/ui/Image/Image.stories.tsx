// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Image } from '@geti/ui';

const meta: Meta<typeof Image> = {
    tags: ["!dev"],
    component: Image,
    title: 'UI/Image',
    argTypes: {
        objectFit: {
            control: { type: 'select' },
            options: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        },
        alt: { control: 'text' },
        src: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Image>;

const SAMPLE_IMAGE = 'https://picsum.photos/seed/geti/400/300';

/** Default image display. */
export const Default: Story = {
    args: {
        src: SAMPLE_IMAGE,
        alt: 'Sample landscape image',
        width: 'size-3000',
        height: 'size-2000',
    },
};

/** Image with cover object-fit. */
export const Cover: Story = {
    args: {
        src: SAMPLE_IMAGE,
        alt: 'Image with cover fit',
        objectFit: 'cover',
        width: 'size-3000',
        height: 'size-2000',
    },
};

/** Image with contain object-fit. */
export const Contain: Story = {
    args: {
        src: SAMPLE_IMAGE,
        alt: 'Image with contain fit',
        objectFit: 'contain',
        width: 'size-3000',
        height: 'size-2000',
    },
};

/** Decorative image (empty alt, hidden from screen readers). */
export const Decorative: Story = {
    args: {
        src: SAMPLE_IMAGE,
        alt: '',
        width: 'size-3000',
        height: 'size-2000',
    },
};
