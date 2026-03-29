import { NumberField } from '@geti-ui/ui';
import type { FilterValueNumberProps } from './types';

export function FilterValueNumber({ value, onChange, isDisabled, ariaLabel = 'Filter value' }: FilterValueNumberProps) {
    return (
        <NumberField
            aria-label={ariaLabel}
            isDisabled={isDisabled}
            value={typeof value === 'number' ? value : undefined}
            width="100%"
            onChange={(next) => onChange(next ?? null)}
        />
    );
}
