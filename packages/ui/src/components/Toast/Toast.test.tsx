// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Button } from '../Button/Button';
import { ToastContainer, toast } from './Toast';

const renderToast = () =>
    render(
        <Provider theme={defaultTheme}>
            <ToastContainer placement="bottom" />
            <Button variant="accent" onPress={() => toast.positive('Saved successfully!')}>
                Save
            </Button>
        </Provider>
    );

describe('Toast', () => {
    it('renders ToastContainer without crash', () => {
        render(
            <Provider theme={defaultTheme}>
                <ToastContainer />
            </Provider>
        );
        // ToastContainer renders a region when toasts are present; no crash expected
        expect(document.body).toBeInTheDocument();
    });

    it('shows a positive toast when triggered', async () => {
        renderToast();
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(await screen.findByText('Saved successfully!')).toBeInTheDocument();
    });
});
