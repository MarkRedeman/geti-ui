import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Button } from '../../ui/Button/Button';
import { TextField } from '../TextField/TextField';
import { Form } from './Form';

const renderForm = (props: Partial<React.ComponentProps<typeof Form>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Form aria-label="Contact form" {...props}>
                <TextField label="First Name" />
                <TextField label="Last Name" />
                <Button type="submit">Submit</Button>
            </Form>
        </Provider>
    );

describe('Form', () => {
    it('renders without crash', () => {
        renderForm();
        // <form> gets role="form" only when it has an accessible name
        expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('renders children inside the form', () => {
        renderForm();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('disables all form controls when isDisabled is true', () => {
        renderForm({ isDisabled: true });
        expect(screen.getByLabelText('First Name')).toBeDisabled();
        expect(screen.getByLabelText('Last Name')).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
});
