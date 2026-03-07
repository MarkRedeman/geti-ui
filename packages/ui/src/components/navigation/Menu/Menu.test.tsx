// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButton, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Item } from './Item';
import { Menu } from './Menu';
import { MenuTrigger } from './MenuTrigger';

const renderMenu = () =>
    render(
        <Provider theme={defaultTheme}>
            <MenuTrigger>
                <ActionButton>Open menu</ActionButton>
                <Menu>
                    <Item key="cut">Cut</Item>
                    <Item key="copy">Copy</Item>
                    <Item key="paste">Paste</Item>
                </Menu>
            </MenuTrigger>
        </Provider>
    );

describe('Menu', () => {
    it('renders the trigger without crash', () => {
        renderMenu();
        expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    });

    it('does not show menu items initially', () => {
        renderMenu();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens menu when trigger is clicked', async () => {
        renderMenu();
        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('shows menu items when open', async () => {
        renderMenu();
        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        expect(screen.getByRole('menuitem', { name: 'Cut' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument();
    });

    it('closes menu when an item is selected', async () => {
        renderMenu();
        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
        await waitFor(() => {
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });
});
