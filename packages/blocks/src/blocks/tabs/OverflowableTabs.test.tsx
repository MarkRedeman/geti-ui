import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { TabItem, TabPanels, Tabs, ThemeProvider } from '@geti-ai/ui';
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
    it('renders collapsed picker when there are more tabs than visible slots', () => {
        render(
            <ThemeProvider>
                <Tabs aria-label="Datasets" selectedKey="a" onSelectionChange={() => {}}>
                    <OverflowableTabs
                        items={items}
                        selectedId="a"
                        onSelectionChange={() => {}}
                        getItemId={(item) => item.id}
                        getItemLabel={(item) => item.label}
                        overflowAriaLabel="Collapsed datasets"
                    />

                    <TabPanels>
                        {items.map((item) => (
                            <TabItem key={item.id}>{item.label}</TabItem>
                        ))}
                    </TabPanels>
                </Tabs>
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: /Collapsed datasets/i })).toBeTruthy();
    });
});
