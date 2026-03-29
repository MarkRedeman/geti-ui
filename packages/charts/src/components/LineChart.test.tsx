import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { LineChart } from './LineChart';

const data = [
    { epoch: 1, train: 0.9, val: 1.1 },
    { epoch: 2, train: 0.7, val: 0.95 },
    { epoch: 3, train: 0.55, val: 0.8 },
];

describe('LineChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <LineChart
                    data={data}
                    xAxisKey="epoch"
                    series={[
                        { dataKey: 'train', name: 'Train' },
                        { dataKey: 'val', name: 'Validation' },
                    ]}
                    showLegend
                    highlight={{
                        enabled: true,
                        interaction: { lineHover: true, legendHover: true, legendClick: true },
                    }}
                    aria-label="line chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'line chart highlight' })).toBeTruthy();
    });
});
