// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Breadcrumbs } from './Breadcrumbs';
import { Item } from './Item';

const renderBreadcrumbs = () =>
    render(
        <Provider theme={defaultTheme}>
            <Breadcrumbs>
                <Item key="home" href="/">
                    Home
                </Item>
                <Item key="products" href="/products">
                    Products
                </Item>
                <Item key="current">Current Page</Item>
            </Breadcrumbs>
        </Provider>
    );

describe('Breadcrumbs', () => {
    it('renders without crash', () => {
        renderBreadcrumbs();
        expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders breadcrumb navigation landmark', () => {
        renderBreadcrumbs();
        expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeInTheDocument();
    });

    it('renders the current page item', () => {
        renderBreadcrumbs();
        // The last item (current page) is always visible with role=link and aria-current=page
        const currentPage = screen.getByRole('link', { name: 'Current Page' });
        expect(currentPage).toBeInTheDocument();
        expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('renders list items within the breadcrumb', () => {
        renderBreadcrumbs();
        // At least one listitem is rendered
        const items = screen.getAllByRole('listitem');
        expect(items.length).toBeGreaterThanOrEqual(1);
    });
});
