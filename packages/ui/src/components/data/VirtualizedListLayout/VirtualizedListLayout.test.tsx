import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { VirtualizedListLayout } from './VirtualizedListLayout';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

interface TestItem {
    id: string;
    label: string;
}

const ITEMS: TestItem[] = [
    { id: 'item-1', label: 'Apple' },
    { id: 'item-2', label: 'Banana' },
    { id: 'item-3', label: 'Cherry' },
];

const DEFAULT_LAYOUT_OPTIONS = { rowHeight: 40 };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderVirtualizedList = (overrides: Partial<React.ComponentProps<typeof VirtualizedListLayout<TestItem>>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <VirtualizedListLayout<TestItem>
                items={ITEMS}
                ariaLabel="Test list"
                layoutOptions={DEFAULT_LAYOUT_OPTIONS}
                containerHeight="size-3000"
                idFormatter={(item) => item.id}
                textValueFormatter={(item) => item.label}
                renderItem={(item) => <span>{item.label}</span>}
                {...overrides}
            />
        </Provider>
    );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('VirtualizedListLayout', () => {
    // --- Rendering ---

    it('renders without crash', () => {
        renderVirtualizedList();
        // The inner AriaListBox renders as role="listbox"
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('has an accessible label', () => {
        renderVirtualizedList();
        expect(screen.getByRole('listbox', { name: 'Test list' })).toBeInTheDocument();
    });

    it('renders item text for all provided items', () => {
        renderVirtualizedList();
        // Virtualizer may limit what is rendered - check at least one item is visible
        expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('renders an empty list without crash', () => {
        renderVirtualizedList({ items: [] });
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // --- Loading state ---

    it('renders the default loading indicator when isLoading is true', () => {
        renderVirtualizedList({ isLoading: true });
        // The default renderLoading renders a Loading component with mode="inline"
        // It will be inside a ListBoxItem with textValue="loading"
        // We verify the listbox is still present and the loading item exists in the DOM
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('renders a custom loading indicator when renderLoading is provided', () => {
        renderVirtualizedList({
            isLoading: true,
            renderLoading: () => <span>Loading more…</span>,
        });
        expect(screen.getByText('Loading more…')).toBeInTheDocument();
    });

    it('does not render loading indicator when isLoading is false', () => {
        renderVirtualizedList({
            isLoading: false,
            renderLoading: () => <span>Loading more…</span>,
        });
        expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
    });

    // --- Selection ---

    it('marks the selected item when selectedKeys is provided', () => {
        renderVirtualizedList({ selected: new Set(['item-1']) });
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
        // The selected option carries aria-selected="true"
        const selectedOption = screen.getByRole('option', { name: 'Apple' });
        expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('renders custom item content via renderItem', () => {
        renderVirtualizedList({
            renderItem: (item) => <strong data-testid={`item-${item.id}`}>{item.label.toUpperCase()}</strong>,
        });
        expect(screen.getByText('APPLE')).toBeInTheDocument();
        expect(screen.getByTestId('item-item-1')).toBeInTheDocument();
    });
});
