// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { Content, Flex, Heading, Text } from '@adobe/react-spectrum';

import { ContextualHelp } from './ContextualHelp';

const meta: Meta<typeof ContextualHelp> = {
    tags: ["!dev"],
    component: ContextualHelp,
    title: 'Overlays/ContextualHelp',
    parameters: {
        a11y: {},
    },
    argTypes: {
        variant: {
            control: { type: 'radio' },
            options: ['help', 'info'],
        },
        placement: {
            control: { type: 'select' },
            options: ['top', 'bottom', 'start', 'end', 'top start', 'top end', 'bottom start', 'bottom end'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof ContextualHelp>;

export const Help: Story = {
    render: (args) => (
        <ContextualHelp {...args} variant="help">
            <Heading>Need help?</Heading>
            <Content>
                <Text>
                    This field accepts a maximum of 64 characters. Use a descriptive name to easily identify the item
                    later.
                </Text>
            </Content>
        </ContextualHelp>
    ),
};

export const Info: Story = {
    render: (args) => (
        <ContextualHelp {...args} variant="info">
            <Heading>About this feature</Heading>
            <Content>
                <Text>This feature is currently in beta. Some functionality may change before the final release.</Text>
            </Content>
        </ContextualHelp>
    ),
};

export const WithLabel: Story = {
    render: (args) => (
        <Flex gap="size-100" alignItems="center">
            <Text>Dataset name</Text>
            <ContextualHelp {...args} variant="help">
                <Heading>Dataset name</Heading>
                <Content>
                    <Text>
                        Enter a unique name for your dataset. This name will be displayed throughout the application.
                    </Text>
                </Content>
            </ContextualHelp>
        </Flex>
    ),
};

export const PlacementTop: Story = {
    render: (args) => (
        <div style={{ marginTop: '6rem' }}>
            <ContextualHelp {...args} variant="help" placement="top">
                <Heading>Top placement</Heading>
                <Content>
                    <Text>This help popover appears above the icon button.</Text>
                </Content>
            </ContextualHelp>
        </div>
    ),
};
