import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ActionButton, TabItem, TabPanels, Tabs, ThemeProvider } from '@geti-ai/ui';
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

describe('OverflowableTabs', () => {
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
});
