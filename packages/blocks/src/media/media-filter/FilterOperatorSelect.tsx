import { Picker, PickerItem } from '@geti-ai/ui';
import type { Key } from 'react';
import { resolveOperators } from './utils';
import type { FilterOperatorSelectProps } from './types';

export function FilterOperatorSelect({
    value,
    field,
    globalOperators = [],
    onChange,
    isDisabled,
    ariaLabel = 'Filter operator',
}: FilterOperatorSelectProps) {
    const operators = resolveOperators(field, globalOperators);

    return (
        <Picker
            aria-label={ariaLabel}
            selectedKey={value || undefined}
            isDisabled={isDisabled || !field}
            placeholder="Select operator"
            width="100%"
            onSelectionChange={(key: Key | null) => {
                if (key === null) {
                    return;
                }

                onChange(String(key));
            }}
        >
            {operators.map((operator) => (
                <PickerItem key={operator.key}>{operator.label}</PickerItem>
            ))}
        </Picker>
    );
}
