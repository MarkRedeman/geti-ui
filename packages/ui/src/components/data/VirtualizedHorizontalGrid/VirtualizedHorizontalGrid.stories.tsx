import type { Meta, StoryObj } from '@storybook/react';
import { VirtualizedHorizontalGrid } from './VirtualizedHorizontalGrid';
import { Flex, Text, View } from '@adobe/react-spectrum';

interface MockItem {
    id: string;
    title: string;
    thumbnail: string;
}

const items: MockItem[] = Array.from({ length: 500 }, (_, i) => ({
    id: `item-${i}`,
    title: `Image ${i}`,
    thumbnail: `https://picsum.photos/id/${i % 100}/200/150`,
}));

const meta: Meta<typeof VirtualizedHorizontalGrid> = {
    tags: ["!dev"],
    component: VirtualizedHorizontalGrid,
    title: 'Data/VirtualizedHorizontalGrid',
};

export default meta;
type Story = StoryObj<typeof VirtualizedHorizontalGrid<MockItem>>;

export const Default: Story = {
    args: {
        items,
        height: 'size-2400',
        layoutOptions: {
            size: 200,
            gap: 10,
        },
        idFormatter: (item) => item.id,
        textValueFormatter: (item) => item.title,
        renderItem: (item) => (
            <Flex direction="column" gap="size-100">
                <View
                    width="100%"
                    height="size-1600"
                    backgroundColor="gray-200"
                    UNSAFE_style={{
                        backgroundImage: `url(${item.thumbnail})`,
                        backgroundSize: 'cover',
                    }}
                />
                <Text alignSelf="center">{item.title}</Text>
            </Flex>
        ),
    },
};
