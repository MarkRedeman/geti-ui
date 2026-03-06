// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Skeleton } from './Skeleton';

const renderSkeleton = (props: Partial<React.ComponentProps<typeof Skeleton>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Skeleton {...props} />
        </Provider>
    );

describe('Skeleton', () => {
    it('renders without crash', () => {
        renderSkeleton();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders circle variant', () => {
        renderSkeleton({ isCircle: true, width: 48, height: 48 });
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders rectangle variant', () => {
        renderSkeleton({ width: '100%', height: 24 });
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('applies custom aria-label', () => {
        renderSkeleton({ 'aria-label': 'Loading user profile' });
        expect(screen.getByRole('img', { name: 'Loading user profile' })).toBeInTheDocument();
    });

    it('has aria-busy=true', () => {
        renderSkeleton();
        expect(screen.getByRole('img')).toHaveAttribute('aria-busy', 'true');
    });
});
