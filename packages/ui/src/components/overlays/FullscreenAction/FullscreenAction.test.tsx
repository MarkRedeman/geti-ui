import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FullscreenAction } from './FullscreenAction';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { ReactNode } from 'react';
import { describe, it, expect } from '@rstest/core';
import '@testing-library/jest-dom';

const renderWithTheme = (ui: ReactNode) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('FullscreenAction', () => {
    it('renders the trigger button', () => {
        renderWithTheme(
            <FullscreenAction title="Test Title">
                <div>Content</div>
            </FullscreenAction>
        );

        const trigger = screen.getByRole('button', { name: /Open in fullscreen Test Title/i });
        expect(trigger).toBeInTheDocument();
    });

    it('opens the dialog when clicked', async () => {
        renderWithTheme(
            <FullscreenAction title="Test Title">
                <div data-testid="fullscreen-content">Immersive Content</div>
            </FullscreenAction>
        );

        const trigger = screen.getByRole('button', { name: /Open in fullscreen Test Title/i });
        await userEvent.click(trigger);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText('Immersive Content')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
    });

    it('closes the dialog when the collapse button is clicked', async () => {
        renderWithTheme(
            <FullscreenAction title="Test Title">
                <div>Content</div>
            </FullscreenAction>
        );

        // Open
        await userEvent.click(screen.getByRole('button'));

        // Close
        const closeButton = screen.getByRole('button', { name: /Close fullscreen/i });
        await userEvent.click(closeButton);

        // Check if dialog is gone
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('renders an action button in the header', async () => {
        const actionButton = <button>Custom Header Action</button>;
        renderWithTheme(
            <FullscreenAction title="Test Title" actionButton={actionButton}>
                <div>Content</div>
            </FullscreenAction>
        );

        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button', { name: 'Custom Header Action' })).toBeInTheDocument();
    });
});
