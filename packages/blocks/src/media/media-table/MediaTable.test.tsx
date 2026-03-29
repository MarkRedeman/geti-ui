import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from '@rstest/core';
import { Cell, Row, ThemeProvider } from '@geti-ui/ui';
import { MediaTable } from './MediaTable';
import type { MediaGridIdentifiable } from '../media-grid/types';
import type { MediaEntryProps, MediaTableRenderContext } from './types';

declare const rstest: {
    fn: <TArgs extends unknown[] = unknown[], TResult = unknown>(
        impl?: (...args: TArgs) => TResult
    ) => ((...args: TArgs) => TResult) & {
        mock: { calls: TArgs[] };
    };
};

type TestItem = MediaGridIdentifiable & { label: string; thumbnailUrl?: string; kind?: string };

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

afterEach(() => {});

function getColumns() {
    return [
        {
            key: 'name',
            name: 'Name',
            isRowHeader: true,
            renderCell: (ctx: MediaTableRenderContext<TestItem>) => (ctx.item ? ctx.item.label : 'Loading...'),
            textValue: (ctx: MediaTableRenderContext<TestItem>) => ctx.item?.label ?? 'Loading',
        },
        {
            key: 'kind',
            name: 'Kind',
            renderCell: (ctx: MediaTableRenderContext<TestItem>) => (ctx.item ? ctx.item.kind ?? 'image' : 'Loading...'),
        },
    ];
}

function renderMediaTable(props: Partial<React.ComponentProps<typeof MediaTable<TestItem>>> = {}) {
    const getItemAt = rstest.fn((_i: number): TestItem | undefined => undefined);

    const result = render(
        <ThemeProvider>
            <MediaTable<TestItem> totalItems={0} getItemAt={getItemAt} columns={getColumns()} {...props} />
        </ThemeProvider>
    );

    return { getItemAt, ...result };
}

describe('empty state', () => {
    it('renders default empty-state message when totalItems=0 and isLoading=false', () => {
        renderMediaTable({ totalItems: 0, isLoading: false });

        expect(screen.getByText('No media items available')).toBeTruthy();
    });

    it('renders custom emptyState node when provided', () => {
        renderMediaTable({
            totalItems: 0,
            isLoading: false,
            emptyState: <span>Nothing here yet</span>,
        });

        expect(screen.getByText('Nothing here yet')).toBeTruthy();
        expect(screen.queryByText('No media items available')).toBeNull();
    });

    it('does not render the table when in empty state', () => {
        renderMediaTable({ totalItems: 0, isLoading: false });

        expect(screen.queryByRole('grid')).toBeNull();
    });
});

describe('loading state suppresses empty state', () => {
    it('does not render default empty-state text when isLoading=true and totalItems=0', () => {
        renderMediaTable({ totalItems: 0, isLoading: true });

        expect(screen.queryByText('No media items available')).toBeNull();
    });

    it('renders the table scaffold when isLoading=true even with totalItems=0', () => {
        renderMediaTable({ totalItems: 0, isLoading: true });

        expect(screen.getByRole('grid')).toBeTruthy();
    });
});

describe('aria-label', () => {
    it('applies the default aria-label "Media table"', () => {
        renderMediaTable({ totalItems: 0, isLoading: true });

        expect(screen.getByRole('grid', { name: 'Media table' })).toBeTruthy();
    });

    it('applies a custom aria-label when ariaLabel prop is provided', () => {
        renderMediaTable({ totalItems: 0, isLoading: true, ariaLabel: 'Dataset media table' });

        expect(screen.getByRole('grid', { name: 'Dataset media table' })).toBeTruthy();
    });
});

describe('columns and rows', () => {
    it('renders thumbnail column and provided columns', () => {
        renderMediaTable({
            totalItems: 1,
            getItemAt: () => ({ id: '1', label: 'Item 1', kind: 'image' }),
            isLoading: true,
        });

        expect(screen.getByText('Thumbnail')).toBeTruthy();
        expect(screen.getByText('Name')).toBeTruthy();
        expect(screen.getByText('Kind')).toBeTruthy();
    });

    it('renders without crashing with default density and overflow settings', () => {
        expect(() => {
            renderMediaTable({
                totalItems: 1,
                getItemAt: () => ({ id: '1', label: 'Item 1', kind: 'image' }),
                isLoading: true,
            });
        }).not.toThrow();
    });

    it('accepts explicit density and overflowMode overrides', () => {
        expect(() => {
            renderMediaTable({
                totalItems: 1,
                getItemAt: () => ({ id: '1', label: 'Item 1', kind: 'image' }),
                density: 'compact',
                overflowMode: 'truncate',
                isLoading: true,
            });
        }).not.toThrow();
    });

    it('hides thumbnail column when hideThumbnailColumn is true', () => {
        renderMediaTable({
            totalItems: 1,
            getItemAt: () => ({ id: '1', label: 'Item 1', kind: 'image' }),
            hideThumbnailColumn: true,
            isLoading: true,
        });

        expect(screen.queryByText('Thumbnail')).toBeNull();
        expect(screen.getByText('Name')).toBeTruthy();
    });
});

