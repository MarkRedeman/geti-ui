// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { ProgressBar } from './ProgressBar';

const renderProgressBar = (props: Partial<React.ComponentProps<typeof ProgressBar>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <ProgressBar aria-label="Loading" value={50} {...props} />
        </Provider>
    );

describe('ProgressBar', () => {
    it('renders without crash', () => {
        renderProgressBar();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders with role=progressbar', () => {
        renderProgressBar();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderProgressBar({ label: 'Uploading files' });
        expect(screen.getByText('Uploading files')).toBeInTheDocument();
    });

    it('renders as indeterminate', () => {
        renderProgressBar({ isIndeterminate: true });
        const progressbar = screen.getByRole('progressbar');
        expect(progressbar).toBeInTheDocument();
    });

    it('renders with custom min/max values', () => {
        renderProgressBar({ value: 5, minValue: 0, maxValue: 10 });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
