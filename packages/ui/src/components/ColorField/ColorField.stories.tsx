import type { Meta, StoryObj } from '@storybook/react';
import { ColorField } from './ColorField';
import { Flex } from '../Flex/Flex';

const meta: Meta<typeof ColorField> = {
    component: ColorField,
    title: 'Color/ColorField',
    argTypes: {
        label: { control: 'text' },
        isDisabled: { control: 'boolean' },
        isReadOnly: { control: 'boolean' },
        isRequired: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof ColorField>;

export const Default: Story = {
    args: {
        label: 'Color',
    },
};

export const Controlled: Story = {
    args: {
        label: 'Primary Color',
        defaultValue: '#e73623',
    },
};

export const Validation: Story = {
    render: () => (
        <Flex direction="column" gap="size-200">
            <ColorField label="Required" isRequired />
            <ColorField label="Invalid" validationState="invalid" errorMessage="Please enter a valid color." />
        </Flex>
    ),
};
