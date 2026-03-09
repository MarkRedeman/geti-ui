import type { Meta, StoryObj } from '@storybook/react';

import { ColorSlider, Flex } from '@geti-ai/ui';

const meta: Meta<typeof ColorSlider> = {
    tags: ['!dev'],
    component: ColorSlider,
    title: 'Form/Color controls/ColorSlider',
    argTypes: {
        channel: {
            control: 'select',
            options: ['red', 'green', 'blue', 'alpha', 'hue', 'saturation', 'brightness', 'lightness'],
        },
        label: { control: 'text' },
        showValueLabel: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ColorSlider>;

export const Default: Story = {
    args: {
        defaultValue: '#7f0000',
        channel: 'red',
    },
};

export const Channels: Story = {
    render: () => (
        <Flex direction="column" gap="size-200">
            <ColorSlider defaultValue="#7f0000" channel="red" label="Red" />
            <ColorSlider defaultValue="#7f0000" channel="green" label="Green" />
            <ColorSlider defaultValue="#7f0000" channel="blue" label="Blue" />
            <ColorSlider defaultValue="#7f0000" channel="alpha" label="Alpha" />
        </Flex>
    ),
};

export const HSL: Story = {
    render: () => (
        <Flex direction="column" gap="size-200">
            <ColorSlider defaultValue="hsl(0, 100%, 50%)" channel="hue" label="Hue" />
            <ColorSlider defaultValue="hsl(0, 100%, 50%)" channel="saturation" label="Saturation" />
            <ColorSlider defaultValue="hsl(0, 100%, 50%)" channel="lightness" label="Lightness" />
        </Flex>
    ),
};

export const Vertical: Story = {
    render: () => (
        <Flex gap="size-500">
            <ColorSlider defaultValue="#7f0000" channel="red" orientation="vertical" label="Red" />
            <ColorSlider defaultValue="#7f0000" channel="green" orientation="vertical" label="Green" />
            <ColorSlider defaultValue="#7f0000" channel="blue" orientation="vertical" label="Blue" />
        </Flex>
    ),
};
