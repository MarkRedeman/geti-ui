import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Loading } from './Loading';

const renderLoading = (props: Partial<React.ComponentProps<typeof Loading>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Loading {...props} />
        </Provider>
    );

describe('Loading', () => {
    it('renders without crash', () => {
        renderLoading({ mode: 'inline' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders in inline mode', () => {
        renderLoading({ mode: 'inline' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders in overlay mode', () => {
        renderLoading({ mode: 'overlay' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders in fullscreen mode', () => {
        renderLoading({ mode: 'fullscreen' });
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders with accessible label', () => {
        renderLoading({ mode: 'inline' });
        expect(screen.getByRole('progressbar', { name: 'Loading...' })).toBeInTheDocument();
    });

    describe('variant="intel"', () => {
        it('renders the Intel branded image', () => {
            renderLoading({ variant: 'intel', mode: 'inline' });
            const img = screen.getByRole('progressbar');
            expect(img).toBeInTheDocument();
            expect(img.tagName).toBe('IMG');
        });

        it('renders with alt text "Loading"', () => {
            renderLoading({ variant: 'intel', mode: 'inline' });
            expect(screen.getByRole('progressbar')).toHaveAttribute('alt', 'Loading');
        });

        it('renders the intel-loading webp asset', () => {
            renderLoading({ variant: 'intel', mode: 'inline' });
            const img = screen.getByRole('progressbar');
            expect(img.getAttribute('src')).toMatch(/intel-loading.*\.webp/);
        });

        it('renders at 192px for size="L" (default)', () => {
            renderLoading({ variant: 'intel', mode: 'inline', size: 'L' });
            const img = screen.getByRole('progressbar');
            expect(img).toHaveAttribute('width', '192');
            expect(img).toHaveAttribute('height', '192');
        });

        it('renders at 48px for size="M"', () => {
            renderLoading({ variant: 'intel', mode: 'inline', size: 'M' });
            const img = screen.getByRole('progressbar');
            expect(img).toHaveAttribute('width', '48');
            expect(img).toHaveAttribute('height', '48');
        });

        it('renders at 24px for size="S"', () => {
            renderLoading({ variant: 'intel', mode: 'inline', size: 'S' });
            const img = screen.getByRole('progressbar');
            expect(img).toHaveAttribute('width', '24');
            expect(img).toHaveAttribute('height', '24');
        });
    });
});
