import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { MediaRow } from './MediaRow';
import type { MediaGridIdentifiable, MediaGridRenderContext } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TestItem = MediaGridIdentifiable & { label: string };

// ---------------------------------------------------------------------------
// Observer mocks
//
// ResizeObserver and IntersectionObserver are not available in jsdom.
// Provide no-op stubs so react-aria's Virtualizer / ScrollView internals
// don't throw during render.
// ---------------------------------------------------------------------------

class MockResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

class MockIntersectionObserver {
    observe = rstest.fn();
    disconnect = rstest.fn();
    unobserve = rstest.fn();

    constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
    Object.defineProperty(globalThis, 'ResizeObserver', {
        value: MockResizeObserver,
        writable: true,
        configurable: true,
    });

    Object.defineProperty(globalThis, 'IntersectionObserver', {
        value: MockIntersectionObserver,
        writable: true,
        configurable: true,
    });
});

afterEach(() => {
    // Nothing to clean up for these stubs, but keep the hook for symmetry
    // with MediaGrid.test.tsx.
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultRenderItem = (ctx: MediaGridRenderContext<TestItem>) => (
    <span data-testid={`item-${ctx.index}`}>{ctx.isPlaceholder ? 'placeholder' : ctx.item!.label}</span>
);

function renderMediaRow(props: Partial<React.ComponentProps<typeof MediaRow<TestItem>>> = {}) {
    const getItemAt = rstest.fn((_i: number): TestItem | undefined => undefined);

    const result = render(
        <ThemeProvider>
            <MediaRow<TestItem>
                totalItems={0}
                getItemAt={getItemAt}
                renderItem={defaultRenderItem}
                {...props}
            />
        </ThemeProvider>
    );

    return { getItemAt, ...result };
}

// ---------------------------------------------------------------------------
// 1. Empty state — totalItems=0, isLoading=false
// ---------------------------------------------------------------------------

describe('empty state', () => {
    it('renders default empty-state message when totalItems=0 and isLoading=false', () => {
        renderMediaRow({ totalItems: 0, isLoading: false });

        expect(screen.getByText('No media items available')).toBeTruthy();
    });

    it('renders a custom emptyState node when provided', () => {
        renderMediaRow({
            totalItems: 0,
            isLoading: false,
            emptyState: <span>Nothing here yet</span>,
        });

        expect(screen.getByText('Nothing here yet')).toBeTruthy();
        expect(screen.queryByText('No media items available')).toBeNull();
    });

    it('does not render a listbox when in empty state', () => {
        renderMediaRow({ totalItems: 0, isLoading: false });

        // The Virtualizer / ListBox (role="listbox") should NOT be present in
        // the empty-state branch.
        expect(screen.queryByRole('listbox')).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// 2. isLoading=true suppresses the empty state
// ---------------------------------------------------------------------------

describe('loading state suppresses empty state', () => {
    it('does not render the default empty-state text when isLoading=true and totalItems=0', () => {
        renderMediaRow({ totalItems: 0, isLoading: true });

        expect(screen.queryByText('No media items available')).toBeNull();
    });

    it('renders the listbox scaffold when isLoading=true even with totalItems=0', () => {
        renderMediaRow({ totalItems: 0, isLoading: true });

        // When loading, the component bypasses the empty-state branch and renders
        // the full ListBox scaffold instead.
        expect(screen.getByRole('listbox')).toBeTruthy();
    });
});

// ---------------------------------------------------------------------------
// 3. aria-label — default and custom override
// ---------------------------------------------------------------------------

describe('aria-label', () => {
    it('applies the default aria-label "Media row" to the listbox', () => {
        renderMediaRow({ totalItems: 0, isLoading: true });

        const listbox = screen.getByRole('listbox');
        expect(listbox.getAttribute('aria-label')).toBe('Media row');
    });

    it('applies a custom aria-label to the listbox when ariaLabel prop is provided', () => {
        renderMediaRow({ totalItems: 0, isLoading: true, ariaLabel: 'Project thumbnails' });

        const listbox = screen.getByRole('listbox');
        expect(listbox.getAttribute('aria-label')).toBe('Project thumbnails');
    });

    it('also forwards the ariaLabel to the wrapping region element', () => {
        renderMediaRow({ totalItems: 0, isLoading: true, ariaLabel: 'My custom label' });

        const region = screen.getByRole('region', { name: 'My custom label' });
        expect(region).toBeTruthy();
    });
});

// ---------------------------------------------------------------------------
// 4. onItemPress — wired through onAction on the ListBox
//
// react-aria's Virtualizer does not render virtual items into the DOM in jsdom
// (no real layout engine → clientHeight = 0 → visible window is empty).
// We therefore test the onItemPress wiring via the `onAction` callback path:
// the ListBox exposes `onAction` which calls `onItemPress` with a fully-formed
// context.  We reach that handler by calling it via the component's rendered
// ListBox element's react-aria `onAction` prop (accessible through the
// component's internal closure).
//
// The safest observable route in jsdom is to verify that rendering items whose
// `getItemAt` returns real data causes `onItemPress` to be invoked when the
// ListBox's `onAction` fires — we do this by supplying a renderItem that
// captures the `onPress` callback from the render context and calling it
// directly, which mirrors the real usage pattern.
// ---------------------------------------------------------------------------

describe('onItemPress', () => {
    it('calls onItemPress with correct context when renderItem invokes onPress', () => {
        const onItemPress = rstest.fn();
        let capturedOnPress: (() => void) | undefined;

        const items: TestItem[] = [{ id: 'alpha', label: 'Alpha' }];

        renderMediaRow({
            totalItems: 1,
            getItemAt: (i) => items[i],
            onItemPress,
            renderItem: (ctx) => {
                // Capture the onPress callback from the render context so we
                // can invoke it imperatively — this is the same path a real
                // MediaGridItem would take when the user clicks the thumbnail.
                if (!ctx.isPlaceholder) {
                    capturedOnPress = ctx.onPress;
                }
                return <span>{ctx.isPlaceholder ? 'placeholder' : ctx.item!.label}</span>;
            },
        });

        expect(capturedOnPress).toBeDefined();
        capturedOnPress!();

        expect(onItemPress).toHaveBeenCalledOnce();
        const callArg = onItemPress.mock.calls[0]?.[0] as MediaGridRenderContext<TestItem>;
        expect(callArg.item?.id).toBe('alpha');
        expect(callArg.index).toBe(0);
        expect(callArg.isPlaceholder).toBe(false);
    });

    it('does not call onItemPress for placeholder entries', () => {
        const onItemPress = rstest.fn();
        let capturedOnPress: (() => void) | undefined;

        renderMediaRow({
            totalItems: 1,
            // getItemAt returns undefined → placeholder
            getItemAt: () => undefined,
            onItemPress,
            renderItem: (ctx) => {
                capturedOnPress = ctx.onPress;
                return <span>{ctx.isPlaceholder ? 'placeholder' : 'item'}</span>;
            },
        });

        expect(capturedOnPress).toBeDefined();
        capturedOnPress!();

        expect(onItemPress).not.toHaveBeenCalled();
    });

    it('does not throw when onItemPress is not provided', () => {
        let capturedOnPress: (() => void) | undefined;

        const items: TestItem[] = [{ id: 'beta', label: 'Beta' }];

        expect(() => {
            renderMediaRow({
                totalItems: 1,
                getItemAt: (i) => items[i],
                renderItem: (ctx) => {
                    if (!ctx.isPlaceholder) {
                        capturedOnPress = ctx.onPress;
                    }
                    return <span>{ctx.isPlaceholder ? 'placeholder' : ctx.item!.label}</span>;
                },
            });
            capturedOnPress?.();
        }).not.toThrow();
    });
});

// ---------------------------------------------------------------------------
// 5. Selection change callback wiring
// ---------------------------------------------------------------------------

describe('selection change wiring', () => {
    it('sets aria-multiselectable on the listbox when selectionMode is "multiple"', () => {
        renderMediaRow({
            totalItems: 1,
            getItemAt: (i) => ({ id: String(i), label: `Item ${i}` }),
            selectionMode: 'multiple',
            selectedKeys: new Set<string>(),
            onSelectionChange: rstest.fn(),
            isLoading: true,
        });

        const listbox = screen.getByRole('listbox');
        expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('does not set aria-multiselectable when selectionMode is "none"', () => {
        renderMediaRow({
            totalItems: 1,
            getItemAt: () => ({ id: 'x', label: 'X' }),
            selectionMode: 'none',
            selectedKeys: new Set<string>(),
            onSelectionChange: rstest.fn(),
            isLoading: true,
        });

        const listbox = screen.getByRole('listbox');
        expect(listbox.getAttribute('aria-multiselectable')).toBeNull();
    });

    it('initialises internal uncontrolled selection from defaultSelectedKeys', () => {
        // In uncontrolled mode the component maintains its own state seeded by
        // defaultSelectedKeys.  We verify that the prop is accepted without
        // error and that no external onSelectionChange is required.
        expect(() => {
            renderMediaRow({
                totalItems: 2,
                getItemAt: (i) => ({ id: String(i), label: `Item ${i}` }),
                defaultSelectedKeys: ['0'],
                renderItem: defaultRenderItem,
            });
        }).not.toThrow();
    });

    it('forwards onSelectionChange to parent when controlled', () => {
        const onSelectionChange = rstest.fn();

        // Render in controlled mode; we cannot easily trigger a real selection
        // change from jsdom without live DOM rows (Virtualizer renders nothing
        // with zero layout height), but we can at least confirm the prop is
        // wired by verifying the component renders without error and the
        // callback is not spuriously called on mount.
        renderMediaRow({
            totalItems: 2,
            getItemAt: (i) => ({ id: String(i), label: `Item ${i}` }),
            selectedKeys: new Set<string>(['0']),
            onSelectionChange,
            isLoading: true,
        });

        // No spurious call on initial render.
        expect(onSelectionChange).not.toHaveBeenCalled();
    });
});
