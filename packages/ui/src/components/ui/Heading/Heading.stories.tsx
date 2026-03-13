import type { Meta, StoryObj } from '@storybook/react';

import { Heading, View } from '@geti-ai/ui';

const meta: Meta<typeof Heading> = {
    tags: ['!dev'],
    component: Heading,
    title: 'UI/Heading',
    argTypes: {
        children: { control: 'text' },
        level: {
            control: { type: 'select' },
            options: [1, 2, 3, 4, 5, 6],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {
    args: {
        children: 'Dataset overview',
    },
};

export const InSection: Story = {
    render: () => (
        <View padding="size-200" backgroundColor="gray-200" borderRadius="medium">
            <Heading>Training datasets</Heading>
        </View>
    ),
};

export const LevelThree: Story = {
    args: {
        level: 3,
        children: 'Training subsets',
    },
};

export const LevelOne: Story = {
    args: {
        level: 1,
        children: 'Level 1 heading',
    },
};

export const LevelTwo: Story = {
    args: {
        level: 2,
        children: 'Level 2 heading',
    },
};

export const LevelFour: Story = {
    args: {
        level: 4,
        children: 'Level 4 heading',
    },
};

export const LevelFive: Story = {
    args: {
        level: 5,
        children: 'Level 5 heading',
    },
};

export const LevelSix: Story = {
    args: {
        level: 6,
        children: 'Level 6 heading',
    },
};
