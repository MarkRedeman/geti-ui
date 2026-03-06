// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
    component: Loading,
    title: 'Components/Loading',
    argTypes: {
        mode: {
            control: { type: 'select' },
            options: ['inline', 'fullscreen', 'overlay'],
        },
        size: {
            control: { type: 'select' },
            options: ['S', 'M', 'L'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Loading>;

/**
 * Inline mode renders the spinner centered within its parent container.
 */
export const Inline: Story = {
    args: {
        mode: 'inline',
        size: 'M',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 200, height: 100, border: '1px dashed gray', position: 'relative' }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Overlay mode positions the spinner over its nearest positioned ancestor.
 */
export const Overlay: Story = {
    args: {
        mode: 'overlay',
        style: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 300, height: 200, border: '1px dashed gray', position: 'relative' }}>
                <p style={{ padding: 16 }}>Content underneath</p>
                <Story />
            </div>
        ),
    ],
};

/**
 * Small inline spinner for compact loading indicators.
 */
export const Small: Story = {
    args: {
        mode: 'inline',
        size: 'S',
    },
};

/**
 * Large spinner (default size).
 */
export const Large: Story = {
    args: {
        mode: 'inline',
        size: 'L',
    },
};
