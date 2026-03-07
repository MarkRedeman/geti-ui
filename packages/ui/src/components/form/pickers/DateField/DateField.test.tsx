import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { DateField, TimeField } from './DateField';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

describe('DateField', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <DateField label="Event date" />
            </ThemeProvider>
        );
        expect(screen.getByRole('group', { name: 'Event date' })).toBeInTheDocument();
    });
});

describe('TimeField', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <TimeField label="Event time" />
            </ThemeProvider>
        );
        expect(screen.getByRole('group', { name: 'Event time' })).toBeInTheDocument();
    });
});
