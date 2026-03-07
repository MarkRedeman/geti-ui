import type { Meta, StoryObj } from '@storybook/react';
import { PressableElement } from './PressableElement';
import { View, Text } from '@adobe/react-spectrum';

const meta: Meta<typeof PressableElement> = {
    tags: ["!dev"],
    component: PressableElement,
    title: 'UI/PressableElement',
};

export default meta;
type Story = StoryObj<typeof PressableElement>;

export const Default: Story = {
    args: {
        children: (
            <View padding="size-200" backgroundColor="gray-200" borderRadius="medium">
                <Text>I am pressable</Text>
            </View>
        ),
        onPress: () => alert('Pressed!'),
    },
};

export const Truncated: Story = {
    args: {
        isTruncated: true,
        width: 'size-1200',
        children: (
            <View padding="size-100" backgroundColor="gray-200" borderRadius="medium">
                <Text>Very long text that should be truncated by the pressable wrapper</Text>
            </View>
        ),
    },
};
