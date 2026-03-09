import type { Meta, StoryObj } from '@storybook/react';
import { CornerIndicator } from '@geti-ai/ui';
import { View } from '@adobe/react-spectrum';

const meta: Meta<typeof CornerIndicator> = {
    tags: ['!dev'],
    component: CornerIndicator,
    title: 'UI/CornerIndicator',
};

export default meta;
type Story = StoryObj<typeof CornerIndicator>;

export const Default: Story = {
    args: {
        isActive: true,
        children: <View width="size-1000" height="size-1000" backgroundColor="gray-200" borderRadius="medium" />,
    },
};

export const Inactive: Story = {
    args: {
        isActive: false,
        children: <View width="size-1000" height="size-1000" backgroundColor="gray-200" borderRadius="medium" />,
    },
};
