// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton, Content, Dialog, Heading } from '@adobe/react-spectrum';

import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
    component: Popover,
    title: 'Components/Popover',
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
    render: (args) => (
        <Popover {...args}>
            <ActionButton>Open popover</ActionButton>
            <Dialog>
                <Heading>Popover title</Heading>
                <Content>This is the popover content.</Content>
            </Dialog>
        </Popover>
    ),
};

export const PlacementBottom: Story = {
    render: (args) => (
        <Popover {...args} placement="bottom">
            <ActionButton>Bottom popover</ActionButton>
            <Dialog>
                <Heading>Bottom</Heading>
                <Content>Popover placed at the bottom.</Content>
            </Dialog>
        </Popover>
    ),
};

export const PlacementStart: Story = {
    render: (args) => (
        <Popover {...args} placement="start">
            <ActionButton>Start popover</ActionButton>
            <Dialog>
                <Heading>Start</Heading>
                <Content>Popover placed at the start.</Content>
            </Dialog>
        </Popover>
    ),
};

export const WithArrow: Story = {
    render: (args) => (
        <Popover {...args} hideArrow={false}>
            <ActionButton>With arrow</ActionButton>
            <Dialog>
                <Heading>Arrow popover</Heading>
                <Content>This popover has a directional arrow.</Content>
            </Dialog>
        </Popover>
    ),
};
