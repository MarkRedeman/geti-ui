// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButton, Content, Dialog, Heading, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Popover } from './Popover';

const renderPopover = () =>
    render(
        <Provider theme={defaultTheme}>
            <Popover>
                <ActionButton>Open popover</ActionButton>
                <Dialog>
                    <Heading>Popover title</Heading>
                    <Content>Popover body content</Content>
                </Dialog>
            </Popover>
        </Provider>
    );

describe('Popover', () => {
    it('renders the trigger without crash', () => {
        renderPopover();
        expect(screen.getByRole('button', { name: 'Open popover' })).toBeInTheDocument();
    });

    it('does not show popover content initially', () => {
        renderPopover();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows popover content when trigger is clicked', async () => {
        renderPopover();
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Popover body content')).toBeInTheDocument();
    });

    it('closes popover when clicking outside', async () => {
        renderPopover();
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await userEvent.click(document.body);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});
