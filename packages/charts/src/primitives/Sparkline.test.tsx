import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { Sparkline } from './Sparkline';
import { ChartsThemeProvider } from './ChartsThemeProvider';

const sampleData = [
    { value: 10 },
    { value: 25 },
    { value: 15 },
    { value: 40 },
    { value: 30 },
];

const renderSparkline = (props: Partial<React.ComponentProps<typeof Sparkline>> = {}) =>
    render(
        <ChartsThemeProvider>
            <Sparkline data={sampleData} {...props} />
        </ChartsThemeProvider>
    );

describe('Sparkline', () => {
    it('renders without crash', () => {
        renderSparkline();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('uses default aria-label when none provided', () => {
        renderSparkline();
        expect(screen.getByRole('img', { name: 'Sparkline chart' })).toBeInTheDocument();
    });

    it('accepts custom aria-label', () => {
        renderSparkline({ 'aria-label': 'Revenue trend' });
        expect(screen.getByRole('img', { name: 'Revenue trend' })).toBeInTheDocument();
    });

    it('renders with a custom color without crashing', () => {
        renderSparkline({ color: '#ff0000' });
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders with animate=true without crashing', () => {
        renderSparkline({ animate: true });
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders with filled=true without crashing', () => {
        renderSparkline({ filled: true });
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders with custom dataKey', () => {
        const customData = [{ score: 5 }, { score: 8 }, { score: 6 }];
        render(
            <ChartsThemeProvider>
                <Sparkline data={customData} dataKey="score" aria-label="Score sparkline" />
            </ChartsThemeProvider>
        );
        expect(screen.getByRole('img', { name: 'Score sparkline' })).toBeInTheDocument();
    });

    it('renders inside a theme provider that overrides color', () => {
        render(
            <ChartsThemeProvider theme={{ dataColors: ['#abcdef', '#fedcba', '#123456'] }}>
                <Sparkline data={sampleData} aria-label="themed" />
            </ChartsThemeProvider>
        );
        expect(screen.getByRole('img', { name: 'themed' })).toBeInTheDocument();
    });
});
