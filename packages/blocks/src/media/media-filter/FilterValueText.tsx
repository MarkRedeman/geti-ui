import { TextField } from '@geti-ui/ui';
import type { FilterValueTextProps } from './types';

export function FilterValueText({ value, onChange, isDisabled, ariaLabel = 'Filter value' }: FilterValueTextProps) {
    return (
        <TextField
            aria-label={ariaLabel}
            isDisabled={isDisabled}
            value={typeof value === 'string' ? value : ''}
            width="100%"
            onChange={(next) => onChange(next)}
        />
    );
}
