import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorField } from './ColorField';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

describe('ColorField', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <ColorField label="Color" />
            </ThemeProvider>
        );
        expect(screen.getByRole('textbox', { name: 'Color' })).toBeInTheDocument();
    });

    it('handles default value', () => {
        render(
            <ThemeProvider>
                <ColorField label="Color" defaultValue="#e73623" />
            </ThemeProvider>
        );
        expect(screen.getByRole('textbox')).toHaveValue('#E73623');
    });
});
