import { Picker, PickerItem } from '@geti-ai/ui';
import type { Key } from 'react';
import type { FilterFieldSelectProps } from './types';

export function FilterFieldSelect({
    value,
    fields,
    onChange,
    isDisabled,
    ariaLabel = 'Filter field',
}: FilterFieldSelectProps) {
    return (
        <Picker
            aria-label={ariaLabel}
            selectedKey={value || undefined}
            isDisabled={isDisabled}
            placeholder="Select field"
            onSelectionChange={(key: Key | null) => {
                if (key === null) {
                    return;
                }

                onChange(String(key));
            }}
        >
            {fields
                .filter((field) => !field.disabled)
                .map((field) => (
                    <PickerItem key={field.key}>{field.label}</PickerItem>
                ))}
        </Picker>
    );
}
