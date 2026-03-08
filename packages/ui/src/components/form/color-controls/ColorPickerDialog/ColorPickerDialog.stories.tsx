import type { Meta, StoryObj } from '@storybook/react';

import { ColorPickerDialog } from '@geti/ui';

const meta: Meta<typeof ColorPickerDialog> = {
    tags: ["!dev"],
    component: ColorPickerDialog,
    title: 'Form/Color controls/ColorPickerDialog',
    argTypes: {
        label: { control: 'text' },
        onColorChange: { action: 'onColorChange' },
    },
};

export default meta;
type Story = StoryObj<typeof ColorPickerDialog>;

export const Default: Story = {
    args: {
        label: 'Pick Color',
        color: '#ff0000',
    },
};

export const CustomLabel: Story = {
    args: {
        label: 'Select Theme Color',
        color: '#00ff00',
    },
};
