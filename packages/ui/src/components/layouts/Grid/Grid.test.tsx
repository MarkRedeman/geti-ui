// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Grid } from './Grid';

const renderGrid = (props: Partial<React.ComponentProps<typeof Grid>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Grid columns="repeat(2, 1fr)" gap="size-200" {...props}>
                {props.children ?? (
                    <>
                        <span>Cell One</span>
                        <span>Cell Two</span>
                    </>
                )}
            </Grid>
        </Provider>
    );

describe('Grid', () => {
    it('renders without crash', () => {
        renderGrid();
        expect(screen.getByText('Cell One')).toBeInTheDocument();
        expect(screen.getByText('Cell Two')).toBeInTheDocument();
    });

    it('renders children', () => {
        renderGrid({ children: <span>Grid Item</span> });
        expect(screen.getByText('Grid Item')).toBeInTheDocument();
    });

    it('renders multiple children in a grid', () => {
        renderGrid({
            columns: 'repeat(3, 1fr)',
            children: (
                <>
                    <span>A</span>
                    <span>B</span>
                    <span>C</span>
                </>
            ),
        });
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
    });
});
