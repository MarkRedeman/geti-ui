// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Loading } from './Loading';

const renderLoading = (props: Partial<React.ComponentProps<typeof Loading>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Loading {...props} />
        </Provider>
    );

describe('Loading', () => {
    it('renders without crash', () => {
        renderLoading({ mode: 'inline' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders in inline mode', () => {
        renderLoading({ mode: 'inline' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders in overlay mode', () => {
        renderLoading({ mode: 'overlay' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders in fullscreen mode', () => {
        renderLoading({ mode: 'fullscreen' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders with accessible label', () => {
        renderLoading({ mode: 'inline' });
        expect(screen.getByRole('progressbar', { name: 'Loading...' })).toBeInTheDocument();
    });
});
