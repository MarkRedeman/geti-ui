import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ui/ui';
import { FilterOperatorSelect } from './FilterOperatorSelect';
import type { FilterFieldOption } from './types';

const globalOperators = [
    { key: 'CONTAINS', label: 'contains' },
    { key: 'EQUALS', label: 'equals' },
];

const fieldWithOwnOperators: FilterFieldOption = {
    key: 'MEDIA_WIDTH',
    label: 'Width',
    valueType: 'number',
    operators: [
        { key: 'GREATER', label: 'greater than' },
        { key: 'LESS', label: 'less than' },
    ],
};

const fieldWithoutOwnOperators: FilterFieldOption = {
    key: 'MEDIA_NAME',
    label: 'Media name',
    valueType: 'text',
};

describe('FilterOperatorSelect', () => {
    it('is disabled when no field is provided', () => {
        render(
            <ThemeProvider>
                <FilterOperatorSelect value="" globalOperators={globalOperators} onChange={() => {}} />
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: /filter operator/i }).hasAttribute('disabled')).toBe(true);
    });

    it('uses field-specific operators when the field provides them', async () => {
        render(
            <ThemeProvider>
                <FilterOperatorSelect
                    value=""
                    field={fieldWithOwnOperators}
                    globalOperators={globalOperators}
                    onChange={() => {}}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByLabelText('Filter operator'));

        expect(screen.getByRole('option', { name: /greater than/i })).toBeTruthy();
        expect(screen.getByRole('option', { name: /less than/i })).toBeTruthy();
        expect(screen.queryByRole('option', { name: /contains/i })).toBeNull();
    });

    it('falls back to global operators when the field has none', async () => {
        render(
            <ThemeProvider>
                <FilterOperatorSelect
                    value=""
                    field={fieldWithoutOwnOperators}
                    globalOperators={globalOperators}
                    onChange={() => {}}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByLabelText('Filter operator'));

        expect(screen.getByRole('option', { name: /contains/i })).toBeTruthy();
        expect(screen.getByRole('option', { name: /equals/i })).toBeTruthy();
    });

    it('calls onChange with the selected key when selection changes', async () => {
        const onChange = rstest.fn();

        render(
            <ThemeProvider>
                <FilterOperatorSelect
                    value=""
                    field={fieldWithoutOwnOperators}
                    globalOperators={globalOperators}
                    onChange={onChange}
                />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByLabelText('Filter operator'));
        await userEvent.click(screen.getByRole('option', { name: /equals/i }));

        expect(onChange).toHaveBeenCalledWith('EQUALS');
    });
});
