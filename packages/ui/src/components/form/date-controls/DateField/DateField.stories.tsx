import type { Meta, StoryObj } from '@storybook/react';

import { DateField } from '@geti/ui';

const meta: Meta<typeof DateField> = {
    tags: ["!dev"],
    component: DateField,
    title: 'Form/Date controls/DateField',
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        errorMessage: { control: 'text' },
        isDisabled: { control: 'boolean' },
        isRequired: { control: 'boolean' },
        isReadOnly: { control: 'boolean' },
        validationState: {
            control: 'select',
            options: ['valid', 'invalid'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof DateField>;

export const Default: Story = {
    args: {
        label: 'Event date',
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Birth date',
        description: 'Please enter your date of birth.',
    },
};

export const Invalid: Story = {
    args: {
        label: 'Expiration date',
        validationState: 'invalid',
        errorMessage: 'Date must be in the future.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Release date',
        isDisabled: true,
    },
};
