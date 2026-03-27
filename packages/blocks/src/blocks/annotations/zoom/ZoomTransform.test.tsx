import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { ZoomTransform } from './ZoomTransform';
import { ZoomProvider, useZoom } from './ZoomProvider';

function ZoomDisplay() {
    const { scale } = useZoom();
    return <div data-testid='zoom-display'>{(scale * 100).toFixed(0)}%</div>;
}

describe('ZoomTransform', () => {
    it('renders content inside a zoomable viewport', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <span>Content</span>
                </ZoomTransform>
            </ZoomProvider>,
        );

        expect(screen.getByText('Content')).toBeDefined();
        expect(screen.getByTestId('zoom-transform')).toBeDefined();
    });

    it('applies a CSS transform to the inner element', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>Content</ZoomTransform>
            </ZoomProvider>,
        );

        const transform = screen.getByTestId('zoom-transform');
        const style = transform.getAttribute('style') ?? '';

        // Should contain translate and scale in the transform
        expect(style).toContain('translate(');
        expect(style).toContain('scale(');
    });

    it('exposes zoom state via useZoom hook', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomDisplay />
                </ZoomTransform>
            </ZoomProvider>,
        );

        // useContainerSize defaults to 100x100 in JSDOM (no ResizeObserver).
        // With content 500x500, scale = 0.9 * min(100/500, 100/500) = 0.18 → "18%"
        const display = screen.getByTestId('zoom-display');
        expect(display.textContent).toBe('18%');
    });

    it('sets --zoom-scale CSS variable on the container', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>Content</ZoomTransform>
            </ZoomProvider>,
        );

        const wrapper = screen.getByTestId('zoom-transform').parentElement;
        const style = wrapper?.getAttribute('style') ?? '';
        expect(style).toContain('--zoom-scale');
    });
});

describe('ZoomProvider', () => {
    it('throws when useZoom is used outside provider', () => {
        function BadComponent() {
            useZoom();
            return null;
        }

        expect(() => render(<BadComponent />)).toThrow('useZoom must be used within a <ZoomProvider>');
    });
});

describe('ZoomTransform interactive prop', () => {
    it('renders content when interactive is false', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize} interactive={false}>
                    <span>Static content</span>
                </ZoomTransform>
            </ZoomProvider>,
        );

        expect(screen.getByText('Static content')).toBeDefined();
        expect(screen.getByTestId('zoom-transform')).toBeDefined();
    });

    it('sets cursor to default when interactive is false', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize} interactive={false}>
                    Content
                </ZoomTransform>
            </ZoomProvider>,
        );

        const wrapper = screen.getByTestId('zoom-transform').parentElement;
        const style = wrapper?.getAttribute('style') ?? '';
        expect(style).toContain('cursor: default');
    });

    it('does not set touch-action: none when interactive is false', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize} interactive={false}>
                    Content
                </ZoomTransform>
            </ZoomProvider>,
        );

        const wrapper = screen.getByTestId('zoom-transform').parentElement;
        const style = wrapper?.getAttribute('style') ?? '';
        expect(style).not.toContain('touch-action');
    });

    it('still applies CSS transform and --zoom-scale when interactive is false', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize} interactive={false}>
                    Content
                </ZoomTransform>
            </ZoomProvider>,
        );

        const transform = screen.getByTestId('zoom-transform');
        const style = transform.getAttribute('style') ?? '';
        expect(style).toContain('translate(');
        expect(style).toContain('scale(');

        const wrapper = transform.parentElement;
        const wrapperStyle = wrapper?.getAttribute('style') ?? '';
        expect(wrapperStyle).toContain('--zoom-scale');
    });
});
