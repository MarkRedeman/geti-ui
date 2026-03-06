// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { ListBox, Item } from './ListBox';

const renderListBox = (selectionMode?: 'none' | 'single' | 'multiple') =>
    render(
        <Provider theme={defaultTheme}>
            <ListBox aria-label="Test listbox" selectionMode={selectionMode} width="size-2400">
                <Item key="one">Option One</Item>
                <Item key="two">Option Two</Item>
                <Item key="three">Option Three</Item>
            </ListBox>
        </Provider>
    );

describe('ListBox', () => {
    it('renders without crash', () => {
        renderListBox();
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('renders options', () => {
        renderListBox();
        expect(screen.getByText('Option One')).toBeInTheDocument();
        expect(screen.getByText('Option Two')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        renderListBox();
        expect(screen.getByRole('listbox', { name: 'Test listbox' })).toBeInTheDocument();
    });

    it('renders with single selection mode', () => {
        renderListBox('single');
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('renders with multiple selection mode', () => {
        renderListBox('multiple');
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
});
