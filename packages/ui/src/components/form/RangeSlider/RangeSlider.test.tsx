// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { RangeSlider } from './RangeSlider';

const renderRangeSlider = (props: Partial<React.ComponentProps<typeof RangeSlider>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <RangeSlider label="Price range" defaultValue={{ start: 20, end: 80 }} {...props} />
        </Provider>
    );

describe('RangeSlider', () => {
    it('renders without crash', () => {
        renderRangeSlider();
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('displays label', () => {
        renderRangeSlider({ label: 'Temperature range' });
        expect(screen.getByText('Temperature range')).toBeInTheDocument();
    });

    it('renders two slider thumbs', () => {
        renderRangeSlider();
        const sliders = screen.getAllByRole('slider');
        expect(sliders).toHaveLength(2);
    });

    it('is disabled when isDisabled is true', () => {
        renderRangeSlider({ isDisabled: true });
        const sliders = screen.getAllByRole('slider');
        sliders.forEach((slider) => expect(slider).toBeDisabled());
    });
});
