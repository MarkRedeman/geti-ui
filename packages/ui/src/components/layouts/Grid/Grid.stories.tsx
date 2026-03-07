// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
    component: Grid,
    title: 'Layouts/Grid',
    argTypes: {
        gap: { control: 'text' },
        columns: { control: 'text' },
        rows: { control: 'text' },
        justifyItems: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'stretch'],
        },
        alignItems: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'stretch', 'baseline'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Grid>;

const cellStyle = {
    background: 'var(--spectrum-global-color-blue-400)',
    padding: '8px 16px',
    textAlign: 'center' as const,
};

/** Default 3-column grid with gap. */
export const Default: Story = {
    args: {
        columns: 'repeat(3, 1fr)',
        gap: 'size-200',
        children: (
            <>
                <div style={cellStyle}>Cell 1</div>
                <div style={cellStyle}>Cell 2</div>
                <div style={cellStyle}>Cell 3</div>
                <div style={cellStyle}>Cell 4</div>
                <div style={cellStyle}>Cell 5</div>
                <div style={cellStyle}>Cell 6</div>
            </>
        ),
    },
};

/** Two-column grid with row gap. */
export const TwoColumn: Story = {
    args: {
        columns: 'repeat(2, 1fr)',
        rows: 'auto',
        gap: 'size-100',
        children: (
            <>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>Alpha</div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>Beta</div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>Gamma</div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>Delta</div>
            </>
        ),
    },
};

/** Grid with centered alignment. */
export const CenteredItems: Story = {
    args: {
        columns: 'repeat(3, size-1600)',
        gap: 'size-200',
        justifyItems: 'center',
        alignItems: 'center',
        children: (
            <>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-purple-400)' }}>A</div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-purple-400)', padding: '24px' }}>
                    B
                </div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-purple-400)' }}>C</div>
            </>
        ),
    },
};
