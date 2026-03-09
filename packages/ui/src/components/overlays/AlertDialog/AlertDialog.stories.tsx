import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@adobe/react-spectrum';

import { AlertDialog, DialogTrigger } from '@geti-ai/ui';

const meta: Meta<typeof AlertDialog> = {
    tags: ['!dev'],
    component: AlertDialog,
    title: 'Overlays/AlertDialog',
    parameters: {
        a11y: {},
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['confirmation', 'information', 'destructive', 'error', 'warning'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof AlertDialog>;

export const Confirmation: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="accent">Save changes</Button>
            <AlertDialog
                {...args}
                variant="confirmation"
                title="Save changes?"
                primaryActionLabel="Save"
                cancelLabel="Cancel"
                onPrimaryAction={() => console.log('Saved')}
                onCancel={() => console.log('Cancelled')}
            >
                Are you sure you want to save these changes? This action cannot be undone.
            </AlertDialog>
        </DialogTrigger>
    ),
};

export const Destructive: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="negative">Delete item</Button>
            <AlertDialog
                {...args}
                variant="destructive"
                title="Delete item?"
                primaryActionLabel="Delete"
                cancelLabel="Cancel"
                onPrimaryAction={() => console.log('Deleted')}
                onCancel={() => console.log('Cancelled')}
            >
                This will permanently delete the item. This action cannot be undone.
            </AlertDialog>
        </DialogTrigger>
    ),
};

export const Information: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="primary">Learn more</Button>
            <AlertDialog {...args} variant="information" title="Feature update" primaryActionLabel="Got it">
                A new version of this feature is available. Please review the changes before continuing.
            </AlertDialog>
        </DialogTrigger>
    ),
};

export const Warning: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="primary">Proceed</Button>
            <AlertDialog
                {...args}
                variant="warning"
                title="Proceed with caution"
                primaryActionLabel="Proceed"
                cancelLabel="Go back"
                onPrimaryAction={() => console.log('Proceeded')}
            >
                This action may have unintended side effects. Are you sure you want to proceed?
            </AlertDialog>
        </DialogTrigger>
    ),
};

export const WithSecondaryAction: Story = {
    render: (args) => (
        <DialogTrigger>
            <Button variant="primary">Open</Button>
            <AlertDialog
                {...args}
                variant="confirmation"
                title="Save document?"
                primaryActionLabel="Save"
                secondaryActionLabel="Don't save"
                cancelLabel="Cancel"
                onPrimaryAction={() => console.log('Saved')}
                onSecondaryAction={() => console.log("Didn't save")}
                onCancel={() => console.log('Cancelled')}
            >
                Do you want to save your changes before closing?
            </AlertDialog>
        </DialogTrigger>
    ),
};
