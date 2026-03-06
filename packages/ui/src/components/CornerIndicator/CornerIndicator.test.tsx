import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { CornerIndicator } from './CornerIndicator';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('CornerIndicator', () => {
    it('renders children correctly', () => {
        render(
            <ThemeProvider>
                <CornerIndicator isActive={true}>
                    <div>Content</div>
                </CornerIndicator>
            </ThemeProvider>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
