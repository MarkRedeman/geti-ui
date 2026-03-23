import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider, DialogTrigger, ActionButton } from '@geti-ai/ui';
import { FilterDialog } from './FilterDialog';
import userEvent from '@testing-library/user-event';

const fields = [{ key: 'MEDIA_NAME', label: 'Media name', valueType: 'text' as const }];
const operators = [{ key: 'CONTAINS', label: 'contains' }];

describe('FilterDialog', () => {
    it('shows dialog title', async () => {
        render(
            <ThemeProvider>
                <DialogTrigger isOpen>
                    <ActionButton>Open</ActionButton>
                    <FilterDialog
                        fields={fields}
                        globalOperators={operators}
                        defaultDraft={{ condition: 'and', rules: [] }}
                        onApply={() => {}}
                    />
                </DialogTrigger>
            </ThemeProvider>
        );

        expect(screen.getByText(/show results matching/i)).toBeTruthy();
    });

    it('renders New filter button', async () => {
        render(
            <ThemeProvider>
                <DialogTrigger isOpen>
                    <ActionButton>Open</ActionButton>
                    <FilterDialog
                        fields={fields}
                        globalOperators={operators}
                        defaultDraft={{ condition: 'and', rules: [] }}
                        onApply={() => {}}
                    />
                </DialogTrigger>
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: /new filter/i })).toBeTruthy();
    });

    it('applies only complete rules in immediate mode', async () => {
        const onApply = rstest.fn();

        render(
            <ThemeProvider>
                <DialogTrigger isOpen>
                    <ActionButton>Open</ActionButton>
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
                </DialogTrigger>
            </ThemeProvider>
        );

        expect(onApply).toHaveBeenCalled();
        expect(onApply).toHaveBeenLastCalledWith({
            condition: 'and',
            rules: [{ id: 'complete', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' }],
        });
    });

    it('ensures minimum row count when mounted', async () => {
        render(
            <ThemeProvider>
                <DialogTrigger isOpen>
                    <ActionButton>Open</ActionButton>
                    <FilterDialog
                        fields={fields}
                        globalOperators={operators}
                        defaultDraft={{ condition: 'and', rules: [] }}
                        minRuleCount={2}
                        onApply={() => {}}
                    />
                </DialogTrigger>
            </ThemeProvider>
        );

        expect(screen.getAllByLabelText('Filter field')).toHaveLength(2);
    });
});
