// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Flex } from './Flex';

const meta: Meta<typeof Flex> = {
    component: Flex,
    title: 'Components/Layout/Flex',
    argTypes: {
        direction: {
            control: { type: 'select' },
            options: ['row', 'column', 'row-reverse', 'column-reverse'],
        },
        gap: { control: 'text' },
        alignItems: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'stretch', 'baseline'],
        },
        justifyContent: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'],
        },
        wrap: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Flex>;

/** Default horizontal flex row with gap. */
export const Default: Story = {
    args: {
        direction: 'row',
        gap: 'size-200',
        children: (
            <>
                <div style={{ background: 'var(--spectrum-global-color-blue-400)', padding: '8px 16px' }}>Item 1</div>
                <div style={{ background: 'var(--spectrum-global-color-blue-400)', padding: '8px 16px' }}>Item 2</div>
                <div style={{ background: 'var(--spectrum-global-color-blue-400)', padding: '8px 16px' }}>Item 3</div>
            </>
        ),
    },
};

/** Vertical column layout. */
export const Column: Story = {
    args: {
        direction: 'column',
        gap: 'size-100',
        children: (
            <>
                <div style={{ background: 'var(--spectrum-global-color-green-400)', padding: '8px 16px' }}>Row A</div>
                <div style={{ background: 'var(--spectrum-global-color-green-400)', padding: '8px 16px' }}>Row B</div>
                <div style={{ background: 'var(--spectrum-global-color-green-400)', padding: '8px 16px' }}>Row C</div>
            </>
        ),
    },
};

/** Centered alignment with even spacing. */
export const Centered: Story = {
    args: {
        direction: 'row',
        gap: 'size-200',
        alignItems: 'center',
        justifyContent: 'center',
        children: (
            <>
                <div style={{ background: 'var(--spectrum-global-color-magenta-400)', padding: '4px 12px' }}>Small</div>
                <div style={{ background: 'var(--spectrum-global-color-magenta-400)', padding: '16px 12px' }}>Tall</div>
                <div style={{ background: 'var(--spectrum-global-color-magenta-400)', padding: '4px 12px' }}>Small</div>
            </>
        ),
    },
};

/** Wrapping flex layout. */
export const Wrap: Story = {
    args: {
        direction: 'row',
        gap: 'size-150',
        wrap: true,
        width: 'size-3600',
        children: (
            <>
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} style={{ background: 'var(--spectrum-global-color-purple-400)', padding: '8px 16px' }}>
                        Box {i + 1}
                    </div>
                ))}
            </>
        ),
    },
};
