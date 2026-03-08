// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { TextArea } from '@geti/ui';

const meta: Meta<typeof TextArea> = {
    tags: ["!dev"],
    component: TextArea,
    title: 'Form/TextArea',
    argTypes: {
        label: { control: 'text' },
        value: { control: 'text' },
        defaultValue: { control: 'text' },
        description: { control: 'text' },
        isDisabled: { control: 'boolean' },
        isReadOnly: { control: 'boolean' },
        maxLength: { control: 'number' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
    args: { label: 'Description', defaultValue: '' },
};

export const WithDescription: Story = {
    args: { label: 'Bio', description: 'Tell us about yourself' },
};

export const WithMaxLength: Story = {
    args: { label: 'Comment', maxLength: 200, description: 'Max 200 characters' },
};

export const Disabled: Story = {
    args: { label: 'Notes', defaultValue: 'Cannot edit', isDisabled: true },
};

export const ReadOnly: Story = {
    args: { label: 'Notes', value: 'Read only content', isReadOnly: true },
};
