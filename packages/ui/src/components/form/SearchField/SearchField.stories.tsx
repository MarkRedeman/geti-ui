// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { SearchField } from '@geti/ui';

const meta: Meta<typeof SearchField> = {
    tags: ["!dev"],
    component: SearchField,
    title: 'Form/SearchField',
    argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
        value: { control: 'text' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
    args: { label: 'Search', placeholder: 'Search...' },
};

export const WithValue: Story = {
    args: { label: 'Search', defaultValue: 'initial query' },
};

export const Disabled: Story = {
    args: { label: 'Search', isDisabled: true },
};

export const WithSubmitHandler: Story = {
    args: {
        label: 'Search',
        placeholder: 'Type and press Enter',
        onSubmit: (value: string) => alert(`Submitted: ${value}`),
    },
};
