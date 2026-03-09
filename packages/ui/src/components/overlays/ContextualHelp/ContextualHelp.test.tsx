import React from 'react';
import { render, screen, act } from '@testing-library/react';
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
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with help variant by default', () => {
        renderContextualHelp('help');
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with info variant', () => {
        renderContextualHelp('info');
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows popover content when button is clicked', async () => {
        renderContextualHelp();
        const button = screen.getByRole('button');
        await act(async () => {
            await userEvent.click(button);
        });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Help title')).toBeInTheDocument();
        expect(screen.getByText('Help body content')).toBeInTheDocument();
    });

    it('closes popover when clicking outside', async () => {
        renderContextualHelp();
        const button = screen.getByRole('button');
        await act(async () => {
            await userEvent.click(button);
        });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await act(async () => {
            await userEvent.click(document.body);
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
