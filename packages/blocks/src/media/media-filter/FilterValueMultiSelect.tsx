import { Checkbox, CheckboxGroup } from '@geti-ai/ui';
import type { FilterValueMultiSelectProps } from './types';

export function FilterValueMultiSelect({
    value,
    options,
    onChange,
    isDisabled,
    ariaLabel = 'Filter value',
}: FilterValueMultiSelectProps) {
    const selectedValues = Array.isArray(value) ? value.map(String) : [];

    return (
        <CheckboxGroup
            aria-label={ariaLabel}
            isDisabled={isDisabled}
            value={selectedValues}
            onChange={(next) => onChange(next)}
        >
            {options.map((option) => (
                <Checkbox key={option.key} value={option.key}>
                    {option.label}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
