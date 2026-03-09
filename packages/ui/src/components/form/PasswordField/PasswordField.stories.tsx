import type { Meta, StoryObj } from '@storybook/react';

import { PasswordField } from '@geti-ai/ui';

const meta: Meta<typeof PasswordField> = {
    tags: ['!dev'],
    component: PasswordField,
    title: 'Form/PasswordField',
    argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
        isNewPassword: { control: 'boolean' },
        error: { control: 'text' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof PasswordField>;

export const Default: Story = {
    args: {
        label: 'Password',
        placeholder: 'Enter your password',
    },
};

export const WithError: Story = {
    args: {
        label: 'Password',
        placeholder: 'Enter your password',
        error: 'Invalid password',
    },
};

export const NewPassword: Story = {
    args: {
        label: 'New Password',
        placeholder: 'Create a password',
        isNewPassword: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Password',
        placeholder: 'Enter your password',
        isDisabled: true,
    },
};
