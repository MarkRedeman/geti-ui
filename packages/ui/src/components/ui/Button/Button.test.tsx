import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { Button } from './Button';

const renderButton = (props: Partial<React.ComponentProps<typeof Button>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Button {...props}>{props.children ?? 'Test'}</Button>
        </Provider>
    );

describe('Button', () => {
    it('renders without crash', () => {
        renderButton();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('displays children text', () => {
        renderButton({ children: 'Save' });
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('calls onPress when clicked', async () => {
        const onPress = rstest.fn();
        renderButton({ onPress, children: 'Save' });
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(onPress).toHaveBeenCalledOnce();
    });

    it('does not call onPress when disabled', async () => {
        const onPress = rstest.fn();
        renderButton({ onPress, isDisabled: true, children: 'Save' });
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(onPress).not.toHaveBeenCalled();
    });

    it('renders as link when href is provided', () => {
        renderButton({ href: 'https://docs.example.com', children: 'Docs' });
        const anchorButton = screen.getByRole('button', { name: 'Docs' });
        expect(anchorButton.tagName).toBe('A');
        expect(anchorButton.getAttribute('href')).toBe('https://docs.example.com');
    });
});
