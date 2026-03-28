import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { ZoomTransform } from './ZoomTransform';
import { ZoomProvider, useZoom, useZoomActions } from './ZoomProvider';
import type { Rect, ZoomToOptions } from './types';

function ZoomDisplay() {
    const { scale } = useZoom();
    return <div data-testid='zoom-display'>{(scale * 100).toFixed(0)}%</div>;
}

function ZoomActionControls() {
    const { fitToScreen, zoomBy, zoomTo } = useZoomActions();

    return (
        <div>
            <button data-testid='zoom-in' onClick={() => zoomBy(1)}>
                Zoom in
            </button>
            <button data-testid='zoom-out' onClick={() => zoomBy(-1)}>
                Zoom out
            </button>
            <button data-testid='fit' onClick={() => fitToScreen()}>
                Fit
            </button>
            <button
                data-testid='zoom-to-small'
                onClick={() => zoomTo({ x: 200, y: 200, width: 100, height: 100 })}
            >
                Zoom to
            </button>
        </div>
    );
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
        // With content 500x500, scale = min(100/500, 100/500) = 0.2 → "20%"
        const display = screen.getByTestId('zoom-display');
        expect(display.textContent).toBe('20%');
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

describe('zoom interactions and actions', () => {
    it('zoomBy uses geometric stepping', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomDisplay />
                    <ZoomActionControls />
                </ZoomTransform>
            </ZoomProvider>
        );

        const display = screen.getByTestId('zoom-display');
        expect(display.textContent).toBe('20%');

        act(() => {
            fireEvent.click(screen.getByTestId('zoom-in'));
        });

        // ratioPerStep = (maxScale / minScale)^(1/10) = (2.0 / 0.1)^(1/10)
        // newScale = 0.2 * ratioPerStep ≈ 0.2699 => 27%
        expect(display.textContent).toBe('27%');
    });

    it('wheel zoom computes from latest scale via functional updater', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomDisplay />
                </ZoomTransform>
            </ZoomProvider>
        );

        const display = screen.getByTestId('zoom-display');
        const wrapper = screen.getByTestId('zoom-transform').parentElement!;

        expect(display.textContent).toBe('20%');

        act(() => {
            fireEvent.wheel(wrapper, { deltaY: -100, clientX: 50, clientY: 50 });
        });

        expect(parseInt(display.textContent ?? '0', 10)).toBeGreaterThan(20);
    });

    it('applies transition animation for discrete actions', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomActionControls />
                </ZoomTransform>
            </ZoomProvider>
        );

        const transform = screen.getByTestId('zoom-transform');
        const initialStyle = transform.getAttribute('style') ?? '';
        expect(initialStyle).toContain('transition: none');

        act(() => {
            fireEvent.click(screen.getByTestId('zoom-to-small'));
        });

        const animatedStyle = transform.getAttribute('style') ?? '';
        expect(animatedStyle).toContain('transform 200ms ease');
    });

    it('preserves user transform when config updates but target is unchanged', () => {
        const contentSize = { width: 500, height: 500 };

        function TestHarness({ zoomInMultiplier }: { zoomInMultiplier: number }) {
            return (
                <ZoomProvider target={contentSize}>
                    <ZoomTransform target={contentSize} zoomInMultiplier={zoomInMultiplier}>
                        <ZoomDisplay />
                        <ZoomActionControls />
                    </ZoomTransform>
                </ZoomProvider>
            );
        }

        const { rerender } = render(<TestHarness zoomInMultiplier={10} />);

        act(() => {
            fireEvent.click(screen.getByTestId('zoom-to-small'));
        });

        const zoomedText = screen.getByTestId('zoom-display').textContent;
        expect(zoomedText).toBe('100%');

        rerender(<TestHarness zoomInMultiplier={5} />);

        expect(screen.getByTestId('zoom-display').textContent).toBe('100%');
    });

    it('resets to fit-to-screen when target dimensions change', () => {
        function TestHarness({ target }: { target: { width: number; height: number } }) {
            return (
                <ZoomProvider target={target}>
                    <ZoomTransform target={target}>
                        <ZoomDisplay />
                        <ZoomActionControls />
                    </ZoomTransform>
                </ZoomProvider>
            );
        }

        const { rerender } = render(<TestHarness target={{ width: 500, height: 500 }} />);

        act(() => {
            fireEvent.click(screen.getByTestId('zoom-to-small'));
        });

        expect(screen.getByTestId('zoom-display').textContent).toBe('100%');

        rerender(<TestHarness target={{ width: 250, height: 250 }} />);

        // useContainerSize defaults to 100x100 in JSDOM.
        // New fit scale = min(100/250, 100/250) = 0.4 => 40%
        expect(screen.getByTestId('zoom-display').textContent).toBe('40%');
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

describe('ZoomTransform doubleClickMode', () => {
    it('does not attach onDoubleClick behavior by default', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    Content
                </ZoomTransform>
            </ZoomProvider>,
        );

        const wrapper = screen.getByTestId('zoom-transform').parentElement!;
        // Double-click should not throw when mode is 'none'
        fireEvent.doubleClick(wrapper);

        // Transform should still be present (no crash)
        const style = screen.getByTestId('zoom-transform').getAttribute('style') ?? '';
        expect(style).toContain('scale(');
    });

    it('renders with doubleClickMode="fitToScreen" without errors', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize} doubleClickMode="fitToScreen">
                    Content
                </ZoomTransform>
            </ZoomProvider>,
        );

        expect(screen.getByTestId('zoom-transform')).toBeDefined();
    });

    it('does not trigger fitToScreen on double-click when interactive is false', () => {
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize} interactive={false} doubleClickMode="fitToScreen">
                    Content
                </ZoomTransform>
            </ZoomProvider>,
        );

        const wrapper = screen.getByTestId('zoom-transform').parentElement!;
        fireEvent.doubleClick(wrapper);

        // Should not crash, transform still applied
        const style = screen.getByTestId('zoom-transform').getAttribute('style') ?? '';
        expect(style).toContain('scale(');
    });
});

