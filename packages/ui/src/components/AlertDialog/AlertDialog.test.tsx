// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { AlertDialog } from './AlertDialog';
import { DialogTrigger } from '../Dialog/DialogTrigger';

const renderAlertDialog = ({
    onPrimaryAction = rstest.fn(),
    onCancel = rstest.fn(),
    onSecondaryAction,
}: {
    onPrimaryAction?: ReturnType<typeof rstest.fn>;
    onCancel?: ReturnType<typeof rstest.fn>;
    onSecondaryAction?: ReturnType<typeof rstest.fn>;
} = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <DialogTrigger>
                <Button variant="accent">Open alert</Button>
                <AlertDialog
                    variant="confirmation"
                    title="Confirm action"
                    primaryActionLabel="Confirm"
                    cancelLabel="Cancel"
                    secondaryActionLabel={onSecondaryAction ? 'Secondary' : undefined}
                    onPrimaryAction={onPrimaryAction}
                    onCancel={onCancel}
                    onSecondaryAction={onSecondaryAction}
                >
                    Are you sure you want to proceed?
                </AlertDialog>
            </DialogTrigger>
        </Provider>
    );

describe('AlertDialog', () => {
    it('renders the trigger without crash', () => {
        renderAlertDialog();
        expect(screen.getByRole('button', { name: 'Open alert' })).toBeInTheDocument();
    });

    it('does not show dialog content initially', () => {
        renderAlertDialog();
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('shows alert dialog when trigger is clicked', async () => {
        renderAlertDialog();
        await userEvent.click(screen.getByRole('button', { name: 'Open alert' }));
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    it('calls onPrimaryAction when primary button is pressed', async () => {
        const onPrimaryAction = rstest.fn();
        renderAlertDialog({ onPrimaryAction });
        await userEvent.click(screen.getByRole('button', { name: 'Open alert' }));
        await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        expect(onPrimaryAction).toHaveBeenCalledOnce();
    });

    it('calls onCancel when cancel button is pressed', async () => {
        const onCancel = rstest.fn();
        renderAlertDialog({ onCancel });
        await userEvent.click(screen.getByRole('button', { name: 'Open alert' }));
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onCancel).toHaveBeenCalledOnce();
    });

    it('calls onSecondaryAction when secondary button is pressed', async () => {
        const onSecondaryAction = rstest.fn();
        renderAlertDialog({ onSecondaryAction });
        await userEvent.click(screen.getByRole('button', { name: 'Open alert' }));
        await userEvent.click(screen.getByRole('button', { name: 'Secondary' }));
        expect(onSecondaryAction).toHaveBeenCalledOnce();
    });
});
