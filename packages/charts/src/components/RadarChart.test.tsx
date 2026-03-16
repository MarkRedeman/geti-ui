import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { RadarChart } from './RadarChart';

const data = [
    { metric: 'Precision', train: 0.92, val: 0.88 },
    { metric: 'Recall', train: 0.89, val: 0.84 },
    { metric: 'F1', train: 0.9, val: 0.86 },
];

describe('RadarChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <RadarChart
                    data={data}
                    categoryKey="metric"
                    series={[
                        { dataKey: 'train', name: 'Train' },
                        { dataKey: 'val', name: 'Validation' },
                    ]}
                    showLegend
                    highlight={{ enabled: true, interaction: { lineHover: true, legendHover: true, legendClick: true } }}
                    aria-label="radar chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'radar chart highlight' })).toBeTruthy();
    });
});
