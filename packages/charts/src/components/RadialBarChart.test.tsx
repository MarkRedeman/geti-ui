import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { RadialBarChart } from './RadialBarChart';

const data = [
    { name: 'Train', value: 62 },
    { name: 'Validation', value: 24 },
    { name: 'Test', value: 14 },
];

describe('RadialBarChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <RadialBarChart
                    data={data}
                    showLegend
                    highlight={{
                        enabled: true,
                        interaction: { lineHover: true, legendHover: true, legendClick: true },
                    }}
                    aria-label="radial bar chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'radial bar chart highlight' })).toBeTruthy();
    });
});
