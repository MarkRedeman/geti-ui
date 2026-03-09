import type { Meta, StoryObj } from '@storybook/react';

import { RangeSlider } from '@geti-ai/ui';

const meta: Meta<typeof RangeSlider> = {
    tags: ['!dev'],
    component: RangeSlider,
    title: 'Form/RangeSlider',
    argTypes: {
        label: { control: 'text' },
        minValue: { control: 'number' },
        maxValue: { control: 'number' },
        step: { control: 'number' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
    args: { label: 'Price range', defaultValue: { start: 20, end: 80 } },
};

export const WithMinMax: Story = {
    args: { label: 'Range', defaultValue: { start: 25, end: 75 }, minValue: 0, maxValue: 100 },
};

export const WithStep: Story = {
    args: { label: 'Step by 10', defaultValue: { start: 20, end: 80 }, step: 10, minValue: 0, maxValue: 100 },
};

export const Disabled: Story = {
    args: { label: 'Price range', defaultValue: { start: 20, end: 80 }, isDisabled: true },
};
