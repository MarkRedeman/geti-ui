import type { Meta, StoryObj } from '@storybook/react';
import { VirtualizedListLayout } from '@geti/ui';
import { Flex, Text } from '@adobe/react-spectrum';

interface MockItem {
    id: string;
    name: string;
    description: string;
}

const items: MockItem[] = Array.from({ length: 1000 }, (_, i) => ({
    id: `item-${i}`,
    name: `Item ${i}`,
    description: `Description for item ${i}`,
}));

const meta: Meta<typeof VirtualizedListLayout> = {
    tags: ["!dev"],
    component: VirtualizedListLayout,
    title: 'Data/VirtualizedListLayout',
    argTypes: {
        isLoading: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof VirtualizedListLayout<MockItem>>;

export const Default: Story = {
    args: {
        items,
        ariaLabel: 'Virtualized List',
        containerHeight: 'size-5000',
        layoutOptions: {
            rowHeight: 60,
        },
        idFormatter: (item) => item.id,
        textValueFormatter: (item) => item.name,
        renderItem: (item) => (
            <Flex direction="column" UNSAFE_style={{ padding: '10px', borderBottom: '1px solid gray' }}>
                <Text>
                    <strong>{item.name}</strong>
                </Text>
                <Text>{item.description}</Text>
            </Flex>
        ),
    },
};

export const Loading: Story = {
    args: {
        ...Default.args,
        isLoading: true,
    },
};
