import { DatePicker } from '@geti-ai/ui';
import { parseDate } from '@internationalized/date';
import type { FilterValueDateProps } from './types';

export function FilterValueDate({ value, onChange, isDisabled, ariaLabel = 'Filter value' }: FilterValueDateProps) {
    const selectedDate = typeof value === 'string' && value.length > 0 ? parseDate(value) : null;

    return (
        <DatePicker
            aria-label={ariaLabel}
            isDisabled={isDisabled}
            value={selectedDate}
            onChange={(next) => onChange(next ? next.toString() : null)}
        />
    );
}
