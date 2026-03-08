import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';
import { ColorThumb } from './ColorThumb';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

describe('ColorThumb', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <ColorThumb color="#ff0000" id="test-thumb" />
            </ThemeProvider>
        );
        const thumb = document.getElementById('test-thumb');
        expect(thumb).toBeInTheDocument();

        /*
         * The background color is driven by the --color-thumb-bg CSS custom
         * property.  JSDOM cannot compute custom properties, so we assert
         * that the variable is set on the element's style attribute rather
         * than checking the resolved background-color.
         */
        expect(thumb).toHaveStyle({ '--color-thumb-bg': '#ff0000' } as React.CSSProperties);
    });
});
