import { render, screen } from '@testing-library/react';
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
});
