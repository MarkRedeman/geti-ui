import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, rstest } from '@rstest/core';
import userEvent from '@testing-library/user-event';
import { Calendar, RangeCalendar } from './Calendar';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('Calendar', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <Calendar aria-label="Event date" />
            </ThemeProvider>
        );
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('allows selecting a date', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <Calendar aria-label="Event date" onChange={onChange} />
            </ThemeProvider>
        );

        const day = screen.getByRole('button', { name: /15/ });
        await userEvent.click(day);
        expect(onChange).toHaveBeenCalled();
    });
});

describe('RangeCalendar', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <RangeCalendar aria-label="Event range" />
            </ThemeProvider>
        );
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('allows selecting a range', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <RangeCalendar aria-label="Event range" onChange={onChange} />
            </ThemeProvider>
        );

        const day1 = screen.getByRole('button', { name: /15/ });
        const day2 = screen.getByRole('button', { name: /17/ });

        await userEvent.click(day1);
        await userEvent.click(day2);
        expect(onChange).toHaveBeenCalled();
    });
});
