import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { BarChart } from './BarChart';

const data = [
    { model: 'A', train: 0.9, val: 1.1 },
    { model: 'B', train: 0.7, val: 0.95 },
    { model: 'C', train: 0.55, val: 0.8 },
];

describe('BarChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <BarChart
                    data={data}
                    xAxisKey="model"
                    series={[
                        { dataKey: 'train', name: 'Train' },
                        { dataKey: 'val', name: 'Validation' },
                    ]}
                    showLegend
                    highlight={{ enabled: true, interaction: { lineHover: true, legendHover: true, legendClick: true } }}
                    aria-label="bar chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'bar chart highlight' })).toBeTruthy();
    });
});
