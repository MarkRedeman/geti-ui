import type { Meta, StoryObj } from '@storybook/react';
import { VirtualizedHorizontalGrid } from '@geti/ui';
import { Flex, Text, View } from '@adobe/react-spectrum';

interface MockItem {
    id: string;
    title: string;
    thumbnail: string;
}

const items: MockItem[] = Array.from({ length: 500 }, (_, i) => ({
    id: `item-${i}`,
    title: `Image ${i}`,
    thumbnail:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#2b2b2b" />
                  <stop offset="100%" stop-color="#1a1a1a" />
                </linearGradient>
              </defs>
              <rect width="200" height="150" fill="url(#g)" />
              <circle cx="100" cy="70" r="24" fill="#0a84ff" fill-opacity="0.35" />
              <text x="100" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#c7c7c7">Preview</text>
            </svg>`
        ),
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
