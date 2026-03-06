// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { Card } from './Card';

const renderCard = (props: Partial<React.ComponentProps<typeof Card>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Card aria-label="Test card" {...props}>
                {props.children ?? <span>Card Content</span>}
            </Card>
        </Provider>
    );

describe('Card', () => {
    it('renders without crash', () => {
        renderCard();
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('renders children content', () => {
        renderCard({ children: <span>Custom Content</span> });
        expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('renders as article when non-interactive', () => {
        renderCard();
        expect(screen.getByRole('article', { name: 'Test card' })).toBeInTheDocument();
    });

    it('renders as button when onPress is provided', () => {
        renderCard({ onPress: rstest.fn() });
        expect(screen.getByRole('button', { name: 'Test card' })).toBeInTheDocument();
    });

    it('calls onPress when interactive card is clicked', async () => {
        const onPress = rstest.fn();
        renderCard({ onPress });
        await userEvent.click(screen.getByRole('button', { name: 'Test card' }));
        expect(onPress).toHaveBeenCalledOnce();
    });

    it('does not call onPress when disabled', async () => {
        const onPress = rstest.fn();
        renderCard({ onPress, isDisabled: true });
        await userEvent.click(screen.getByRole('button', { name: 'Test card' }));
        expect(onPress).not.toHaveBeenCalled();
    });

    it('shows aria-pressed when selected', () => {
        renderCard({ onPress: rstest.fn(), isSelected: true });
        expect(screen.getByRole('button', { name: 'Test card' })).toHaveAttribute('aria-pressed', 'true');
    });
});
