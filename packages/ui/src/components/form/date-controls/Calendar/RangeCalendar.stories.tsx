import type { Meta, StoryObj } from '@storybook/react';

import { RangeCalendar } from '@geti/ui';

const meta: Meta<typeof RangeCalendar> = {
    tags: ["!dev"],
    component: RangeCalendar,
    title: 'Form/Date controls/RangeCalendar',
    argTypes: {
        isDisabled: { control: 'boolean' },
        isReadOnly: { control: 'boolean' },
        visibleMonths: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof RangeCalendar>;

export const Default: Story = {
    args: {
        'aria-label': 'Event range',
    },
};

export const MultiMonth: Story = {
    args: {
        'aria-label': 'Event range',
        visibleMonths: 2,
    },
};

export const Disabled: Story = {
    args: {
        'aria-label': 'Event range',
        isDisabled: true,
    },
};
