import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { LogsFilters } from './LogsFilters';
import type { LogFilters } from './types';

const filters: LogFilters = {
    levels: new Set(['INFO', 'ERROR']),
    searchQuery: '',
    startTime: null,
    endTime: null,
};

describe('LogsFilters', () => {
    it('renders all main controls', () => {
        render(
            <ThemeProvider>
                <LogsFilters
                    filters={filters}
                    onFiltersChange={() => {}}
                    autoScroll
                    onAutoScrollChange={() => {}}
                    totalCount={10}
                    filteredCount={3}
                    onCopy={async () => {}}
                />
            </ThemeProvider>
        );

        expect(screen.getByRole('searchbox', { name: /search logs/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /filter by log level/i })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: /auto-scroll/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /copy logs to clipboard/i })).toBeTruthy();
    });

    it('calls onFiltersChange on search update', async () => {
        const onFiltersChange = rstest.fn();
        render(
            <ThemeProvider>
                <LogsFilters
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    autoScroll
                    onAutoScrollChange={() => {}}
                    totalCount={10}
                    filteredCount={3}
                    onCopy={async () => {}}
                />
            </ThemeProvider>
        );

        await userEvent.type(screen.getByRole('searchbox', { name: /search logs/i }), 'timeout');
        expect(onFiltersChange).toHaveBeenCalled();
    });

    it('disables copy button when filteredCount is zero', () => {
        render(
            <ThemeProvider>
                <LogsFilters
                    filters={filters}
                    onFiltersChange={() => {}}
                    autoScroll
                    onAutoScrollChange={() => {}}
                    totalCount={10}
                    filteredCount={0}
                    onCopy={async () => {}}
                />
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: /copy logs to clipboard/i }).hasAttribute('disabled')).toBe(true);
    });
});
