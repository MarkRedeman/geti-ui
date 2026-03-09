import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { ToggleButton } from './ToggleButton';

const renderToggleButton = (props: Partial<React.ComponentProps<typeof ToggleButton>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <ToggleButton {...props}>{props.children ?? 'Toggle'}</ToggleButton>
        </Provider>
    );

describe('ToggleButton', () => {
    it('renders without crash', () => {
        renderToggleButton();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('displays children text', () => {
        renderToggleButton({ children: 'Bold' });
        expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    });

    it('has aria-pressed attribute', () => {
        renderToggleButton({ defaultSelected: false });
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed');
    });

    it('calls onChange when clicked', async () => {
        const onChange = rstest.fn();
        renderToggleButton({ onChange, children: 'Bold' });
        await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
        expect(onChange).toHaveBeenCalledOnce();
    });

    it('does not call onChange when disabled', async () => {
        const onChange = rstest.fn();
        renderToggleButton({ onChange, isDisabled: true, children: 'Bold' });
        await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
        expect(onChange).not.toHaveBeenCalled();
    });
});
