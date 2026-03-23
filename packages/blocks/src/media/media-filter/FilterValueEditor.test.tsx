import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ai/ui';
import { FilterValueEditor } from './FilterValueEditor';
import type { FilterFieldOption, FilterRule } from './types';

const baseRule: FilterRule = { id: 'r1', field: 'FIELD_A', operator: 'CONTAINS', value: null };

function renderEditor(
    rule: FilterRule,
    field: FilterFieldOption | undefined,
    onChange = () => {},
    extra: Partial<React.ComponentProps<typeof FilterValueEditor>> = {}
) {
    return render(
        <ThemeProvider>
            <FilterValueEditor rule={rule} field={field} onChange={onChange} {...extra} />
        </ThemeProvider>
    );
}

describe('FilterValueEditor', () => {
    it('renders nothing when no field is provided', () => {
        const { container } = renderEditor(baseRule, undefined);
        // renders an empty placeholder div to preserve grid layout
        expect(container.textContent).toBe('');
    });

    it('renders text input for valueType=text', () => {
        const field: FilterFieldOption = { key: 'FIELD_A', label: 'Field A', valueType: 'text' };
        renderEditor({ ...baseRule, value: 'hello' }, field);
        expect(screen.getByRole('textbox', { name: /filter value/i })).toBeTruthy();
    });

    it('renders number input for valueType=number', () => {
        const field: FilterFieldOption = { key: 'FIELD_A', label: 'Field A', valueType: 'number' };
        renderEditor({ ...baseRule, value: 42 }, field);
        // React Spectrum NumberField renders a group wrapping a textbox
        expect(screen.getByRole('textbox', { name: /filter value/i })).toBeTruthy();
    });

    it('renders single-select picker for valueType=enum', () => {
        const field: FilterFieldOption = {
            key: 'FIELD_A',
            label: 'Field A',
            valueType: 'enum',
            editorConfig: { options: [{ key: 'opt1', label: 'Option 1' }] },
        };
        renderEditor({ ...baseRule, value: 'opt1' }, field);
        // Picker renders a button element with the aria-label
        expect(screen.getByRole('button', { name: /filter value/i })).toBeTruthy();
    });

    it('renders multi-select checkboxes for valueType=multi-enum', () => {
        const field: FilterFieldOption = {
            key: 'FIELD_A',
            label: 'Field A',
            valueType: 'multi-enum',
            editorConfig: { options: [{ key: 'a', label: 'Alpha' }, { key: 'b', label: 'Beta' }] },
        };
        renderEditor({ ...baseRule, value: ['a'] }, field);
        expect(screen.getByRole('checkbox', { name: /alpha/i })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: /beta/i })).toBeTruthy();
    });

    it('defaults to text input for unknown valueType', () => {
        const field: FilterFieldOption = { key: 'FIELD_A', label: 'Field A', valueType: 'unknown-type' };
        renderEditor({ ...baseRule, value: 'foo' }, field);
        expect(screen.getByRole('textbox', { name: /filter value/i })).toBeTruthy();
    });

    it('delegates rendering to renderValueEditor when provided', () => {
        const field: FilterFieldOption = { key: 'FIELD_A', label: 'Field A', valueType: 'text' };
        renderEditor(baseRule, field, () => {}, {
            renderValueEditor: () => <span data-testid="custom-editor">Custom</span>,
        });
        expect(screen.getByTestId('custom-editor')).toBeTruthy();
        // built-in text input should NOT be rendered
        expect(screen.queryByRole('textbox', { name: /filter value/i })).toBeNull();
    });

    it('passes rule, field, onChange and isDisabled to renderValueEditor', () => {
        const field: FilterFieldOption = { key: 'FIELD_A', label: 'Field A', valueType: 'text' };
        const captured: Record<string, unknown> = {};
        const onChange = rstest.fn();

        renderEditor(baseRule, field, onChange, {
            isDisabled: true,
            renderValueEditor: (args) => {
                Object.assign(captured, args);
                return <span />;
            },
        });

        expect(captured.rule).toEqual(baseRule);
        expect(captured.field).toEqual(field);
        expect(captured.onChange).toBe(onChange);
        expect(captured.isDisabled).toBe(true);
    });
});
