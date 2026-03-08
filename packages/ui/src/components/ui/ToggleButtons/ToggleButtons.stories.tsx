import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ToggleButtons } from '@geti/ui';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';
import ViewList from '@spectrum-icons/workflow/ViewList';

const meta: Meta<typeof ToggleButtons> = {
    tags: ["!dev"],
    title: 'UI/ToggleButtons',
    component: ToggleButtons,
};

export default meta;
type Story = StoryObj<typeof ToggleButtons>;

const DefaultStory = (args: React.ComponentProps<typeof ToggleButtons>) => {
    const [selected, setSelected] = useState(args.selectedOption || 'Option 1');
    return <ToggleButtons {...args} selectedOption={selected} onOptionChange={setSelected} />;
};

export const Default: Story = {
    render: (args) => <DefaultStory {...args} />,
    args: {
        options: ['Option 1', 'Option 2', 'Option 3'],
        selectedOption: 'Option 1',
    },
};

const WithIconsStory = (args: React.ComponentProps<typeof ToggleButtons>) => {
    const [selected, setSelected] = useState(args.selectedOption || 'grid');
    return (
        <ToggleButtons
            {...args}
            selectedOption={selected}
            onOptionChange={setSelected}
            getLabel={(option) => {
                if (option === 'grid') return <ViewGrid aria-label="Grid view" />;
                if (option === 'list') return <ViewList aria-label="List view" />;
                return option;
            }}
        />
    );
};

export const WithIcons: Story = {
    render: (args) => <WithIconsStory {...args} />,
    args: {
        options: ['grid', 'list'],
        selectedOption: 'grid',
    },
};

export const Disabled: Story = {
    args: {
        options: ['A', 'B', 'C'],
        selectedOption: 'B',
        isDisabled: true,
    },
};
