import type { Meta, StoryObj } from '@storybook/react';
import { FullscreenAction } from '@geti/ui';
import { Flex, Text, View } from '@adobe/react-spectrum';

const meta: Meta<typeof FullscreenAction> = {
    tags: ["!dev"],
    title: 'Overlays/FullscreenAction',
    component: FullscreenAction,
};

export default meta;
type Story = StoryObj<typeof FullscreenAction>;

export const Default: Story = {
    args: {
        title: 'Immersive Editor',
        children: (
            <Flex direction="column" gap="size-200" UNSAFE_style={{ padding: '20px' }}>
                <Text>This content is now in fullscreen mode.</Text>
                <View backgroundColor="gray-200" height="size-2000" width="100%" />
            </Flex>
        ),
    },
};

export const WithActionButton: Story = {
    args: {
        title: 'Photo Viewer',
        actionButton: <Text UNSAFE_style={{ alignSelf: 'center', marginRight: '10px' }}>Custom Action</Text>,
        children: (
            <Flex justifyContent="center" alignItems="center" height="100%">
                <Text>Imagine a large high-resolution image here.</Text>
            </Flex>
        ),
    },
};

export const FunctionalActionButton: Story = {
    args: {
        title: 'Dynamic Content',
        actionButton: (ref) => (
            <Text UNSAFE_style={{ alignSelf: 'center', marginRight: '10px' }}>
                {ref ? 'Ref available' : 'Ref null'}
            </Text>
        ),
        children: (
            <Flex direction="column" gap="size-200" UNSAFE_style={{ padding: '20px' }}>
                <Text>The action button above can interact with this content via the ref.</Text>
            </Flex>
        ),
    },
};
