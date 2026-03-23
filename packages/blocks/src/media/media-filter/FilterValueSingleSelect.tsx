import { Picker, PickerItem } from '@geti-ai/ui';
import type { Key } from 'react';
import type { FilterValueSingleSelectProps } from './types';

export function FilterValueSingleSelect({
    value,
    options,
    onChange,
    isDisabled,
    ariaLabel = 'Filter value',
}: FilterValueSingleSelectProps) {
    return (
        <Picker
            aria-label={ariaLabel}
            selectedKey={typeof value === 'string' ? value : undefined}
            isDisabled={isDisabled}
            placeholder="Select value"
            onSelectionChange={(key: Key | null) => {
                if (key === null) {
                    return;
                }

                onChange(String(key));
            }}
        >
            {options.map((option) => (
                <PickerItem key={option.key}>{option.label}</PickerItem>
            ))}
        </Picker>
    );
}
