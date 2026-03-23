import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { DatasetTabsBlock } from './DatasetTabsBlock';

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
});
