import type { Meta, StoryObj } from '@storybook/react';

import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
    tags: ["!dev"],
    component: Calendar,
    title: 'Form/Pickers/Calendar',
    argTypes: {
        isDisabled: { control: 'boolean' },
        isReadOnly: { control: 'boolean' },
        visibleMonths: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
    args: {
        'aria-label': 'Event date',
    },
};

export const MultiMonth: Story = {
    args: {
        'aria-label': 'Event date',
        visibleMonths: 2,
    },
};

export const Disabled: Story = {
    args: {
        'aria-label': 'Event date',
        isDisabled: true,
    },
};
