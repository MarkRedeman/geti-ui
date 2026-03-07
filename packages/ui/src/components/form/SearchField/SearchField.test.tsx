// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { SearchField } from './SearchField';

const renderSearchField = (props: Partial<React.ComponentProps<typeof SearchField>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <SearchField label="Search" {...props} />
        </Provider>
    );

describe('SearchField', () => {
    it('renders without crash', () => {
        renderSearchField();
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderSearchField({ label: 'Find' });
        expect(screen.getByLabelText('Find')).toBeInTheDocument();
    });

    it('accepts typed input', async () => {
        renderSearchField();
        const input = screen.getByRole('searchbox');
        await userEvent.type(input, 'hello');
        expect(input).toHaveValue('hello');
    });

    it('calls onSubmit when Enter is pressed', async () => {
        const onSubmit = rstest.fn();
        renderSearchField({ onSubmit });
        const input = screen.getByRole('searchbox');
        await userEvent.type(input, 'query{enter}');
        expect(onSubmit).toHaveBeenCalledWith('query');
    });

    it('is disabled when isDisabled is true', () => {
        renderSearchField({ isDisabled: true });
        expect(screen.getByRole('searchbox')).toBeDisabled();
    });

    it('shows clear button when there is a value', async () => {
        renderSearchField({ defaultValue: 'some text' });
        expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });
});
