import type { Meta, StoryObj } from '@storybook/react';
import { ColorArea } from './ColorArea';
import { Flex } from '../../../layouts/Flex/Flex';

const meta: Meta<typeof ColorArea> = {
    component: ColorArea,
    title: 'Form/Pickers/ColorArea',
    argTypes: {
        xChannel: {
            control: 'select',
            options: ['red', 'green', 'blue', 'saturation', 'brightness', 'lightness', 'hue'],
        },
        yChannel: {
            control: 'select',
            options: ['red', 'green', 'blue', 'saturation', 'brightness', 'lightness', 'hue'],
        },
        isDisabled: { control: 'boolean' },
        size: {
            control: 'number',
            description: 'The size of the color area (width and height).',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ColorArea>;

export const Default: Story = {
    args: {
        defaultValue: '#7f0000',
    },
};

export const RGB: Story = {
    render: () => (
        <Flex gap="size-200">
            <ColorArea defaultValue="#7f0000" xChannel="blue" yChannel="green" />
            <ColorArea defaultValue="#7f0000" xChannel="red" yChannel="blue" />
            <ColorArea defaultValue="#7f0000" xChannel="red" yChannel="green" />
        </Flex>
    ),
};

export const HSB: Story = {
    render: () => (
        <Flex gap="size-200">
            <ColorArea defaultValue="hsb(0, 100%, 50%)" xChannel="saturation" yChannel="brightness" />
            <ColorArea defaultValue="hsb(240, 100%, 50%)" xChannel="saturation" yChannel="brightness" />
        </Flex>
    ),
};

export const CustomSize: Story = {
    args: {
        defaultValue: '#7f0000',
        size: 300,
    },
};
