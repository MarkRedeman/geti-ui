import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { DatePicker } from './DatePicker';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('DatePicker', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <DatePicker label="Event date" />
            </ThemeProvider>
        );
        expect(screen.getByRole('group', { name: 'Event date' })).toBeInTheDocument();
    });
});
