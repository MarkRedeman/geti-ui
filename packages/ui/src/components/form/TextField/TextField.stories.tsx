import type { Meta, StoryObj } from '@storybook/react';

import { TextField } from '@geti-ai/ui';

const meta: Meta<typeof TextField> = {
    tags: ['!dev'],
    component: TextField,
    title: 'Form/TextField',
    argTypes: {
        label: { control: 'text' },
        value: { control: 'text' },
        defaultValue: { control: 'text' },
        description: { control: 'text' },
        errorMessage: { control: 'text' },
        validationState: {
            control: { type: 'select' },
            options: ['valid', 'invalid'],
        },
        isDisabled: { control: 'boolean' },
        isReadOnly: { control: 'boolean' },
        isRequired: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
    args: { label: 'Name', defaultValue: '' },
};

export const WithDescription: Story = {
    args: { label: 'Email', description: 'Enter your email address' },
};

export const WithError: Story = {
    args: { label: 'Username', validationState: 'invalid', errorMessage: 'Username is required' },
};

export const Disabled: Story = {
    args: { label: 'Name', defaultValue: 'John', isDisabled: true },
};

export const ReadOnly: Story = {
    args: { label: 'Name', value: 'Read only value', isReadOnly: true },
};

export const Required: Story = {
    args: { label: 'Name', isRequired: true },
};
