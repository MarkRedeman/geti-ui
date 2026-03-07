// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Meter } from './Meter';

const renderMeter = (props: Partial<React.ComponentProps<typeof Meter>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Meter label="Storage" value={50} {...props} />
        </Provider>
    );

describe('Meter', () => {
    it('renders without crash', () => {
        renderMeter();
        expect(screen.getByRole('meter')).toBeInTheDocument();
    });

    it('renders with role=meter', () => {
        renderMeter();
        expect(screen.getByRole('meter')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderMeter({ label: 'Disk usage' });
        expect(screen.getByText('Disk usage')).toBeInTheDocument();
    });

    it('renders positive variant', () => {
        renderMeter({ variant: 'positive' });
        expect(screen.getByRole('meter')).toBeInTheDocument();
    });

    it('renders critical variant', () => {
        renderMeter({ variant: 'critical' });
        expect(screen.getByRole('meter')).toBeInTheDocument();
    });
});
