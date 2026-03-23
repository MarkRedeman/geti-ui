import type { CSSProperties, ReactNode } from 'react';

export type FilterCondition = 'and' | 'or' | 'nor';

export type BuiltinValueType = 'text' | 'number' | 'date' | 'enum' | 'multi-enum';
export type FilterValueType = BuiltinValueType | (string & {});

export type FilterRuleValue = string | number | boolean | string[] | number[] | null;

export type FilterRule = {
    id: string;
    field: string;
    operator: string;
    value: FilterRuleValue;
};

export type FilterModel = {
    condition: FilterCondition;
    rules: FilterRule[];
};

export type FilterOperatorOption = {
    key: string;
    label: string;
    compatibleWith?: FilterValueType[];
};

export type FilterFieldOption<TEditorConfig = unknown> = {
    key: string;
    label: string;
    valueType: FilterValueType;
    operators?: FilterOperatorOption[];
    group?: string;
    disabled?: boolean;
    editorConfig?: TEditorConfig;
};

export type RenderRuleLabel = (rule: FilterRule, field?: FilterFieldOption) => string;
export type RenderRuleDescription = (rule: FilterRule, field?: FilterFieldOption) => string;
export type RenderRuleValueLabel = (rule: FilterRule, field?: FilterFieldOption) => string;

export type RenderValueEditorArgs = {
    rule: FilterRule;
    field?: FilterFieldOption;
    onChange: (nextValue: FilterRuleValue) => void;
    isDisabled?: boolean;
};

export type RenderValueEditor = (args: RenderValueEditorArgs) => ReactNode;

export type RenderRowArgs = {
    rule: FilterRule;
    fields: FilterFieldOption[];
    operators: FilterOperatorOption[];
    onChange: (rule: FilterRule) => void;
    onRemove: () => void;
    renderValueEditor?: RenderValueEditor;
};

export type RenderRow = (args: RenderRowArgs) => ReactNode;

export type FilterChipProps = {
    rule: FilterRule;
    label: string;
    onRemove?: () => void;
    id?: string;
};

export type FilterChipsProps = {
    rules: FilterRule[];
    fields?: FilterFieldOption[];
    getRuleDescription?: RenderRuleDescription;
    getRuleValueLabel?: RenderRuleValueLabel;
    getRuleLabel?: RenderRuleLabel;
    onRemoveRule?: (ruleId: string) => void;
    onClearAll?: () => void;
    emptyState?: ReactNode;
    id?: string;
};

export type FilterFieldSelectProps = {
    value: string;
    fields: FilterFieldOption[];
    onChange: (fieldKey: string) => void;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type FilterOperatorSelectProps = {
    value: string;
    field?: FilterFieldOption;
    globalOperators?: FilterOperatorOption[];
    onChange: (operatorKey: string) => void;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type FilterValueTextProps = {
    value: FilterRuleValue;
    onChange: (value: FilterRuleValue) => void;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type FilterValueNumberProps = {
    value: FilterRuleValue;
    onChange: (value: FilterRuleValue) => void;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type FilterValueDateProps = {
    value: FilterRuleValue;
    onChange: (value: FilterRuleValue) => void;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type FilterValueSingleSelectProps = {
    value: FilterRuleValue;
    options: Array<{ key: string; label: string }>;
    onChange: (value: FilterRuleValue) => void;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type FilterValueMultiSelectProps = {
    value: FilterRuleValue;
    options: Array<{ key: string; label: string }>;
    onChange: (value: FilterRuleValue) => void;
    isDisabled?: boolean;
    ariaLabel?: string;
};

export type FilterValueEditorProps = {
    rule: FilterRule;
    field?: FilterFieldOption;
    onChange: (value: FilterRuleValue) => void;
    isDisabled?: boolean;
    renderValueEditor?: RenderValueEditor;
};

export type FilterRowProps = {
    rule: FilterRule;
    fields: FilterFieldOption[];
    globalOperators?: FilterOperatorOption[];
    onChange: (rule: FilterRule) => void;
    onRemove?: () => void;
    renderValueEditor?: RenderValueEditor;
    isDisabled?: boolean;
};

export type FilterTriggerButtonProps = {
    isSelected?: boolean;
    isDisabled?: boolean;
    onPress?: () => void;
    ariaLabel?: string;
    id?: string;
};

export type FilterDialogProps = {
    fields: FilterFieldOption[];
    globalOperators?: FilterOperatorOption[];

    draft?: FilterModel;
    onDraftChange?: (next: FilterModel) => void;
    defaultDraft?: FilterModel;

    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;

    onApply: (model: FilterModel) => void;
    onCancel?: () => void;

    renderRow?: RenderRow;
    renderValueEditor?: RenderValueEditor;

    totalMatches?: number;
    isFetchingMatches?: boolean;
    isDisabled?: boolean;
    trigger?: ReactNode;
    id?: string;
    dialogTitle?: string;
    minRuleCount?: number;
    trailingContentContainerStyle?: CSSProperties;
};
