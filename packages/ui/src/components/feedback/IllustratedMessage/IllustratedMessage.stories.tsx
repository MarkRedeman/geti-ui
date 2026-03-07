// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import Alert from '@spectrum-icons/workflow/Alert';
import type { Meta, StoryObj } from '@storybook/react';
import { Content, Heading } from '@adobe/react-spectrum';

import { IllustratedMessage } from './IllustratedMessage';

const meta: Meta<typeof IllustratedMessage> = {
    tags: ["!dev"],
    component: IllustratedMessage,
    title: 'Feedback/IllustratedMessage',
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof IllustratedMessage>;

/** Default empty state with heading and description. */
export const Default: Story = {
    render: () => (
        <IllustratedMessage>
            <Alert size="XXL" />
            <Heading>No results</Heading>
            <Content>No results found. Try a different search.</Content>
        </IllustratedMessage>
    ),
};

/** Empty state for a folder with no items. */
export const EmptyFolder: Story = {
    render: () => (
        <IllustratedMessage>
            <Alert size="XXL" />
            <Heading>No items</Heading>
            <Content>This folder is empty. Add items to get started.</Content>
        </IllustratedMessage>
    ),
};
