import { ActionButton, Grid } from '@geti-ai/ui';
import { Delete } from '@geti-ai/ui/icons';
import { FilterFieldSelect } from './FilterFieldSelect';
import { FilterOperatorSelect } from './FilterOperatorSelect';
import { FilterValueEditor } from './FilterValueEditor';
import { getFieldByKey, resolveOperators } from './utils';
import type { FilterRowProps } from './types';

export function FilterRow({
    rule,
    fields,
    globalOperators = [],
    onChange,
    onRemove,
    renderValueEditor,
    isDisabled,
}: FilterRowProps) {
    const selectedField = getFieldByKey(fields, rule.field);
    const resolvedOperators = resolveOperators(selectedField, globalOperators);

    return (
        <Grid columns={['28%', '28%', '28%', '1fr']} columnGap="size-200">
            <FilterFieldSelect
                value={rule.field}
                fields={fields}
                isDisabled={isDisabled}
                onChange={(field) =>
                    onChange({
                        ...rule,
                        field,
                        operator: '',
                        value: null,
                    })
                }
            />

            <FilterOperatorSelect
                value={rule.operator}
                field={selectedField}
                globalOperators={globalOperators}
                isDisabled={isDisabled}
                onChange={(operator) => {
                    const stillValid = resolvedOperators.some((item) => item.key === operator);
                    onChange({
                        ...rule,
                        operator,
                        value: stillValid ? rule.value : null,
                    });
                }}
            />

            <FilterValueEditor
                rule={rule}
                field={selectedField}
                isDisabled={isDisabled || !rule.operator}
                renderValueEditor={renderValueEditor}
                onChange={(value) => onChange({ ...rule, value })}
            />

            {onRemove ? (
                <ActionButton isQuiet isDisabled={isDisabled} onPress={onRemove} aria-label={`Remove filter ${rule.id}`}>
                    <Delete />
                </ActionButton>
            ) : null}
        </Grid>
    );
}
