import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { ThemeProvider } from '../../../theme/ThemeProvider';

describe('PhotoPlaceholder', () => {
    it('renders the first letter of the name correctly', () => {
        render(
            <ThemeProvider>
                <PhotoPlaceholder name="John Doe" indicator="jdoe@example.com" />
            </ThemeProvider>
        );
        expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('falls back to the indicator if the name is empty', () => {
        render(
            <ThemeProvider>
                <PhotoPlaceholder name="" indicator="admin@example.com" />
            </ThemeProvider>
        );
        expect(screen.getByText('A')).toBeInTheDocument();
    });
});
