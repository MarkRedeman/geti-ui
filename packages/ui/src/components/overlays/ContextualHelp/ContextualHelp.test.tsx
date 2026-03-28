import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme, Content, Heading } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { ContextualHelp } from './ContextualHelp';

const renderContextualHelp = (variant?: 'help' | 'info') =>
    render(
        <Provider theme={defaultTheme}>
            <ContextualHelp variant={variant}>
                <Heading>Help title</Heading>
                <Content>Help body content</Content>
            </ContextualHelp>
        </Provider>
    );

describe('ContextualHelp', () => {
    it('renders the help icon button without crash', () => {
        renderContextualHelp();
        expect(screen.getByRole('button')).not.toBeNull();
    });

    it('renders with help variant by default', () => {
        renderContextualHelp('help');
        expect(screen.getByRole('button')).not.toBeNull();
    });

    it('renders with info variant', () => {
        renderContextualHelp('info');
        expect(screen.getByRole('button')).not.toBeNull();
    });

    it('shows popover content when button is clicked', async () => {
        renderContextualHelp();
        const button = screen.getByRole('button');
        await userEvent.click(button);
        expect(screen.getByRole('dialog')).not.toBeNull();
        expect(screen.getByText('Help title')).not.toBeNull();
        expect(screen.getByText('Help body content')).not.toBeNull();
    });

    it('closes popover when dismiss button is clicked', async () => {
        renderContextualHelp();
        const button = screen.getByRole('button');
        await userEvent.click(button);
        expect(screen.getByRole('dialog')).not.toBeNull();

        await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });
});
