import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, rstest } from '@rstest/core';
import { ColorSwatchPicker, ColorSwatchPickerItem } from './ColorSwatchPicker';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('ColorSwatchPicker', () => {
    it('renders a list of swatches', () => {
        render(
            <ThemeProvider>
                <ColorSwatchPicker aria-label="Picker">
                    <ColorSwatchPickerItem color="#f00" aria-label="Red" />
                    <ColorSwatchPickerItem color="#0f0" aria-label="Green" />
                </ColorSwatchPicker>
            </ThemeProvider>
        );
        expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    it('calls onChange when a swatch is clicked', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <ColorSwatchPicker aria-label="Picker" onChange={onChange}>
                    <ColorSwatchPickerItem color="#f00" aria-label="Red" />
                    <ColorSwatchPickerItem color="#0f0" aria-label="Green" />
                </ColorSwatchPicker>
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('option', { name: /Green/i }));
        expect(onChange).toHaveBeenCalled();
    });
});
