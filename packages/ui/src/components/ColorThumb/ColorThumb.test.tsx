import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorThumb } from './ColorThumb';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('ColorThumb', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <ColorThumb color="#ff0000" id="test-thumb" />
            </ThemeProvider>
        );
        const thumb = document.getElementById('test-thumb');
        expect(thumb).toBeInTheDocument();
        expect(thumb).toHaveStyle('background-color: rgb(255, 0, 0)');
    });
});
