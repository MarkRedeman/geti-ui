import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, CheckboxGroup } from '@geti-ai/ui';

const meta: Meta<typeof CheckboxGroup> = {
    tags: ['!dev'],
    component: CheckboxGroup,
    title: 'Form/CheckboxGroup',
    argTypes: {
        label: { control: 'text' },
        orientation: {
            control: { type: 'select' },
            options: ['horizontal', 'vertical'],
        },
        isDisabled: { control: 'boolean' },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
    args: { label: 'Favorite sports' },
    render: (args) => (
        <CheckboxGroup {...args}>
            <Checkbox value="soccer">Soccer</Checkbox>
            <Checkbox value="baseball">Baseball</Checkbox>
            <Checkbox value="basketball">Basketball</Checkbox>
        </CheckboxGroup>
    ),
};

export const DefaultSelected: Story = {
    args: { label: 'Favorite sports', defaultValue: ['soccer', 'basketball'] },
    render: (args) => (
        <CheckboxGroup {...args}>
            <Checkbox value="soccer">Soccer</Checkbox>
            <Checkbox value="baseball">Baseball</Checkbox>
            <Checkbox value="basketball">Basketball</Checkbox>
        </CheckboxGroup>
    ),
};

export const Horizontal: Story = {
    args: { label: 'Options', orientation: 'horizontal' },
    render: (args) => (
        <CheckboxGroup {...args}>
            <Checkbox value="a">Option A</Checkbox>
            <Checkbox value="b">Option B</Checkbox>
            <Checkbox value="c">Option C</Checkbox>
        </CheckboxGroup>
    ),
};

export const Disabled: Story = {
    args: { label: 'Favorite sports', isDisabled: true },
    render: (args) => (
        <CheckboxGroup {...args}>
            <Checkbox value="soccer">Soccer</Checkbox>
            <Checkbox value="baseball">Baseball</Checkbox>
        </CheckboxGroup>
    ),
};
