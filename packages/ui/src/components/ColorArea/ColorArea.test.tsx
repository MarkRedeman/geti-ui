import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorArea } from './ColorArea';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('ColorArea', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <ColorArea defaultValue="#7f0000" aria-label="Color Area" />
            </ThemeProvider>
        );
        // ColorArea contains a slider with role "slider" for each axis
        const sliders = screen.getAllByRole('slider');
        expect(sliders.length).toBeGreaterThan(0);
        expect(screen.getByRole('group', { name: /Color Area/i })).toBeInTheDocument();
    });

    it('handles custom size', () => {
        render(
            <ThemeProvider>
                <ColorArea defaultValue="#7f0000" size={300} aria-label="Large Area" />
            </ThemeProvider>
        );
        const area = screen.getByRole('group', { name: /Large Area/i });
        expect(area).toBeInTheDocument();
    });
});
