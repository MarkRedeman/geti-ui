// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { Markdown, Canvas, Controls } from '@storybook/blocks';

import readme from './readme.md';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    component: Button,
    title: 'UI/Button',
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['accent', 'primary', 'secondary', 'negative'],
        },
        children: { control: 'text' },
    },
    parameters: {
        a11y: {},
        docs: {
            page: () => (
                <>
                    <Markdown>{readme}</Markdown>
                    <Canvas />
                    <Controls />
                </>
            ),
        },
    },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: { children: 'Click me' },
};

export const Primary: Story = {
    args: { variant: 'primary', children: 'Primary' },
};

export const Secondary: Story = {
    args: { variant: 'secondary', children: 'Secondary' },
};

export const Negative: Story = {
    args: { variant: 'negative', children: 'Delete' },
};

export const Disabled: Story = {
    args: { isDisabled: true, children: 'Disabled' },
};
