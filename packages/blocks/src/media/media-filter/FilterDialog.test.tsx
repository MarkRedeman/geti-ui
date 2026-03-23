import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { FilterDialog } from './FilterDialog';

const fields = [{ key: 'MEDIA_NAME', label: 'Media name', valueType: 'text' as const }];
const operators = [{ key: 'CONTAINS', label: 'contains' }];

describe('FilterDialog', () => {
    it('opens and shows dialog title', async () => {
        render(
            <ThemeProvider>
                <FilterDialog
                    fields={fields}
                    globalOperators={operators}
                    defaultDraft={{ condition: 'and', rules: [] }}
                    onApply={() => {}}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /open filter dialog/i }));
        expect(screen.getByRole('heading', { name: /show results matching/i })).toBeTruthy();
    });

    it('renders New filter button', async () => {
        render(
            <ThemeProvider>
                <FilterDialog
                    fields={fields}
                    globalOperators={operators}
                    defaultDraft={{ condition: 'and', rules: [] }}
                    onApply={() => {}}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /open filter dialog/i }));
        expect(screen.getByRole('button', { name: /new filter/i })).toBeTruthy();
    });

    it('applies only complete rules in immediate mode', () => {
        const onApply = rstest.fn();

        render(
            <ThemeProvider>
                <FilterDialog
                    fields={fields}
                    globalOperators={operators}
                    defaultDraft={{
                        condition: 'and',
                        rules: [
                            { id: 'incomplete', field: 'MEDIA_NAME', operator: '', value: null },
                            { id: 'complete', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' },
                        ],
                    }}
                    onApply={onApply}
                />
            </ThemeProvider>
        );

        expect(onApply).toHaveBeenCalled();
        expect(onApply).toHaveBeenLastCalledWith({
            condition: 'and',
            rules: [{ id: 'complete', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' }],
        });
    });

    it('ensures minimum row count when opened', async () => {
        render(
            <ThemeProvider>
                <FilterDialog
                    fields={fields}
                    globalOperators={operators}
                    defaultDraft={{ condition: 'and', rules: [] }}
                    minRuleCount={2}
                    onApply={() => {}}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /open filter dialog/i }));

        expect(screen.getAllByLabelText('Filter field')).toHaveLength(2);
    });
});