describe('zoomTo (viewport rectangle)', () => {
    /**
     * Helper component that calls zoomTo on mount and exposes the resulting
     * scale + translate via data attributes for assertions.
     *
     * In JSDOM, useContainerSize defaults to { width: 100, height: 100 },
     * so the container is 100×100 px.
     */
    function ZoomToTrigger({
        viewport,
        options,
    }: {
        viewport: Rect;
        options?: ZoomToOptions;
    }) {
        const { scale, translate } = useZoom();
        const { zoomTo } = useZoomActions();

        return (
            <div>
                <div
                    data-testid="zoom-state"
                    data-scale={scale.toFixed(4)}
                    data-tx={translate.x.toFixed(4)}
                    data-ty={translate.y.toFixed(4)}
                />
                <button data-testid="trigger" onClick={() => zoomTo(viewport, options)}>
                    Zoom
                </button>
            </div>
        );
    }

    it('zooms to center a rectangle in the viewport', () => {
        // Content is 500×500, container is 100×100 (JSDOM default).
        // Initial fit-to-screen: scale = min(100/500, 100/500) = 0.2
        // Target rect: x=200,y=200,w=100,h=100 (center at 250,250 in content space)
        // Scale to fit: min(100/100, 100/100) = 1.0, clamped to maxScale = 0.2 * 10 = 2.0
        // translate.x = 100/2 - 250 * 1.0 = 50 - 250 = -200
        // translate.y = 100/2 - 250 * 1.0 = 50 - 250 = -200
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomToTrigger viewport={{ x: 200, y: 200, width: 100, height: 100 }} />
                </ZoomTransform>
            </ZoomProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('trigger'));
        });

        const state = screen.getByTestId('zoom-state');
        const scale = parseFloat(state.getAttribute('data-scale')!);
        const tx = parseFloat(state.getAttribute('data-tx')!);
        const ty = parseFloat(state.getAttribute('data-ty')!);

        // Scale should be 1.0 (rect 100x100 fits perfectly in 100x100 container)
        expect(scale).toBe(1);
        // Translation should center the rect
        expect(tx).toBe(-200);
        expect(ty).toBe(-200);
    });

    it('respects aspect ratio when rect is wider than container', () => {
        // Content 800×600, container 100×100.
        // Target rect: x=0,y=0,w=400,h=100 (wide rect, 4:1 ratio)
        // Scale to fit: min(100/400, 100/100) = min(0.25, 1.0) = 0.25
        // Rect center: (200, 50)
        // translate.x = 50 - 200 * 0.25 = 50 - 50 = 0
        // translate.y = 50 - 50 * 0.25 = 50 - 12.5 = 37.5
        const contentSize = { width: 800, height: 600 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomToTrigger viewport={{ x: 0, y: 0, width: 400, height: 100 }} />
                </ZoomTransform>
            </ZoomProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('trigger'));
        });

        const state = screen.getByTestId('zoom-state');
        const scale = parseFloat(state.getAttribute('data-scale')!);
        const tx = parseFloat(state.getAttribute('data-tx')!);
        const ty = parseFloat(state.getAttribute('data-ty')!);

        expect(scale).toBe(0.25);
        expect(tx).toBe(0);
        expect(ty).toBe(37.5);
    });

    it('applies padding around the target rectangle', () => {
        // Content 500×500, container 100×100.
        // Padding = 10 → available = 80×80
        // Target rect: x=200,y=200,w=100,h=100 (center at 250,250)
        // Scale to fit: min(80/100, 80/100) = 0.8
        // translate.x = 50 - 250 * 0.8 = 50 - 200 = -150
        // translate.y = 50 - 250 * 0.8 = 50 - 200 = -150
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomToTrigger
                        viewport={{ x: 200, y: 200, width: 100, height: 100 }}
                        options={{ padding: 10 }}
                    />
                </ZoomTransform>
            </ZoomProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('trigger'));
        });

        const state = screen.getByTestId('zoom-state');
        const scale = parseFloat(state.getAttribute('data-scale')!);
        const tx = parseFloat(state.getAttribute('data-tx')!);
        const ty = parseFloat(state.getAttribute('data-ty')!);

        expect(scale).toBe(0.8);
        expect(tx).toBe(-150);
        expect(ty).toBe(-150);
    });

    it('clamps scale to maxScale when rect is very small', () => {
        // Content 500×500, container 100×100.
        // initialScale = min(100/500, 100/500) = 0.2
        // minScale = 0.2 * 0.5 = 0.1, maxScale = 0.2 * 10 = 2.0
        // Target rect: 1×1 pixel → scaleToFit = min(100/1, 100/1) = 100, clamped to 2.0
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomToTrigger viewport={{ x: 250, y: 250, width: 1, height: 1 }} />
                </ZoomTransform>
            </ZoomProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('trigger'));
        });

        const state = screen.getByTestId('zoom-state');
        const scale = parseFloat(state.getAttribute('data-scale')!);

        expect(scale).toBe(2);
    });

    it('clamps scale to minScale when rect is very large', () => {
        // Content 500×500, container 100×100.
        // initialScale = min(100/500, 100/500) = 0.2
        // minScale = 0.2 * 0.5 = 0.1
        // Target rect: 5000×5000 → scaleToFit = min(100/5000, 100/5000) = 0.02, clamped to 0.1
        const contentSize = { width: 500, height: 500 };

        render(
            <ZoomProvider target={contentSize}>
                <ZoomTransform target={contentSize}>
                    <ZoomToTrigger viewport={{ x: 0, y: 0, width: 5000, height: 5000 }} />
                </ZoomTransform>
            </ZoomProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByTestId('trigger'));
        });

        const state = screen.getByTestId('zoom-state');
        const scale = parseFloat(state.getAttribute('data-scale')!);

        expect(scale).toBe(0.1);
    });
});
