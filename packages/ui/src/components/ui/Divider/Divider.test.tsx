// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Divider } from './Divider';

const renderDivider = (props: Partial<React.ComponentProps<typeof Divider>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Divider {...props} />
        </Provider>
    );

describe('Divider', () => {
    it('renders without crash', () => {
        renderDivider();
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders with role=separator', () => {
        renderDivider();
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders horizontal orientation', () => {
        renderDivider({ orientation: 'horizontal' });
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders vertical orientation', () => {
        renderDivider({ orientation: 'vertical' });
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders with size S', () => {
        renderDivider({ size: 'S' });
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders with size L', () => {
        renderDivider({ size: 'L' });
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });
});
