import type { Meta, StoryObj } from '@storybook/react';
import { ColorPickerDialog } from './ColorPickerDialog';

const meta: Meta<typeof ColorPickerDialog> = {
    component: ColorPickerDialog,
    title: 'Form/Pickers/ColorPickerDialog',
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
