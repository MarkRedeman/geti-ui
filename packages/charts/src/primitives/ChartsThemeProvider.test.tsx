import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ChartsThemeProvider } from './ChartsThemeProvider';
import { defaultGetiChartTheme } from '../theming/tokens';

describe('ChartsThemeProvider', () => {
    it('renders children without crash', () => {
        render(
            <ChartsThemeProvider>
                <div>Chart content</div>
            </ChartsThemeProvider>
        );
        expect(screen.getByText('Chart content')).toBeInTheDocument();
    });

    it('renders with custom theme overrides', () => {
        render(
            <ChartsThemeProvider theme={{ dataColors: ['#ff0000', '#00ff00', '#0000ff'] }}>
                <div>Themed chart</div>
            </ChartsThemeProvider>
        );
        expect(screen.getByText('Themed chart')).toBeInTheDocument();
    });

    it('renders with nested providers (innermost wins)', () => {
        render(
            <ChartsThemeProvider theme={{ backgroundColor: '#111' }}>
                <ChartsThemeProvider theme={{ backgroundColor: '#222' }}>
                    <div>Nested</div>
                </ChartsThemeProvider>
            </ChartsThemeProvider>
        );
        expect(screen.getByText('Nested')).toBeInTheDocument();
    });

    it('uses default theme when no theme prop is provided', () => {
        // Default colors should be the defaultGetiChartTheme colors
        expect(defaultGetiChartTheme.dataColors.length).toBeGreaterThan(0);
        expect(defaultGetiChartTheme.backgroundColor).toBeDefined();
    });

    it('accepts partial theme overrides without errors', () => {
        const render1 = () =>
            render(
                <ChartsThemeProvider theme={{ typography: { fontSize: 14 } }}>
                    <span>ok</span>
                </ChartsThemeProvider>
            );
        expect(render1).not.toThrow();
    });
});
