import { TextField } from '@geti-ai/ui';
import type { FilterValueTextProps } from './types';

export function FilterValueText({ value, onChange, isDisabled, ariaLabel = 'Filter value' }: FilterValueTextProps) {
    return (
        <TextField
            aria-label={ariaLabel}
            isDisabled={isDisabled}
            value={typeof value === 'string' ? value : ''}
            onChange={(next) => onChange(next)}
        />
    );
}
