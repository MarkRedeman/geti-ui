import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { TextField } from './TextField';

const renderTextField = (props: Partial<React.ComponentProps<typeof TextField>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <TextField label="Name" {...props} />
        </Provider>
    );

describe('TextField', () => {
    it('renders without crash', () => {
        renderTextField();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderTextField({ label: 'Email' });
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
        const onChange = rstest.fn();
        renderTextField({ onChange });
        await userEvent.type(screen.getByRole('textbox'), 'hello');
        expect(onChange).toHaveBeenCalled();
    });

    it('shows error message when validationState is invalid', () => {
        renderTextField({ validationState: 'invalid', errorMessage: 'Field is required' });
        expect(screen.getByText('Field is required')).toBeInTheDocument();
    });

    it('is disabled when isDisabled is true', () => {
        renderTextField({ isDisabled: true });
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('is read-only when isReadOnly is true', () => {
        renderTextField({ isReadOnly: true, value: 'readonly' });
        expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });
});
