import type { Meta, StoryObj } from '@storybook/react';

import { Button, TextField, Form } from '@geti-ai/ui';

const meta: Meta<typeof Form> = {
    tags: ['!dev'],
    component: Form,
    title: 'Form/Form',
    argTypes: {
        isDisabled: { control: 'boolean' },
        validationBehavior: {
            control: { type: 'select' },
            options: ['aria', 'native'],
        },
    },
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
    render: (args) => (
        <Form {...args}>
            <TextField label="First Name" />
            <TextField label="Last Name" />
            <Button type="submit">Submit</Button>
        </Form>
    ),
};

export const Disabled: Story = {
    args: { isDisabled: true },
    render: (args) => (
        <Form {...args}>
            <TextField label="First Name" />
            <TextField label="Last Name" />
            <Button type="submit">Submit</Button>
        </Form>
    ),
};

export const NativeValidation: Story = {
    args: { validationBehavior: 'native' },
    render: (args) => (
        <Form {...args}>
            <TextField label="Email" type="email" isRequired />
            <Button type="submit">Submit</Button>
        </Form>
    ),
};
