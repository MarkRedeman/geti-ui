import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorWheel } from './ColorWheel';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('ColorWheel', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <ColorWheel defaultValue="hsl(0, 100%, 50%)" aria-label="Hue Picker" />
            </ThemeProvider>
        );
        expect(screen.getByRole('slider', { name: 'Hue Picker' })).toBeInTheDocument();
    });
});
