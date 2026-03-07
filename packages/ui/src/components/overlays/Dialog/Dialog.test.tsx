// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Content, Divider, Heading, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Dialog } from './Dialog';
import { DialogTrigger } from './DialogTrigger';

const renderDialog = () =>
    render(
        <Provider theme={defaultTheme}>
            <DialogTrigger>
                <Button variant="accent">Open dialog</Button>
                {(close) => (
                    <Dialog>
                        <Heading>Test dialog</Heading>
                        <Divider />
                        <Content>Dialog body content</Content>
                        <Button variant="secondary" onPress={close}>
                            Close
                        </Button>
                    </Dialog>
                )}
            </DialogTrigger>
        </Provider>
    );

describe('Dialog', () => {
    it('renders the trigger without crash', () => {
        renderDialog();
        expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
    });

    it('does not show dialog content initially', () => {
        renderDialog();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows dialog when trigger is clicked', async () => {
        renderDialog();
        await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog body content')).toBeInTheDocument();
    });

    it('shows dialog heading', async () => {
        renderDialog();
        await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByText('Test dialog')).toBeInTheDocument();
    });

    it('closes dialog when close button is pressed', async () => {
        renderDialog();
        await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});