describe('getItemAt calls', () => {
    it('calls getItemAt for each index in [0, totalItems) when totalItems=3', () => {
        const items: TestItem[] = [
            { id: 'a', label: 'Item A' },
            { id: 'b', label: 'Item B' },
            { id: 'c', label: 'Item C' },
        ];
        const getItemAt = rstest.fn((i: number): TestItem | undefined => items[i]);

        render(
            <ThemeProvider>
                <MediaTable<TestItem> totalItems={3} getItemAt={getItemAt} columns={getColumns()} isLoading />
            </ThemeProvider>
        );

        const calledIndexes = (getItemAt.mock.calls as [number][]).map(([i]) => i);
        expect(calledIndexes).toContain(0);
        expect(calledIndexes).toContain(1);
        expect(calledIndexes).toContain(2);
    });
});

describe('controlled selection', () => {
    it('sets aria-multiselectable when selectionMode is multiple', () => {
        render(
            <ThemeProvider>
                <MediaTable<TestItem>
                    totalItems={2}
                    getItemAt={(i) => ({ id: String(i), label: `Item ${i}` })}
                    columns={getColumns()}
                    selectionMode="multiple"
                    selectedKeys={new Set<string>()}
                    onSelectionChange={rstest.fn()}
                    isLoading
                />
            </ThemeProvider>
        );

        const grid = screen.getByRole('grid');
        expect(grid.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('does not set aria-multiselectable when selectionMode is none', () => {
        render(
            <ThemeProvider>
                <MediaTable<TestItem>
                    totalItems={1}
                    getItemAt={() => ({ id: 'x', label: 'X' })}
                    columns={getColumns()}
                    selectionMode="none"
                    selectedKeys={new Set<string>()}
                    onSelectionChange={rstest.fn()}
                    isLoading
                />
            </ThemeProvider>
        );

        const grid = screen.getByRole('grid');
        expect(grid.getAttribute('aria-multiselectable')).toBeNull();
    });
});

describe('onItemPress', () => {
    it('calls onItemPress with correct context and event when row press handler is invoked', () => {
        const onItemPress = rstest.fn();
        let capturedOnPress: ((event?: { shiftKey?: boolean }) => void) | undefined;

        renderMediaTable({
            totalItems: 1,
            getItemAt: () => ({ id: 'alpha', label: 'Alpha', thumbnailUrl: 'https://picsum.photos/seed/a/200/200' }),
            onItemPress,
            EntryComponent: (props) => {
                capturedOnPress = props.context.onPress;
                return (
                    <Row key={props.entry.key}>
                        <Cell>{props.context.item?.label ?? 'none'}</Cell>
                        <Cell>{props.context.item?.kind ?? 'none'}</Cell>
                        <Cell>{props.context.item?.id ? String(props.context.item.id) : 'none'}</Cell>
                    </Row>
                );
            },
            isLoading: true,
        });

        expect(capturedOnPress).toBeDefined();
        capturedOnPress!({ shiftKey: true });

        expect(onItemPress).toHaveBeenCalledOnce();
        const [contextArg, eventArg] = onItemPress.mock.calls[0] as [MediaTableRenderContext<TestItem>, { shiftKey?: boolean }];
        expect(contextArg.item?.id).toBe('alpha');
        expect(contextArg.index).toBe(0);
        expect(contextArg.isPlaceholder).toBe(false);
        expect(contextArg.thumbnailSize).toBe(50);
        expect(eventArg.shiftKey).toBe(true);
    });
});

describe('EntryComponent', () => {
    it('uses custom EntryComponent when provided', () => {
        const EntryComponent = rstest.fn((props: MediaEntryProps<TestItem>) => (
            <Row key={props.entry.key}>
                <Cell>custom entry {props.entry.index}</Cell>
                <Cell>{props.context.item?.label ?? 'none'}</Cell>
                <Cell>{props.context.item?.kind ?? 'none'}</Cell>
            </Row>
        ));

        renderMediaTable({
            totalItems: 2,
            getItemAt: (index) => ({ id: String(index + 1), label: `Item ${index + 1}`, kind: 'image' }),
            EntryComponent,
            isLoading: true,
        });

        expect(EntryComponent.mock.calls.length).toBe(2);
        expect(screen.getByText('custom entry 0')).toBeTruthy();
        expect(screen.getByText('custom entry 1')).toBeTruthy();
    });
});
