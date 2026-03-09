import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Item, Provider, Text, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { ActionBar, ActionBarContainer } from './ActionBar';
import { ListView } from '../ListView/ListView';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Renders ActionBar inside an ActionBarContainer with a minimal ListView.
 * ActionBar visibility is driven by selectedItemCount — a non-zero value
 * causes the bar to appear in the DOM.
 */
const renderActionBar = (props: Partial<React.ComponentProps<typeof ActionBar>> = {}, selectedItemCount = 2) =>
    render(
        <Provider theme={defaultTheme}>
            <ActionBarContainer height="size-3000">
                <ListView aria-label="Test list" selectionMode="multiple" width="size-3000">
                    <Item key="1">Item One</Item>
                    <Item key="2">Item Two</Item>
                    <Item key="3">Item Three</Item>
                </ListView>
                <ActionBar selectedItemCount={selectedItemCount} onClearSelection={() => {}} {...props}>
                    <Item key="edit">
                        <Text>Edit</Text>
                    </Item>
                    <Item key="delete">
                        <Text>Delete</Text>
                    </Item>
                </ActionBar>
            </ActionBarContainer>
        </Provider>
    );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ActionBar', () => {
    // --- Rendering ---

    it('renders without crash when selectedItemCount is non-zero', () => {
        renderActionBar();
        // ActionBarContainer renders to the DOM; verify the list is present
        expect(screen.getByRole('grid', { name: 'Test list' })).toBeInTheDocument();
    });

    it('shows action items when selectedItemCount > 0', () => {
        renderActionBar();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('hides action bar items when selectedItemCount is 0', () => {
        renderActionBar({}, 0);
        // The Spectrum ActionBar collapses when nothing is selected
        expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    });

    it('renders action button labels as text', () => {
        renderActionBar();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    // --- Interaction ---

    it('calls onAction with the correct key when an action button is pressed', async () => {
        const onAction = rstest.fn();
        renderActionBar({ onAction });
        await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
        expect(onAction).toHaveBeenCalledWith('edit');
    });

    it('calls onAction with delete key when delete button is pressed', async () => {
        const onAction = rstest.fn();
        renderActionBar({ onAction });
        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(onAction).toHaveBeenCalledWith('delete');
    });

    it('calls onClearSelection when the clear button is activated', async () => {
        const onClearSelection = rstest.fn();
        renderActionBar({ onClearSelection });
        // Spectrum renders a clear / dismiss button in the ActionBar
        const clearButton = screen.getByRole('button', { name: /clear|dismiss/i });
        await userEvent.click(clearButton);
        expect(onClearSelection).toHaveBeenCalledOnce();
    });

    // --- ActionBarContainer ---

    it('ActionBarContainer renders without crash', () => {
        renderActionBar();
        // The container itself wraps the list grid
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });
});
