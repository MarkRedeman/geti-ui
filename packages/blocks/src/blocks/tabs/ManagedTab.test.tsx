import { render, screen, within, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, afterEach } from '@rstest/core';
import { TabItem, TabList, TabPanels, Tabs, ThemeProvider } from '@geti-ai/ui';
import { ManagedTab, type ManagedTabAction } from './ManagedTab';

const actions: ManagedTabAction[] = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
];

afterEach(() => {
    cleanup();
});

// Renders ManagedTab without the full Tabs context for isolated unit tests
function renderIsolated(props: Parameters<typeof ManagedTab>[0]) {
    return render(
        <ThemeProvider>
            <ManagedTab {...props} />
        </ThemeProvider>
    );
}

// Query helpers that avoid keeping DOM element references in assertions
function menuItemVisible(name: string) {
    return screen.queryByRole('menuitem', { name }) !== null;
}

describe('ManagedTab', () => {
    it('shows menu trigger only for selected tab', () => {
        render(
            <ThemeProvider>
                <Tabs aria-label="Datasets" selectedKey="a" onSelectionChange={() => {}}>
                    <TabList>
                        <TabItem key="a" textValue="Training">
                            <ManagedTab label="Training" isSelected actions={actions} onAction={() => {}} />
                        </TabItem>
                        <TabItem key="b" textValue="Validation">
                            <ManagedTab label="Validation" isSelected={false} actions={actions} onAction={() => {}} />
                        </TabItem>
                    </TabList>
                    <TabPanels>
                        <TabItem key="a">A</TabItem>
                        <TabItem key="b">B</TabItem>
                    </TabPanels>
                </Tabs>
            </ThemeProvider>
        );
        expect(screen.getByRole('tab', { name: 'Training' })).toBeTruthy();
        expect(screen.queryByRole('button', { name: 'Actions for Validation' })).toBeNull();
    });

    it('opens menu when selected tab label is clicked', async () => {
        render(
            <ThemeProvider>
                <Tabs aria-label="Datasets" selectedKey="a" onSelectionChange={() => {}}>
                    <TabList>
                        <TabItem key="a" textValue="Training">
                            <ManagedTab label="Training" isSelected actions={actions} onAction={() => {}} />
                        </TabItem>
                    </TabList>
                    <TabPanels>
                        <TabItem key="a">A</TabItem>
                    </TabPanels>
                </Tabs>
            </ThemeProvider>
        );

        const tab = screen.getByRole('tab', { name: /Training/i });
        await userEvent.click(within(tab).getByText('Training'));

        expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeTruthy();
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeTruthy();
    });

    // --- onAction key tests ---

    it('calls onAction with correct key when Edit is selected', async () => {
        const onAction = rstest.fn();
        renderIsolated({ label: 'Training', isSelected: true, actions, onAction });

        await userEvent.click(screen.getByText('Training'));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

        expect(onAction).toHaveBeenCalledOnce();
        expect(onAction).toHaveBeenCalledWith('edit');
    });

    it('calls onAction with correct key when Delete is selected', async () => {
        const onAction = rstest.fn();
        renderIsolated({ label: 'Training', isSelected: true, actions, onAction });

        await userEvent.click(screen.getByText('Training'));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

        expect(onAction).toHaveBeenCalledOnce();
        expect(onAction).toHaveBeenCalledWith('delete');
    });

    it('closes the menu after an action is selected', async () => {
        renderIsolated({ label: 'Training', isSelected: true, actions, onAction: () => {} });

        await userEvent.click(screen.getByText('Training'));
        expect(menuItemVisible('Edit')).toBe(true);
        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(menuItemVisible('Edit')).toBe(false));
    });

    // --- actions=[] tests ---

    it('does not open a menu and does not crash when actions is empty', async () => {
        renderIsolated({ label: 'Training', isSelected: true, actions: [], onAction: () => {} });

        expect(screen.getByText('Training').textContent).toBe('Training');
        // No MenuTrigger is rendered when actions is empty
        expect(screen.queryByRole('menu')).toBeNull();

        // Clicking must not crash and must not produce menu items
        await userEvent.click(screen.getByText('Training'));
        expect(screen.queryByRole('menuitem')).toBeNull();
    });

    // --- trailingContent tests ---

    it('renders trailingContent when provided', () => {
        renderIsolated({
            label: 'Training',
            isSelected: true,
            actions,
            onAction: () => {},
            trailingContent: <span data-testid="badge">3</span>,
        });

        expect(screen.getByTestId('badge').textContent).toBe('3');
    });

    it('renders trailingContent on an unselected tab with no actions', () => {
        renderIsolated({
            label: 'Training',
            isSelected: false,
            actions: [],
            onAction: () => {},
            trailingContent: <span data-testid="count">7</span>,
        });

        expect(screen.getByTestId('count').textContent).toBe('7');
    });

    // --- keyboard path tests ---
    // PressableElement wraps a <div> inside react-aria-components' <Pressable>.
    // Pressable fires onPress for Enter and Space when the child is focused.
    // We focus the trigger div directly to exercise this path without depending
    // on the tab panel's own keyboard navigation.

    it('opens menu via Enter key on the pressable trigger', async () => {
        renderIsolated({ label: 'Training', isSelected: true, actions, onAction: () => {} });

        const triggerDiv = screen.getByText('Training').closest('div');
        triggerDiv?.focus();
        await userEvent.keyboard('{Enter}');

        expect(menuItemVisible('Edit')).toBe(true);
        expect(menuItemVisible('Delete')).toBe(true);
    });

    it('opens menu via Space key on the pressable trigger', async () => {
        renderIsolated({ label: 'Training', isSelected: true, actions, onAction: () => {} });

        const triggerDiv = screen.getByText('Training').closest('div');
        triggerDiv?.focus();
        await userEvent.keyboard(' ');

        expect(menuItemVisible('Edit')).toBe(true);
        expect(menuItemVisible('Delete')).toBe(true);
    });
});
