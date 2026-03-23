import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { FilterRow } from './FilterRow';

const fields = [
    { key: 'MEDIA_NAME', label: 'Media name', valueType: 'text' as const },
    { key: 'MEDIA_WIDTH', label: 'Width', valueType: 'number' as const },
];

const operators = [
    { key: 'CONTAINS', label: 'contains' },
    { key: 'GREATER', label: 'greater than' },
];

describe('FilterRow', () => {
    it('renders field/operator/value and remove button', () => {
        render(
            <ThemeProvider>
                <FilterRow
                    rule={{ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'abc' }}
                    fields={fields}
                    globalOperators={operators}
                    onChange={() => {}}
                    onRemove={() => {}}
                />
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: /remove filter r1/i })).toBeTruthy();
    });

    it('triggers remove callback', async () => {
        const onRemove = rstest.fn();

        render(
            <ThemeProvider>
                <FilterRow
                    rule={{ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'abc' }}
                    fields={fields}
                    globalOperators={operators}
                    onChange={() => {}}
                    onRemove={onRemove}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /remove filter r1/i }));
        expect(onRemove).toHaveBeenCalled();
    });

    it('resets operator and value when field changes', async () => {
        const onChange = rstest.fn();

        render(
            <ThemeProvider>
                <FilterRow
                    rule={{ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'abc' }}
                    fields={fields}
                    globalOperators={operators}
                    onChange={onChange}
                />
            </ThemeProvider>
        );

        const fieldPicker = screen.getByLabelText('Filter field');
        await userEvent.click(fieldPicker);
        await userEvent.click(screen.getByRole('option', { name: /width/i }));

        expect(onChange).toHaveBeenCalledWith({ id: 'r1', field: 'MEDIA_WIDTH', operator: '', value: null });
    });
});
