// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
    component: Card,
    title: 'Layouts/Card',
    argTypes: {
        isSelected: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
        'aria-label': { control: 'text' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Card>;

/** Default static card for displaying summary content. */
export const Default: Story = {
    args: {
        'aria-label': 'Model card',
        children: (
            <div>
                <strong>Model Name</strong>
                <p>Detection · 94.2% accuracy</p>
            </div>
        ),
    },
};

/** Interactive selectable card. */
export const Selectable: Story = {
    args: {
        'aria-label': 'Select project',
        onPress: () => {},
        children: (
            <div>
                <strong>Project Alpha</strong>
                <p>Classification · 3 tasks</p>
            </div>
        ),
    },
};

/** Selected card state. */
export const Selected: Story = {
    args: {
        'aria-label': 'Selected project',
        isSelected: true,
        onPress: () => {},
        children: (
            <div>
                <strong>Project Beta</strong>
                <p>Detection · 5 tasks</p>
            </div>
        ),
    },
};

/** Disabled card state. */
export const Disabled: Story = {
    args: {
        'aria-label': 'Disabled project',
        isDisabled: true,
        onPress: () => {},
        children: (
            <div>
                <strong>Project Gamma</strong>
                <p>Segmentation · unavailable</p>
            </div>
        ),
    },
};
