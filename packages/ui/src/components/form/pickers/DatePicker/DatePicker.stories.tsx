import type { Meta, StoryObj } from '@storybook/react';

import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
    component: DatePicker,
    title: 'Form/Pickers/DatePicker',
    argTypes: {
        isDisabled: { control: 'boolean' },
        isReadOnly: { control: 'boolean' },
        isRequired: { control: 'boolean' },
        label: { control: 'text' },
        description: { control: 'text' },
        errorMessage: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
    args: {
        label: 'Event date',
    },
};

export const WithTime: Story = {
    args: {
        label: 'Event date and time',
        granularity: 'minute',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Event date',
        isDisabled: true,
    },
};
