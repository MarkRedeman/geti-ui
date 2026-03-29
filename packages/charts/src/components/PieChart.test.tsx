import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { PieChart } from './PieChart';

const data = [
    { name: 'Train', value: 62 },
    { name: 'Validation', value: 24 },
    { name: 'Test', value: 14 },
];

describe('PieChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <PieChart
                    data={data}
                    showLegend
                    highlight={{
                        enabled: true,
                        interaction: { lineHover: true, legendHover: true, legendClick: true },
                    }}
                    aria-label="pie chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'pie chart highlight' })).toBeTruthy();
    });
});
