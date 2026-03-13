import type { Meta, StoryObj } from '@storybook/react';

import { Text, View } from '@geti-ai/ui';

const meta: Meta<typeof Text> = {
    tags: ['!dev'],
    component: Text,
    title: 'UI/Text',
    argTypes: {
        children: { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
    args: {
        children: 'Dataset upload completed successfully.',
    },
};

export const InContainer: Story = {
    render: () => (
        <View padding="size-200" backgroundColor="gray-200" borderRadius="medium">
            <Text>Manage subsets, import data, and export snapshots.</Text>
        </View>
    ),
};
