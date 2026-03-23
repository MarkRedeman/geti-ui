import { NumberField } from '@geti-ai/ui';
import type { FilterValueNumberProps } from './types';

export function FilterValueNumber({
    value,
    onChange,
    isDisabled,
    ariaLabel = 'Filter value',
}: FilterValueNumberProps) {
    return (
        <NumberField
            aria-label={ariaLabel}
            isDisabled={isDisabled}
            value={typeof value === 'number' ? value : undefined}
            onChange={(next) => onChange(next ?? null)}
        />
    );
}
