import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ui/ui';
import { FilterValueText } from './FilterValueText';
import { FilterValueNumber } from './FilterValueNumber';
import { FilterValueSingleSelect } from './FilterValueSingleSelect';
import { FilterValueMultiSelect } from './FilterValueMultiSelect';

// ---------------------------------------------------------------------------
// FilterValueText
// ---------------------------------------------------------------------------
describe('FilterValueText', () => {
    it('renders a textbox with the current value', () => {
        render(
            <ThemeProvider>
                <FilterValueText value="hello" onChange={() => {}} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox', { name: /filter value/i }) as HTMLInputElement;
        expect(input.value).toBe('hello');
    });

    it('renders an empty input when value is null', () => {
        render(
            <ThemeProvider>
                <FilterValueText value={null} onChange={() => {}} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox', { name: /filter value/i }) as HTMLInputElement;
        expect(input.value).toBe('');
    });

    it('calls onChange with updated string when user types', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <FilterValueText value="" onChange={onChange} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox', { name: /filter value/i });
        await userEvent.type(input, 'abc');
        // onChange fires once per keystroke; each call receives the character(s) typed so far
        expect(onChange).toHaveBeenCalled();
        // The first call should be for the first character 'a'
        expect(onChange.mock.calls[0][0]).toBe('a');
    });

    it('respects isDisabled prop', () => {
        render(
            <ThemeProvider>
                <FilterValueText value="" onChange={() => {}} isDisabled />
            </ThemeProvider>
        );
        expect((screen.getByRole('textbox', { name: /filter value/i }) as HTMLInputElement).disabled).toBe(true);
    });

    it('uses a custom ariaLabel', () => {
        render(
            <ThemeProvider>
                <FilterValueText value="" onChange={() => {}} ariaLabel="Name filter" />
            </ThemeProvider>
        );
        expect(screen.getByRole('textbox', { name: /name filter/i })).toBeTruthy();
    });
});

// ---------------------------------------------------------------------------
// FilterValueNumber
// ---------------------------------------------------------------------------
describe('FilterValueNumber', () => {
    it('renders a numeric textbox with the current value', () => {
        render(
            <ThemeProvider>
                <FilterValueNumber value={42} onChange={() => {}} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox', { name: /filter value/i }) as HTMLInputElement;
        expect(input.value).toBe('42');
    });

    it('renders empty when value is null', () => {
        render(
            <ThemeProvider>
                <FilterValueNumber value={null} onChange={() => {}} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox', { name: /filter value/i }) as HTMLInputElement;
        expect(input.value).toBe('');
    });

    it('calls onChange with a number after committing a value', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <FilterValueNumber value={null} onChange={onChange} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox', { name: /filter value/i });
        await userEvent.clear(input);
        await userEvent.type(input, '7');
        await userEvent.tab(); // commit
        expect(onChange).toHaveBeenCalledWith(7);
    });

    it('respects isDisabled prop', () => {
        render(
            <ThemeProvider>
                <FilterValueNumber value={0} onChange={() => {}} isDisabled />
            </ThemeProvider>
        );
        expect((screen.getByRole('textbox', { name: /filter value/i }) as HTMLInputElement).disabled).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// FilterValueSingleSelect
// ---------------------------------------------------------------------------
const selectOptions = [
    { key: 'red', label: 'Red' },
    { key: 'green', label: 'Green' },
    { key: 'blue', label: 'Blue' },
];

describe('FilterValueSingleSelect', () => {
    it('renders a picker button', () => {
        render(
            <ThemeProvider>
                <FilterValueSingleSelect value={null} options={selectOptions} onChange={() => {}} />
            </ThemeProvider>
        );
        expect(screen.getByRole('button', { name: /filter value/i })).toBeTruthy();
    });

    it('opens and shows options', async () => {
        render(
            <ThemeProvider>
                <FilterValueSingleSelect value={null} options={selectOptions} onChange={() => {}} />
            </ThemeProvider>
        );
        await userEvent.click(screen.getByRole('button', { name: /filter value/i }));
        expect(screen.getByRole('option', { name: /red/i })).toBeTruthy();
        expect(screen.getByRole('option', { name: /green/i })).toBeTruthy();
        expect(screen.getByRole('option', { name: /blue/i })).toBeTruthy();
    });

    it('calls onChange with the selected key string', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <FilterValueSingleSelect value={null} options={selectOptions} onChange={onChange} />
            </ThemeProvider>
        );
        await userEvent.click(screen.getByRole('button', { name: /filter value/i }));
        await userEvent.click(screen.getByRole('option', { name: /green/i }));
        expect(onChange).toHaveBeenCalledWith('green');
    });

    it('respects isDisabled prop', () => {
        render(
            <ThemeProvider>
                <FilterValueSingleSelect value={null} options={selectOptions} onChange={() => {}} isDisabled />
            </ThemeProvider>
        );
        expect((screen.getByRole('button', { name: /filter value/i }) as HTMLButtonElement).disabled).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// FilterValueMultiSelect
// ---------------------------------------------------------------------------
const multiOptions = [
    { key: 'cat', label: 'Cat' },
    { key: 'dog', label: 'Dog' },
    { key: 'bird', label: 'Bird' },
];

describe('FilterValueMultiSelect', () => {
    it('renders a checkbox for each option', () => {
        render(
            <ThemeProvider>
                <FilterValueMultiSelect value={[]} options={multiOptions} onChange={() => {}} />
            </ThemeProvider>
        );
        expect(screen.getByRole('checkbox', { name: /cat/i })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: /dog/i })).toBeTruthy();
        expect(screen.getByRole('checkbox', { name: /bird/i })).toBeTruthy();
    });

    it('reflects pre-selected values as checked', () => {
        render(
            <ThemeProvider>
                <FilterValueMultiSelect value={['cat', 'bird']} options={multiOptions} onChange={() => {}} />
            </ThemeProvider>
        );
        expect((screen.getByRole('checkbox', { name: /cat/i }) as HTMLInputElement).checked).toBe(true);
        expect((screen.getByRole('checkbox', { name: /dog/i }) as HTMLInputElement).checked).toBe(false);
        expect((screen.getByRole('checkbox', { name: /bird/i }) as HTMLInputElement).checked).toBe(true);
    });

    it('calls onChange with updated array when a checkbox is toggled', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <FilterValueMultiSelect value={['cat']} options={multiOptions} onChange={onChange} />
            </ThemeProvider>
        );
        await userEvent.click(screen.getByRole('checkbox', { name: /dog/i }));
        expect(onChange).toHaveBeenCalled();
        const result: string[] = onChange.mock.calls[0][0];
        expect(result).toContain('cat');
        expect(result).toContain('dog');
    });

    it('calls onChange with item removed when already-checked box is unticked', async () => {
        const onChange = rstest.fn();
        render(
            <ThemeProvider>
                <FilterValueMultiSelect value={['cat', 'dog']} options={multiOptions} onChange={onChange} />
            </ThemeProvider>
        );
        await userEvent.click(screen.getByRole('checkbox', { name: /dog/i }));
        expect(onChange).toHaveBeenCalled();
        const result: string[] = onChange.mock.calls[0][0];
        expect(result).toContain('cat');
        expect(result).not.toContain('dog');
    });

    it('respects isDisabled prop', () => {
        render(
            <ThemeProvider>
                <FilterValueMultiSelect value={[]} options={multiOptions} onChange={() => {}} isDisabled />
            </ThemeProvider>
        );
        const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
        expect(checkboxes.every((cb) => cb.disabled)).toBe(true);
    });
});
