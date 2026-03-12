import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { ScatterChart } from './ScatterChart';

const pointsA = [
    { x: 0.1, y: 0.9 },
    { x: 0.2, y: 0.8 },
    { x: 0.3, y: 0.7 },
];

const pointsB = [
    { x: 0.15, y: 0.85 },
    { x: 0.25, y: 0.75 },
    { x: 0.35, y: 0.65 },
];

describe('ScatterChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <ScatterChart
                    series={[
                        { name: 'Train', data: pointsA },
                        { name: 'Validation', data: pointsB },
                    ]}
                    showLegend
                    highlight={{
                        enabled: true,
                        interaction: { lineHover: true, legendHover: true, legendClick: true, voronoi: true },
                    }}
                    aria-label="scatter chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'scatter chart highlight' })).toBeTruthy();
    });
});
