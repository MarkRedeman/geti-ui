import type { Meta, StoryObj } from '@storybook/react';

import { ColorSwatch, Flex } from '@geti/ui';

const meta: Meta<typeof ColorSwatch> = {
    tags: ['!dev'],
    component: ColorSwatch,
    title: 'Form/Color controls/ColorSwatch',
    argTypes: {
        color: { control: 'color' },
        size: {
            control: 'select',
            options: ['S', 'M', 'L'],
        },
        rounding: {
            control: 'select',
            options: ['none', 'default', 'full'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

export const Default: Story = {
    args: {
        color: '#ff0000',
    },
};

export const Sizes: Story = {
    render: (args) => (
        <Flex gap="size-200">
            <ColorSwatch {...args} size="S" color="#ff0000" aria-label="Small" />
            <ColorSwatch {...args} size="M" color="#00ff00" aria-label="Medium" />
            <ColorSwatch {...args} size="L" color="#0000ff" aria-label="Large" />
        </Flex>
    ),
};

export const Rounding: Story = {
    render: (args) => (
        <Flex gap="size-200">
            <ColorSwatch {...args} rounding="none" color="#ff0000" aria-label="None" />
            <ColorSwatch {...args} rounding="default" color="#00ff00" aria-label="Default" />
            <ColorSwatch {...args} rounding="full" color="#0000ff" aria-label="Full" />
        </Flex>
    ),
};
