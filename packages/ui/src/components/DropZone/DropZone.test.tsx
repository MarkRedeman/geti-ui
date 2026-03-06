import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { DropZone } from './DropZone';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('DropZone', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <DropZone>Drop here</DropZone>
            </ThemeProvider>
        );
        expect(screen.getByText('Drop here')).toBeInTheDocument();
    });
});
