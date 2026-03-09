import type { Meta, StoryObj } from '@storybook/react';

import { PickerItem as Item, Picker } from '@geti-ai/ui';

const meta: Meta<typeof Picker> = {
    tags: ['!dev'],
    component: Picker,
    title: 'Form/Picker',
    argTypes: {
        label: { control: 'text' },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Picker>;

export const Default: Story = {
    args: { label: 'Choose a framework' },
    render: (args) => (
        <Picker {...args}>
            <Item key="react">React</Item>
            <Item key="vue">Vue</Item>
            <Item key="angular">Angular</Item>
            <Item key="svelte">Svelte</Item>
        </Picker>
    ),
};

export const DefaultSelected: Story = {
    args: { label: 'Choose a framework', defaultSelectedKey: 'react' },
    render: (args) => (
        <Picker {...args}>
            <Item key="react">React</Item>
            <Item key="vue">Vue</Item>
            <Item key="angular">Angular</Item>
        </Picker>
    ),
};

export const Disabled: Story = {
    args: { label: 'Choose a framework', isDisabled: true },
    render: (args) => (
        <Picker {...args}>
            <Item key="react">React</Item>
            <Item key="vue">Vue</Item>
        </Picker>
    ),
};
