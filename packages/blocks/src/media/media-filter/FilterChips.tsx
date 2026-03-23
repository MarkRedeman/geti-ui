import { ActionButton, Flex, Text } from '@geti-ai/ui';
import { FilterChip } from './FilterChip';
import { getDefaultRuleDescription, getDefaultRuleValueLabel, getFieldByKey } from './utils';
import type { FilterChipsProps } from './types';

export function FilterChips({
    rules,
    fields = [],
    getRuleDescription,
    getRuleValueLabel,
    getRuleLabel,
    onRemoveRule,
    onClearAll,
    emptyState,
}: FilterChipsProps) {
    if (rules.length === 0) {
        return emptyState ? <>{emptyState}</> : null;
    }

    return (
        <Flex gap="size-100" wrap>
            {rules.map((rule) => {
                const field = getFieldByKey(fields, rule.field);
                const description = getRuleDescription?.(rule, field) ?? getDefaultRuleDescription(rule, field);
                const valueLabel = getRuleValueLabel?.(rule, field) ?? getDefaultRuleValueLabel(rule);
                const resolvedLabel = getRuleLabel ? getRuleLabel(rule, field) : `${description} ${valueLabel}`.trim();

                return (
                    <FilterChip
                        key={rule.id}
                        rule={rule}
                        label={resolvedLabel}
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
