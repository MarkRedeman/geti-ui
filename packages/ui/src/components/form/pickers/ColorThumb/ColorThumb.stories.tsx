import type { Meta, StoryObj } from '@storybook/react';
import { ColorThumb } from './ColorThumb';
import { Flex } from '../../../layouts/Flex/Flex';

const meta: Meta<typeof ColorThumb> = {
    component: ColorThumb,
    title: 'Form/Pickers/ColorThumb',
    argTypes: {
        color: { control: 'color' },
        size: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof ColorThumb>;

export const Default: Story = {
    args: {
        color: '#ff0000',
        size: 20,
    },
};

export const Sizes: Story = {
    render: () => (
        <Flex gap="size-200" alignItems="center">
            <ColorThumb color="#ff0000" size={10} />
            <ColorThumb color="#00ff00" size={20} />
            <ColorThumb color="#0000ff" size={40} />
        </Flex>
    ),
};
