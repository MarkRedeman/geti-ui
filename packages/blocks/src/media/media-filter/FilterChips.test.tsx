import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ui/ui';
import { FilterChips } from './FilterChips';

describe('FilterChips', () => {
    it('renders chip labels and removes by callback', async () => {
        const onRemoveRule = rstest.fn();

        render(
            <ThemeProvider>
                <FilterChips
                    rules={[{ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' }]}
                    onRemoveRule={onRemoveRule}
                />
            </ThemeProvider>
        );

        expect(screen.getByText(/Media name contains road/i)).toBeTruthy();
        await userEvent.click(screen.getByRole('button', { name: /remove-rule-r1/i }));
        expect(onRemoveRule).toHaveBeenCalledWith('r1');
    });

    it('supports custom description and value formatters', () => {
        render(
            <ThemeProvider>
                <FilterChips
                    rules={[{ id: 'r1', field: 'MEDIA_WIDTH', operator: 'GREATER_THAN', value: 1920 }]}
                    getRuleDescription={() => 'Width constraint'}
                    getRuleValueLabel={(rule) => `${rule.value}px`}
                />
            </ThemeProvider>
        );

        expect(screen.getByText('Width constraint 1920px')).toBeTruthy();
    });

    it('lets getRuleLabel override description/value composition', () => {
        render(
            <ThemeProvider>
                <FilterChips
                    rules={[{ id: 'r1', field: 'MEDIA_WIDTH', operator: 'GREATER_THAN', value: 1920 }]}
                    getRuleDescription={() => 'Width constraint'}
                    getRuleValueLabel={(rule) => `${rule.value}px`}
                    getRuleLabel={() => 'Custom full chip label'}
                />
            </ThemeProvider>
        );

        expect(screen.getByText('Custom full chip label')).toBeTruthy();
    });

    it('renders clear all action and calls callback', async () => {
        const onClearAll = rstest.fn();

        render(
            <ThemeProvider>
                <FilterChips
                    rules={[{ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' }]}
                    onClearAll={onClearAll}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /clear all filters/i }));
        expect(onClearAll).toHaveBeenCalled();
    });

    it('renders empty state when there are no rules', () => {
        render(
            <ThemeProvider>
                <FilterChips rules={[]} emptyState={<span>No filters</span>} />
            </ThemeProvider>
        );

        expect(screen.getByText('No filters')).toBeTruthy();
    });
});
