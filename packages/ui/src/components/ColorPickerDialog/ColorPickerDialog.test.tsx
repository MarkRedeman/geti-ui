import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorPickerDialog } from './ColorPickerDialog';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('ColorPickerDialog', () => {
    it('renders trigger button correctly', () => {
        render(
            <ThemeProvider>
                <ColorPickerDialog label="Test Picker" />
            </ThemeProvider>
        );
        expect(screen.getByRole('button', { name: 'Test Picker' })).toBeInTheDocument();
    });
});
