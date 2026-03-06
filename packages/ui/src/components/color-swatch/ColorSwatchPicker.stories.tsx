import type { Meta, StoryObj } from '@storybook/react';
import { ColorSwatchPicker, ColorSwatchPickerItem } from './ColorSwatchPicker';

const meta: Meta<typeof ColorSwatchPicker> = {
    component: ColorSwatchPicker,
    title: 'Color/ColorSwatchPicker',
    argTypes: {
        size: {
            control: 'select',
            options: ['S', 'M', 'L'],
        },
        rounding: {
            control: 'select',
            options: ['none', 'default', 'full'],
        },
        density: {
            control: 'select',
            options: ['compact', 'regular', 'spacious'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ColorSwatchPicker>;

export const Default: Story = {
    args: {
        // @ts-ignore
        'aria-label': 'Color Picker',
        children: [
            <ColorSwatchPickerItem key="#f00" color="#f00" aria-label="Red" />,
            <ColorSwatchPickerItem key="#0f0" color="#0f0" aria-label="Green" />,
            <ColorSwatchPickerItem key="#00f" color="#00f" aria-label="Blue" />,
            <ColorSwatchPickerItem key="#ff0" color="#ff0" aria-label="Yellow" />,
            <ColorSwatchPickerItem key="#f0f" color="#f0f" aria-label="Magenta" />,
            <ColorSwatchPickerItem key="#0ff" color="#0ff" aria-label="Cyan" />,
        ],
    },
};

export const Grid: Story = {
    args: {
        ...Default.args,
    },
};

export const Stack: Story = {
    args: {
        ...Default.args,
    },
};
