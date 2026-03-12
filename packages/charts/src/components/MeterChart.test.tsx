import { render } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ChartsThemeProvider } from '../primitives/ChartsThemeProvider';
import { MeterChart } from './MeterChart';

describe('MeterChart highlight', () => {
    it('renders with highlight config enabled', () => {
        const { getByRole } = render(
            <ChartsThemeProvider>
                <MeterChart
                    value={67}
                    max={100}
                    highlight={{ enabled: true, interaction: { lineHover: true } }}
                    aria-label="meter chart highlight"
                />
            </ChartsThemeProvider>
        );

        expect(getByRole('img', { name: 'meter chart highlight' })).toBeTruthy();
    });
});
