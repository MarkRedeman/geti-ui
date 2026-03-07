// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { TagGroup, Item } from './TagGroup';

const renderTagGroup = () =>
    render(
        <Provider theme={defaultTheme}>
            <TagGroup aria-label="Test tags">
                <Item key="one">Tag One</Item>
                <Item key="two">Tag Two</Item>
                <Item key="three">Tag Three</Item>
            </TagGroup>
        </Provider>
    );

describe('TagGroup', () => {
    it('renders without crash', () => {
        renderTagGroup();
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders tag items', () => {
        renderTagGroup();
        expect(screen.getByText('Tag One')).toBeInTheDocument();
        expect(screen.getByText('Tag Two')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        renderTagGroup();
        expect(screen.getByRole('grid', { name: 'Test tags' })).toBeInTheDocument();
    });
});
