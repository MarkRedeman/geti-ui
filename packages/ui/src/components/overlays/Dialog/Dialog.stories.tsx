import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup, Content, Divider, Footer, Heading } from '@adobe/react-spectrum';

import { Dialog, DialogTrigger } from '@geti-ai/ui';

const meta: Meta<typeof Dialog> = {
    tags: ['!dev'],
    component: Dialog,
    title: 'Overlays/Dialog',
    parameters: {
        a11y: {},
    },
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['S', 'M', 'L'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="accent">Open dialog</Button>
            {(close) => (
                <Dialog {...args}>
                    <Heading>Dialog title</Heading>
                    <Divider />
                    <Content>This is the dialog content.</Content>
                    <Footer>
                        <ButtonGroup>
                            <Button variant="secondary" onPress={close}>
                                Cancel
                            </Button>
                            <Button variant="accent" onPress={close}>
                                Confirm
                            </Button>
                        </ButtonGroup>
                    </Footer>
                </Dialog>
            )}
        </DialogTrigger>
    ),
};

export const Dismissable: Story = {
    render: (args) => (
        <DialogTrigger isDismissable>
            <Button variant="accent">Open dismissable</Button>
            <Dialog {...args}>
                <Heading>Dismissable dialog</Heading>
                <Divider />
                <Content>Click outside or press Escape to close this dialog.</Content>
            </Dialog>
        </DialogTrigger>
    ),
};

export const Small: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="primary">Small dialog</Button>
            {(close) => (
                <Dialog {...args} size="S">
                    <Heading>Small dialog</Heading>
                    <Divider />
                    <Content>A compact dialog with size S.</Content>
                    <Footer>
                        <Button variant="primary" onPress={close}>
                            OK
                        </Button>
                    </Footer>
                </Dialog>
            )}
        </DialogTrigger>
    ),
};

export const Large: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="primary">Large dialog</Button>
            {(close) => (
                <Dialog {...args} size="L">
                    <Heading>Large dialog</Heading>
                    <Divider />
                    <Content>
                        A large dialog with size L. This has more room for detailed content, forms, or complex
                        workflows.
                    </Content>
                    <Footer>
                        <ButtonGroup>
                            <Button variant="secondary" onPress={close}>
                                Cancel
                            </Button>
                            <Button variant="accent" onPress={close}>
                                Save
                            </Button>
                        </ButtonGroup>
                    </Footer>
                </Dialog>
            )}
        </DialogTrigger>
    ),
};
