import { render, screen } from '@testing-library/react';
import { IntelBrandedLoading } from './IntelBrandedLoading';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { describe, it, expect } from '@rstest/core';
import '@testing-library/jest-dom';

describe('IntelBrandedLoading', () => {
    it('renders with role progressbar', () => {
        render(
            <ThemeProvider>
                <IntelBrandedLoading />
            </ThemeProvider>
        );

        const progressbar = screen.getByRole('progressbar');
        expect(progressbar).toBeInTheDocument();
        expect(progressbar).toHaveAttribute('alt', 'Loading');
    });

    it('renders the image with correct source', () => {
        render(
            <ThemeProvider>
                <IntelBrandedLoading />
            </ThemeProvider>
        );

        const img = screen.getByRole('progressbar');
        // Match the base filename as it might be hashed or transformed
        expect(img.getAttribute('src')).toMatch(/intel-loading.*\.webp/);
    });

    it('applies the specified height', () => {
        const { container } = render(
            <ThemeProvider>
                <IntelBrandedLoading height="500px" />
            </ThemeProvider>
        );

        const flexContainer = container.querySelector('.geti-intel-loading-container');
        expect(flexContainer).toHaveStyle('height: 500px');
    });
});
