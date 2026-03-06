// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Item, Picker } from './Picker';

const renderPicker = (props: Partial<React.ComponentProps<typeof Picker>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Picker label="Framework" {...props}>
                <Item key="react">React</Item>
                <Item key="vue">Vue</Item>
                <Item key="angular">Angular</Item>
            </Picker>
        </Provider>
    );

describe('Picker', () => {
    it('renders without crash', () => {
        renderPicker();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderPicker({ label: 'Choose' });
        // Label text appears in both a visible span and a hidden select — use getAllByText
        expect(screen.getAllByText('Choose')[0]).toBeInTheDocument();
    });

    it('opens dropdown on click', async () => {
        renderPicker();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('shows options when open', async () => {
        renderPicker();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
    });

    it('is disabled when isDisabled is true', () => {
        renderPicker({ isDisabled: true });
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
