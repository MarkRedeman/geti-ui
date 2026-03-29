import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from '@rstest/core';
import { ActionButton, TabItem, TabPanels, Tabs, ThemeProvider } from '@geti-ui/ui';
import { OverflowableTabs } from './OverflowableTabs';

type TabData = { id: string; label: string };

const items: TabData[] = [
    { id: 'a', label: 'Training' },
    { id: 'b', label: 'Validation' },
    { id: 'c', label: 'Testing' },
    { id: 'd', label: 'Edge cases' },
    { id: 'e', label: 'Night shift' },
    { id: 'f', label: 'Drift watch' },
];

afterEach(() => {
    cleanup();
    rstest.restoreAllMocks();
    rstest.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderOverflowableTabs(
    props: Partial<Parameters<typeof OverflowableTabs<TabData>>[0]> & {
        selectedKey?: string;
        onSelectionChange?: (id: string) => void;
    } = {}
) {
    const { selectedKey = 'a', onSelectionChange = () => {}, ...rest } = props;

    return render(
        <ThemeProvider>
            <Tabs aria-label="Datasets" selectedKey={selectedKey} onSelectionChange={() => {}}>
                <OverflowableTabs
                    items={items}
                    selectedKey={selectedKey}
                    onSelectionChange={onSelectionChange}
                    getItemId={(item) => item.id}
                    getItemLabel={(item) => item.label}
                    {...rest}
                />
                <TabPanels>
                    {items.map((item) => (
                        <TabItem key={item.id}>{item.label}</TabItem>
                    ))}
                </TabPanels>
            </Tabs>
        </ThemeProvider>
    );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('OverflowableTabs', () => {
    // -----------------------------------------------------------------------
    // Existing tests (unchanged)
    // -----------------------------------------------------------------------

    it('renders tabs and trailing content without requiring sizing props', () => {
        render(
            <ThemeProvider>
                <Tabs aria-label="Datasets" selectedKey="a" onSelectionChange={() => {}}>
                    <OverflowableTabs
                        items={items}
                        selectedKey="a"
                        onSelectionChange={() => {}}
                        getItemId={(item) => item.id}
                        getItemLabel={(item) => item.label}
                        trailingContent={<span>Trailing content</span>}
                    />

                    <TabPanels>
                        {items.map((item) => (
                            <TabItem key={item.id}>{item.label}</TabItem>
                        ))}
                    </TabPanels>
                </Tabs>
            </ThemeProvider>
        );

        expect(screen.getByRole('tab', { name: 'Training' })).toBeTruthy();
        expect(screen.getByText('Trailing content')).toBeTruthy();
    });

    it('renders trailing content inside built-in trailing container', () => {
        render(
            <ThemeProvider>
                <Tabs aria-label="Datasets" selectedKey="a" onSelectionChange={() => {}}>
                    <OverflowableTabs
                        items={items}
                        selectedKey="a"
                        onSelectionChange={() => {}}
                        getItemId={(item) => item.id}
                        getItemLabel={(item) => item.label}
                        trailingContent={<ActionButton aria-label="Add dataset">Add</ActionButton>}
                    />

                    <TabPanels>
                        {items.map((item) => (
                            <TabItem key={item.id}>{item.label}</TabItem>
                        ))}
                    </TabPanels>
                </Tabs>
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: 'Add dataset' })).toBeTruthy();
    });

    // -----------------------------------------------------------------------
    // renderTab: isActive reflects current selection
    // -----------------------------------------------------------------------

    describe('renderTab', () => {
        /**
         * No overflow needed - all tabs are visible by default (maxVisibleTabs
         * starts at items.length when ResizeObserver hasn't fired).
         *
         * React Spectrum's TabList renders each tab twice internally (once in
         * the visible list, once hidden for the keyboard overflow picker), so
         * `queryAllByTestId` is used to handle both DOM nodes.
         */
        it('receives isActive=true for the selected tab and isActive=false for others', () => {
            const renderTab = rstest.fn((item: TabData, isActive: boolean) => (
                <span data-testid={`tab-${item.id}`} data-active={String(isActive)}>
                    {item.label}
                </span>
            ));

            renderOverflowableTabs({ selectedKey: 'b', renderTab });

            // All rendered copies of the selected tab ('b') must have isActive=true
            const selectedEls = screen.queryAllByTestId('tab-b');
            expect(selectedEls.length).toBeGreaterThan(0);
            selectedEls.forEach((el) => {
                expect(el.dataset.active).toBe('true');
            });

            // All rendered copies of every other visible tab must have isActive=false
            for (const item of items.filter((i) => i.id !== 'b')) {
                const els = screen.queryAllByTestId(`tab-${item.id}`);
                els.forEach((el) => {
                    expect(el.dataset.active).toBe('false');
                });
            }

            // renderTab must have been called at least once with isActive=true for 'b'
            const activeCalls = (renderTab.mock.calls as [TabData, boolean][]).filter(
                ([item, isActive]) => item.id === 'b' && isActive === true
            );
            expect(activeCalls.length).toBeGreaterThan(0);
        });
    });

    // -----------------------------------------------------------------------
    // No overflow picker when all items fit
    // -----------------------------------------------------------------------

    describe('no overflow when items fit', () => {
        /**
         * When _testMaxVisibleTabs is not set (or equals items.length),
         * all tabs fit and no overflow picker is rendered.
         */
        it('does not render the overflow picker when all tabs are visible', () => {
            render(
                <ThemeProvider>
                    <Tabs aria-label="Datasets" selectedKey="a" onSelectionChange={() => {}}>
                        <div style={{ width: 2000 }}>
                            <OverflowableTabs
                                items={items}
                                selectedKey="a"
                                onSelectionChange={() => {}}
                                getItemId={(item) => item.id}
                                getItemLabel={(item) => item.label}
                            />
                        </div>
                        <TabPanels>
                            {items.map((item) => (
                                <TabItem key={item.id}>{item.label}</TabItem>
                            ))}
                        </TabPanels>
                    </Tabs>
                </ThemeProvider>
            );

            // All six tabs must be visible in the tab list
            for (const item of items) {
                expect(screen.getByRole('tab', { name: item.label })).toBeTruthy();
            }

            // The overflow picker must NOT be present
            expect(screen.queryByRole('button', { name: /Collapsed items/i })).toBeNull();
        });
    });

    // Overflow-specific behaviors rely on measured layout widths and are best
    // verified in browser/e2e tests instead of jsdom unit tests.
});
