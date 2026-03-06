// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { PasswordField } from './PasswordField';

const renderPasswordField = (props: Partial<React.ComponentProps<typeof PasswordField>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <PasswordField label="Password" {...props} />
        </Provider>
    );

describe('PasswordField', () => {
    it('renders without crash', () => {
        renderPasswordField();
        // Spectrum TextField renders an input with type=password
        const input = screen.getByLabelText('Password');
        expect(input).toBeInTheDocument();
    });

    it('toggle button is present', () => {
        renderPasswordField();
        expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('clicking toggle changes input from password to text', async () => {
        renderPasswordField();
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('type', 'password');

        await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
        expect(input).toHaveAttribute('type', 'text');

        await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
        expect(input).toHaveAttribute('type', 'password');
    });

    it('displays error message when error prop is set', () => {
        renderPasswordField({ error: 'Invalid password' });
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid password');
    });

    it('displays hint when isNewPassword is true', () => {
        renderPasswordField({ isNewPassword: true });
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('accepts onChange prop without error', async () => {
        const onChange = rstest.fn();
        renderPasswordField({ onChange });
        const input = screen.getByLabelText('Password');
        await userEvent.type(input, 'abc');
        expect(onChange).toHaveBeenCalled();
    });
});
