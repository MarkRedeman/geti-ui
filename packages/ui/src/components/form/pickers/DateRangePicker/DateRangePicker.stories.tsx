import type { Meta, StoryObj } from '@storybook/react';

import { DateRangePicker } from './DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
    component: DateRangePicker,
    title: 'Form/Pickers/DateRangePicker',
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
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
    args: {
        label: 'Event range',
    },
};

export const WithTime: Story = {
    args: {
        label: 'Event range and time',
        granularity: 'minute',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Event range',
        isDisabled: true,
    },
};
