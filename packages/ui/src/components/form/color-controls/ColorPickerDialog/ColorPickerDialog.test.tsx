import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, rstest } from '@rstest/core';
import { ColorPickerDialog } from './ColorPickerDialog';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { DISTINCT_COLORS } from '../../../../utils/distinct-colors';

describe('ColorPickerDialog', () => {
    it('renders trigger button with label', () => {
        render(
            <ThemeProvider>
                <ColorPickerDialog label="Test Picker" />
            </ThemeProvider>
        );
        expect(screen.getByRole('button', { name: /Test Picker/i })).toBeInTheDocument();
    });

    it('renders with default label when none is provided', () => {
        render(
            <ThemeProvider>
                <ColorPickerDialog />
            </ThemeProvider>
        );
        expect(screen.getByRole('button', { name: /Pick Color/i })).toBeInTheDocument();
    });

    it('opens popover with color editor and swatches on click', async () => {
        render(
            <ThemeProvider>
                <ColorPickerDialog label="Color" color="#ff0000" />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /Color/i }));
        // The popover should contain swatch options from the ColorSwatchPicker
        expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
    });

    it('calls onColorChange when a swatch is selected', async () => {
        const onColorChange = rstest.fn();
        render(
            <ThemeProvider>
                <ColorPickerDialog label="Color" color="#ff0000" onColorChange={onColorChange} />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /Color/i }));
        const swatches = screen.getAllByRole('option');
        await userEvent.click(swatches[0]);
        expect(onColorChange).toHaveBeenCalled();
    });

    it('accepts custom swatches', async () => {
        const customSwatches = ['#ff0000', '#00ff00', '#0000ff'];
        render(
            <ThemeProvider>
                <ColorPickerDialog label="Color" swatches={customSwatches} />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /Color/i }));
        expect(screen.getAllByRole('option')).toHaveLength(customSwatches.length);
    });

    it('defaults to DISTINCT_COLORS swatches', async () => {
        render(
            <ThemeProvider>
                <ColorPickerDialog label="Color" />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /Color/i }));
        expect(screen.getAllByRole('option')).toHaveLength(DISTINCT_COLORS.length);
    });
});
