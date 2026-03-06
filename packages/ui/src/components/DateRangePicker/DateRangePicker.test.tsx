import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { DateRangePicker } from './DateRangePicker';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('DateRangePicker', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <DateRangePicker label="Event range" />
            </ThemeProvider>
        );
        expect(screen.getByRole('group', { name: 'Event range' })).toBeInTheDocument();
    });
});
