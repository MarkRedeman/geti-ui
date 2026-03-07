import type { Meta, StoryObj } from '@storybook/react';

import { TimeField } from './DateField'; // TimeField is exported from DateField.tsx

const meta: Meta<typeof TimeField> = {
    tags: ["!dev"],
    component: TimeField,
    title: 'Form/Pickers/TimeField',
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
type Story = StoryObj<typeof TimeField>;

export const Default: Story = {
    args: {
        label: 'Event time',
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Meeting time',
        description: 'Please select a time for the meeting.',
    },
};

export const Invalid: Story = {
    args: {
        label: 'Departure time',
        validationState: 'invalid',
        errorMessage: 'Time must be in the future.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Closing time',
        isDisabled: true,
    },
};
