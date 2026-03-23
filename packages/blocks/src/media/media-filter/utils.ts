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

function formatOperatorString(operator: string): string {
    return operator.split('_').join(' ').toLowerCase();
}

const OP_IN = 'IN';
const OP_NOT_IN = 'NOT_IN';
const OP_CONTAINS = 'CONTAINS';
const OP_LESS = 'LESS';
const OP_LESS_THAN = 'LESS_THAN';
const OP_EQUAL = 'EQUAL';
const OP_NOT_EQUAL = 'NOT_EQUAL';

function normalizeFieldKey(fieldKey: string): string {
    return fieldKey.trim().toUpperCase();
}

export function getDefaultRuleDescription(rule: FilterRule, field?: FilterFieldOption): string {
    const fieldKey = normalizeFieldKey(rule.field);
    const operator = rule.operator.trim().toUpperCase();

    if (fieldKey === 'LABEL_ID' || fieldKey === 'LABELS') {
        return operator === OP_IN ? 'With label(s)' : 'Without label(s)';
    }

    if (fieldKey === 'ANNOTATION_SCENE_STATE') {
        return 'Annotation status is';
    }

    if (fieldKey === 'ANNOTATION_CREATION_DATE') {
        return operator === OP_LESS || operator === OP_LESS_THAN ? 'Annotated before' : 'Annotated after';
    }

    if (fieldKey === 'USER_NAME' || fieldKey === 'ANNOTATED_BY') {
        return operator === OP_NOT_EQUAL ? 'Not annotated by' : 'Annotated by';
    }

    if (fieldKey === 'MEDIA_HEIGHT') {
        return operator === OP_NOT_EQUAL || operator === OP_EQUAL
            ? `Media height is ${formatOperatorString(rule.operator)} to`
            : `Media height is ${formatOperatorString(rule.operator)} than`;
    }

    if (fieldKey === 'MEDIA_WIDTH') {
        return operator === OP_NOT_EQUAL || operator === OP_EQUAL
            ? `Media width is ${formatOperatorString(rule.operator)} to`
            : `Media width is ${formatOperatorString(rule.operator)} than`;
    }

    if (fieldKey === 'MEDIA_UPLOAD_DATE' || fieldKey === 'UPLOADED_AT') {
        return operator === OP_LESS || operator === OP_LESS_THAN ? 'Uploaded before' : 'Uploaded after';
    }

    if (fieldKey === 'MEDIA_NAME') {
        return operator === OP_CONTAINS
            ? 'Media name contains'
            : `Media name is ${formatOperatorString(rule.operator)} to`;
    }

    if (fieldKey === 'MEDIA_TYPE') {
        return 'Media is';
    }

    if (fieldKey === 'SHAPE_TYPE') {
        if (operator === OP_IN) {
            return 'Has shape(s)';
        }

        if (operator === OP_NOT_IN) {
            return "Doesn't have shape(s)";
        }

        return `Shape is ${formatOperatorString(rule.operator)} to`;
    }

    if (fieldKey === 'SHAPE_AREA_PERCENTAGE') {
        return `Area % ${formatOperatorString(rule.operator)} than`;
    }

    if (fieldKey === 'SHAPE_AREA_PIXEL') {
        return `Area pixel ${formatOperatorString(rule.operator)} than`;
    }

    const fieldLabel = field?.label ?? rule.field;
    return `${fieldLabel} ${rule.operator}`.trim();
}

export function getDefaultRuleValueLabel(rule: FilterRule): string {
    if (Array.isArray(rule.value)) {
        return rule.value.join(', ');
    }

    if (rule.value === null) {
        return '';
    }

    const fieldKey = normalizeFieldKey(rule.field);
    if ((fieldKey === 'MEDIA_UPLOAD_DATE' || fieldKey === 'UPLOADED_AT' || fieldKey === 'ANNOTATION_CREATION_DATE') &&
        typeof rule.value === 'string') {
        const parsedDate = new Date(rule.value);
        if (!Number.isNaN(parsedDate.getTime())) {
            return parsedDate.toLocaleDateString();
        }
    }

    if (fieldKey === 'SHAPE_AREA_PERCENTAGE' && typeof rule.value === 'number') {
        return `${rule.value * 100}%`;
    }

    return String(rule.value);
}
