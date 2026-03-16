import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { DonutChart } from './DonutChart';

const data = [
    { name: 'Train', value: 62 },
    { name: 'Validation', value: 24 },
    { name: 'Test', value: 14 },
];

describe('DonutChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <DonutChart
                    data={data}
                    showLegend
                    highlight={{ enabled: true, interaction: { lineHover: true, legendHover: true, legendClick: true } }}
                    aria-label="donut chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'donut chart highlight' })).toBeTruthy();
    });
});
