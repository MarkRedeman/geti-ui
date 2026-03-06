// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { ListView, Item } from './ListView';

const renderListView = () =>
    render(
        <Provider theme={defaultTheme}>
            <ListView aria-label="Test list" selectionMode="single" width="size-3000">
                <Item key="1">Item One</Item>
                <Item key="2">Item Two</Item>
                <Item key="3">Item Three</Item>
            </ListView>
        </Provider>
    );

describe('ListView', () => {
    it('renders without crash', () => {
        renderListView();
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders list items', () => {
        renderListView();
        expect(screen.getByText('Item One')).toBeInTheDocument();
        expect(screen.getByText('Item Two')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        renderListView();
        expect(screen.getByRole('grid', { name: 'Test list' })).toBeInTheDocument();
    });
});
