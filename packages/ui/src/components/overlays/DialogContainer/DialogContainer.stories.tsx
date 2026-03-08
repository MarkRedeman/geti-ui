// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup, Content, Divider, Heading } from '@adobe/react-spectrum';

import { Dialog, DialogContainer } from '@geti/ui';

const meta: Meta<typeof DialogContainer> = {
    tags: ['!dev'],
    component: DialogContainer,
    title: 'Overlays/DialogContainer',
    parameters: {
        a11y: {},
    },
};
export default meta;

type Story = StoryObj<typeof DialogContainer>;

const ProgrammaticExample = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button variant="accent" onPress={() => setIsOpen(true)}>
                Open dialog programmatically
            </Button>
            <DialogContainer onDismiss={() => setIsOpen(false)}>
                {isOpen && (
                    <Dialog>
                        <Heading>Programmatic dialog</Heading>
                        <Divider />
                        <Content>
                            This dialog was opened programmatically without a persistent DialogTrigger element.
                        </Content>
                        <ButtonGroup>
                            <Button variant="secondary" onPress={() => setIsOpen(false)}>
                                Close
                            </Button>
                        </ButtonGroup>
                    </Dialog>
                )}
            </DialogContainer>
        </>
    );
};

export const Default: Story = {
    render: () => <ProgrammaticExample />,
};

const DismissableExample = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button variant="primary" onPress={() => setIsOpen(true)}>
                Open dismissable dialog
            </Button>
            <DialogContainer isDismissable onDismiss={() => setIsOpen(false)}>
                {isOpen && (
                    <Dialog>
                        <Heading>Dismissable dialog</Heading>
                        <Divider />
                        <Content>Click outside or press Escape to close this dialog.</Content>
                    </Dialog>
                )}
            </DialogContainer>
        </>
    );
};

export const Dismissable: Story = {
    render: () => <DismissableExample />,
};
