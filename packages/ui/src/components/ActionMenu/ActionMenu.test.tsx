// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Item, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { ActionMenu } from './ActionMenu';

const renderActionMenu = (props: Partial<React.ComponentProps<typeof ActionMenu>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <ActionMenu aria-label="More actions" {...props}>
                <Item key="edit">Edit</Item>
                <Item key="duplicate">Duplicate</Item>
                <Item key="delete">Delete</Item>
            </ActionMenu>
        </Provider>
    );

describe('ActionMenu', () => {
    it('renders without crash', () => {
        renderActionMenu();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not show menu items initially', () => {
        renderActionMenu();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens menu when trigger button is clicked', async () => {
        renderActionMenu();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('shows menu items when opened', async () => {
        renderActionMenu();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
    });

    it('calls onAction when a menu item is selected', async () => {
        const onAction = rstest.fn();
        renderActionMenu({ onAction });
        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
        expect(onAction).toHaveBeenCalledWith('edit');
    });

    it('is disabled when isDisabled is true', () => {
        renderActionMenu({ isDisabled: true });
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('closes menu after item selection', async () => {
        renderActionMenu();
        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => {
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });
});
