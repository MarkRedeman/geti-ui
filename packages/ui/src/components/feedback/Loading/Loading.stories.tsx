// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Loading } from '@geti/ui';

const meta: Meta<typeof Loading> = {
    tags: ["!dev"],
    component: Loading,
    title: 'Feedback/Loading',
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['spinner', 'intel'],
        },
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
        variant: 'spinner',
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
        variant: 'spinner',
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
        variant: 'spinner',
        mode: 'inline',
        size: 'S',
    },
};

/**
 * Large spinner (default size).
 */
export const Large: Story = {
    args: {
        variant: 'spinner',
        mode: 'inline',
        size: 'L',
    },
};

/**
 * Intel branded loading animation — typically used for full-page loading states.
 * Defaults to size="L" (192px).
 */
export const IntelBranded: Story = {
    args: {
        variant: 'intel',
        mode: 'inline',
        size: 'L',
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    width: 300,
                    height: 300,
                    border: '1px dashed gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Story />
            </div>
        ),
    ],
};

/**
 * Intel branded loading at size S (24px) — suitable for inline/compact contexts.
 */
export const IntelBrandedSmall: Story = {
    args: {
        variant: 'intel',
        mode: 'inline',
        size: 'S',
    },
};

/**
 * Intel branded loading at size M (48px) — medium usage.
 */
export const IntelBrandedMedium: Story = {
    args: {
        variant: 'intel',
        mode: 'inline',
        size: 'M',
    },
};
