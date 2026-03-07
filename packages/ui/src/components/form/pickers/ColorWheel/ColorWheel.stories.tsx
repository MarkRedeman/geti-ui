import type { Meta, StoryObj } from '@storybook/react';

import { ColorWheel } from './ColorWheel';

const meta: Meta<typeof ColorWheel> = {
    tags: ["!dev"],
    component: ColorWheel,
    title: 'Form/Pickers/ColorWheel',
    argTypes: {
        isDisabled: { control: 'boolean' },
        size: {
            control: 'number',
            description: 'The diameter of the color wheel.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ColorWheel>;

export const Default: Story = {
    args: {
        defaultValue: 'hsl(0, 100%, 50%)',
    },
};

export const CustomSize: Story = {
    args: {
        defaultValue: 'hsl(120, 100%, 50%)',
        size: 300,
    },
};

export const Disabled: Story = {
    args: {
        defaultValue: 'hsl(240, 100%, 50%)',
        isDisabled: true,
    },
};
