import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { TabItem, TabList, TabPanels, Tabs, ThemeProvider } from '@geti-ai/ui';
import { ManagedTab, type ManagedTabAction } from './ManagedTab';

const actions: ManagedTabAction[] = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
];

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
});
