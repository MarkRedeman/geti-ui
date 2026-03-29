import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { ThemeProvider } from '@geti-ui/ui';
import { FilterFieldSelect } from './FilterFieldSelect';

const fields = [
    { key: 'MEDIA_NAME', label: 'Media name', valueType: 'text' as const },
    { key: 'MEDIA_WIDTH', label: 'Width', valueType: 'number' as const },
    { key: 'MEDIA_TYPE', label: 'Media type', valueType: 'enum' as const, disabled: true },
];

describe('FilterFieldSelect', () => {
    it('renders only non-disabled fields', async () => {
        render(
            <ThemeProvider>
                <FilterFieldSelect value="" fields={fields} onChange={() => {}} />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByLabelText('Filter field'));

        expect(screen.getByRole('option', { name: /media name/i })).toBeTruthy();
        expect(screen.getByRole('option', { name: /width/i })).toBeTruthy();
        expect(screen.queryByRole('option', { name: /media type/i })).toBeNull();
    });

    it('calls onChange with the selected key when selection changes', async () => {
        const onChange = rstest.fn();

        render(
            <ThemeProvider>
                <FilterFieldSelect value="" fields={fields} onChange={onChange} />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByLabelText('Filter field'));
        await userEvent.click(screen.getByRole('option', { name: /width/i }));

        expect(onChange).toHaveBeenCalledWith('MEDIA_WIDTH');
    });
});
