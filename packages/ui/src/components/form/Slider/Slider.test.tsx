// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Slider } from './Slider';

const renderSlider = (props: Partial<React.ComponentProps<typeof Slider>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Slider label="Test Slider" {...props} />
        </Provider>
    );

describe('Slider', () => {
    it('renders without crash', () => {
        renderSlider();
        // Spectrum Slider renders a group with a slider role inside
        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('displays label text', () => {
        renderSlider({ label: 'Opacity' });
        expect(screen.getByText('Opacity')).toBeInTheDocument();
    });

    it('accepts isFilled prop without error', () => {
        renderSlider({ isFilled: true, defaultValue: 50 });
        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('is disabled when isDisabled is true', () => {
        renderSlider({ isDisabled: true });
        expect(screen.getByRole('slider')).toBeDisabled();
    });
});
