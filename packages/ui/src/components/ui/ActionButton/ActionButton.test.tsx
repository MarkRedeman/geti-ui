import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { ActionButton } from './ActionButton';
import type { ActionButtonColorVariant } from './ActionButton';

const renderActionButton = (props: Partial<React.ComponentProps<typeof ActionButton>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <ActionButton {...props}>{props.children ?? 'Action'}</ActionButton>
        </Provider>
    );

describe('ActionButton', () => {
    it('renders without crash', () => {
        renderActionButton();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('displays children text', () => {
        renderActionButton({ children: 'Edit' });
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('calls onPress when clicked', async () => {
        const onPress = rstest.fn();
        renderActionButton({ onPress, children: 'Edit' });
        await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
        expect(onPress).toHaveBeenCalledOnce();
    });

    it('does not call onPress when disabled', async () => {
        const onPress = rstest.fn();
        renderActionButton({ onPress, isDisabled: true, children: 'Edit' });
        await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
        expect(onPress).not.toHaveBeenCalled();
    });

    it.each<ActionButtonColorVariant>(['dark', 'light', 'blue'])(
        'renders without crash with colorVariant=%s',
        (colorVariant) => {
            renderActionButton({ colorVariant, children: 'Edit' });
            expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        }
    );
});
