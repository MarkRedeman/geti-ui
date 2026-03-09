import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonGroup, Content, Divider, Heading, Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { Dialog } from '../Dialog/Dialog';
import { DialogContainer } from './DialogContainer';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ControlledDialogContainerProps {
    initialOpen?: boolean;
    isDismissable?: boolean;
    onDismiss?: () => void;
}

/**
 * A small stateful wrapper that drives DialogContainer's open/close cycle
 * in the same way the stories do (controlling a boolean flag passed as a child).
 */
const ControlledDialogContainer = ({
    initialOpen = false,
    isDismissable = false,
    onDismiss,
}: ControlledDialogContainerProps) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const handleDismiss = () => {
        setIsOpen(false);
        onDismiss?.();
    };

    return (
        <Provider theme={defaultTheme}>
            <Button variant="accent" onPress={() => setIsOpen(true)}>
                Open dialog
            </Button>
            <DialogContainer isDismissable={isDismissable} onDismiss={handleDismiss}>
                {isOpen && (
                    <Dialog>
                        <Heading>Test dialog</Heading>
                        <Divider />
                        <Content>Dialog body content</Content>
                        <ButtonGroup>
                            <Button variant="secondary" onPress={handleDismiss}>
                                Close
                            </Button>
                        </ButtonGroup>
                    </Dialog>
                )}
            </DialogContainer>
        </Provider>
    );
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DialogContainer', () => {
    it('renders without crash', () => {
        render(<ControlledDialogContainer />);
        expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
    });

    it('does not render a dialog when child is null', () => {
        render(
            <Provider theme={defaultTheme}>
                <DialogContainer onDismiss={() => {}}>
                    {/* no child — dialog should not be present */}
                    {null}
                </DialogContainer>
            </Provider>
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not render dialog content initially when open flag is false', () => {
        render(<ControlledDialogContainer initialOpen={false} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog when open flag is true', () => {
        render(<ControlledDialogContainer initialOpen={true} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('shows dialog content after trigger button is pressed', async () => {
        render(<ControlledDialogContainer />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog body content')).toBeInTheDocument();
    });

    it('shows dialog heading after opening', async () => {
        render(<ControlledDialogContainer />);

        await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByText('Test dialog')).toBeInTheDocument();
    });

    it('hides dialog after close button is pressed', async () => {
        render(<ControlledDialogContainer />);

        await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('calls onDismiss when the close button is pressed', async () => {
        const onDismiss = rstest.fn();
        render(<ControlledDialogContainer onDismiss={onDismiss} />);

        await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));

        await waitFor(() => {
            expect(onDismiss).toHaveBeenCalledOnce();
        });
    });

    it('dismisses on Escape key when isDismissable is true', async () => {
        const onDismiss = rstest.fn();
        render(<ControlledDialogContainer initialOpen={true} isDismissable onDismiss={onDismiss} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');

        await waitFor(() => {
            expect(onDismiss).toHaveBeenCalledOnce();
        });
    });

    it('can be opened and closed multiple times', async () => {
        render(<ControlledDialogContainer />);

        for (let i = 0; i < 2; i++) {
            await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await userEvent.click(screen.getByRole('button', { name: 'Close' }));
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            });
        }
    });
});
