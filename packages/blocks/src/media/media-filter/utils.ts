import type { FilterFieldOption, FilterModel, FilterOperatorOption, FilterRule } from './types';

export const DEFAULT_FILTER_CONDITION = 'and' as const;

export function createEmptyRule(id: string): FilterRule {
    return {
        id,
        field: '',
        operator: '',
        value: null,
    };
}

export function resolveOperators(
    field: FilterFieldOption | undefined,
    globalOperators: FilterOperatorOption[] = []
): FilterOperatorOption[] {
    if (field?.operators && field.operators.length > 0) {
        return field.operators;
    }

    return globalOperators;
}

export function getFieldByKey(fields: FilterFieldOption[], key: string): FilterFieldOption | undefined {
    return fields.find((field) => field.key === key);
}

export function isRuleComplete(rule: FilterRule): boolean {
    if (!rule.field || !rule.operator) {
        return false;
    }

    if (rule.value === null) {
        return false;
    }

    if (typeof rule.value === 'string') {
        return rule.value.trim().length > 0;
    }

    if (Array.isArray(rule.value)) {
        return rule.value.length > 0;
    }

    return true;
}

export function getValidRules(model: FilterModel): FilterRule[] {
    return model.rules.filter(isRuleComplete);
}

export function upsertRule(model: FilterModel, nextRule: FilterRule): FilterModel {
    return {
        ...model,
        rules: model.rules.map((rule) => (rule.id === nextRule.id ? nextRule : rule)),
    };
}

export function removeRuleById(model: FilterModel, id: string): FilterModel {
    return {
        ...model,
        rules: model.rules.filter((rule) => rule.id !== id),
    };
}
