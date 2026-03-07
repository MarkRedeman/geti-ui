// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../ui/Button/Button';
import { Tooltip } from './Tooltip';
import { TooltipTrigger } from './TooltipTrigger';

const meta: Meta<typeof Tooltip> = {
    component: Tooltip,
    title: 'Overlays/Tooltip',
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    render: (args) => (
        <TooltipTrigger>
            <Button variant="primary">Hover me</Button>
            <Tooltip {...args}>This is a tooltip</Tooltip>
        </TooltipTrigger>
    ),
};

export const PlacementTop: Story = {
    render: (args) => (
        <TooltipTrigger placement="top">
            <Button variant="primary">Top</Button>
            <Tooltip {...args}>Tooltip on top</Tooltip>
        </TooltipTrigger>
    ),
};

export const PlacementBottom: Story = {
    render: (args) => (
        <TooltipTrigger placement="bottom">
            <Button variant="primary">Bottom</Button>
            <Tooltip {...args}>Tooltip on bottom</Tooltip>
        </TooltipTrigger>
    ),
};

export const PlacementStart: Story = {
    render: (args) => (
        <TooltipTrigger placement="start">
            <Button variant="primary">Start</Button>
            <Tooltip {...args}>Tooltip at start</Tooltip>
        </TooltipTrigger>
    ),
};

export const PlacementEnd: Story = {
    render: (args) => (
        <TooltipTrigger placement="end">
            <Button variant="primary">End</Button>
            <Tooltip {...args}>Tooltip at end</Tooltip>
        </TooltipTrigger>
    ),
};

export const Disabled: Story = {
    render: (args) => (
        <TooltipTrigger isDisabled>
            <Button variant="primary">No tooltip</Button>
            <Tooltip {...args}>You won't see this</Tooltip>
        </TooltipTrigger>
    ),
};
