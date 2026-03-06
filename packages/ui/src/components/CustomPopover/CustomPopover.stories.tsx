// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';
import { Button as AriaButton } from 'react-aria-components';

import { CustomPopover } from './CustomPopover';

const meta: Meta<typeof CustomPopover> = {
    component: CustomPopover,
    title: 'Components/CustomPopover',
    parameters: {
        a11y: {},
    },
    argTypes: {
        placement: {
            control: { type: 'select' },
            options: ['top', 'bottom', 'start', 'end', 'top start', 'top end', 'bottom start', 'bottom end'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof CustomPopover>;

export const Default: Story = {
    render: (args) => (
        <CustomPopover {...args} triggerElement={<AriaButton>Open</AriaButton>}>
            <p>Custom popover content goes here.</p>
        </CustomPopover>
    ),
};

export const WithArrow: Story = {
    render: (args) => (
        <CustomPopover {...args} showArrow triggerElement={<AriaButton>Open with arrow</AriaButton>}>
            <p>This popover has a directional arrow.</p>
        </CustomPopover>
    ),
};

export const WithCustomWidth: Story = {
    render: (args) => (
        <CustomPopover {...args} width={320} triggerElement={<AriaButton>Open wide popover</AriaButton>}>
            <p>This popover has a fixed width of 320px.</p>
        </CustomPopover>
    ),
};

export const PlacementTop: Story = {
    render: (args) => (
        <div style={{ marginTop: '4rem' }}>
            <CustomPopover {...args} placement="top" triggerElement={<AriaButton>Top placement</AriaButton>}>
                <p>Popover placed at the top.</p>
            </CustomPopover>
        </div>
    ),
};

export const PlacementBottom: Story = {
    render: (args) => (
        <CustomPopover {...args} placement="bottom" triggerElement={<AriaButton>Bottom placement</AriaButton>}>
            <p>Popover placed at the bottom.</p>
        </CustomPopover>
    ),
};
