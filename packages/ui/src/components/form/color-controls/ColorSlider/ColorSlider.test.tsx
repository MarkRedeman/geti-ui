import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorSlider } from './ColorSlider';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

describe('ColorSlider', () => {
    it('renders correctly with a channel', () => {
        render(
            <ThemeProvider>
                <ColorSlider defaultValue="#7f0000" channel="red" label="Red Channel" />
            </ThemeProvider>
        );
        expect(screen.getByRole('slider', { name: 'Red Channel' })).toBeInTheDocument();
    });

    it('shows value label by default', () => {
        render(
            <ThemeProvider>
                <ColorSlider defaultValue="#7f0000" channel="red" label="Red" />
            </ThemeProvider>
        );
        // Spectrum sliders typically render a <label> and an <output>
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
