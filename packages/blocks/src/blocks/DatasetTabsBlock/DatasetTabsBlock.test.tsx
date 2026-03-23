import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { DatasetTabsBlock } from './DatasetTabsBlock';

const openSelectedTabMenu = async () => {
    const selectedTab = screen.getByRole('tab', { selected: true });
    const label = selectedTab.textContent ?? '';
    await userEvent.click(selectedTab);
    if (label) {
        await userEvent.click(within(selectedTab).getByText(label));
    }
};

describe('DatasetTabsBlock', () => {
    it('renders dataset tabs and add action', () => {
        render(
            <ThemeProvider>
                <DatasetTabsBlock />
            </ThemeProvider>
        );

        expect(screen.getByRole('tablist')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Add dataset' })).toBeTruthy();
    });

    it('adds a new dataset from add action button', async () => {
        render(
            <ThemeProvider>
                <DatasetTabsBlock />
            </ThemeProvider>
        );

        const addButton = screen.getByRole('button', { name: 'Add dataset' });
        await userEvent.click(addButton);

        expect(screen.getByRole('tab', { name: /Dataset 7/i })).toBeTruthy();
    });

    it('edits selected dataset name via managed tab menu', async () => {
        render(
            <ThemeProvider>
                <DatasetTabsBlock />
            </ThemeProvider>
        );

        await openSelectedTabMenu();
        await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

        expect(screen.getByRole('tab', { name: /Training set \(edited\)/i })).toBeTruthy();
    });

    it('switches tabs and updates visible panel content', async () => {
        render(
            <ThemeProvider>
                <DatasetTabsBlock />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('tab', { name: /Validation set/i }));
        expect(screen.getByRole('tabpanel').textContent).toContain('Validation set');
    });
});
