import { ActionButton, Flex, Text } from '@geti-ai/ui';
import { FilterChip } from './FilterChip';
import { getFieldByKey } from './utils';
import type { FilterChipsProps } from './types';

const defaultRuleLabel: NonNullable<FilterChipsProps['getRuleLabel']> = (rule, field) => {
    const fieldLabel = field?.label ?? rule.field;
    const valueLabel = Array.isArray(rule.value) ? rule.value.join(', ') : String(rule.value ?? '');

    return `${fieldLabel} ${rule.operator} ${valueLabel}`.trim();
};

export function FilterChips({
    rules,
    fields = [],
    getRuleLabel = defaultRuleLabel,
    onRemoveRule,
    onClearAll,
    emptyState,
    id,
}: FilterChipsProps) {
    if (rules.length === 0) {
        return emptyState ? <>{emptyState}</> : null;
    }

    return (
        <Flex gap="size-100" wrap>
            {rules.map((rule) => {
                const field = getFieldByKey(fields, rule.field);
                return (
                    <FilterChip
                        key={rule.id}
                        rule={rule}
                        id={id}
                        label={getRuleLabel(rule, field)}
                        onRemove={onRemoveRule ? () => onRemoveRule(rule.id) : undefined}
                    />
                );
            })}

            {onClearAll ? (
                <ActionButton isQuiet onPress={onClearAll} aria-label="Clear all filters">
                    <Text>Clear all</Text>
                </ActionButton>
            ) : null}
        </Flex>
    );
}
