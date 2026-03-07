import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorSwatch } from './ColorSwatch';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

describe('ColorSwatch', () => {
    it('renders a color swatch with the correct background color', () => {
        render(
            <ThemeProvider>
                <ColorSwatch color="#ff0000" aria-label="Red swatch" />
            </ThemeProvider>
        );
        const swatch = screen.getByRole('img');
        expect(swatch).toBeInTheDocument();
        expect(swatch.getAttribute('aria-label')).toMatch(/Red swatch/i);
    });

    it('handles different sizes', () => {
        const { rerender } = render(
            <ThemeProvider>
                <ColorSwatch color="#ff0000" size="S" aria-label="Small" />
            </ThemeProvider>
        );
        expect(screen.getByRole('img')).toBeInTheDocument();

        rerender(
            <ThemeProvider>
                <ColorSwatch color="#ff0000" size="L" aria-label="Large" />
            </ThemeProvider>
        );
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
