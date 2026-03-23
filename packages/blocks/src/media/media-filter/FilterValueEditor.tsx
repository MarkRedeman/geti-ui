import { FilterValueDate } from './FilterValueDate';
import { FilterValueMultiSelect } from './FilterValueMultiSelect';
import { FilterValueNumber } from './FilterValueNumber';
import { FilterValueSingleSelect } from './FilterValueSingleSelect';
import { FilterValueText } from './FilterValueText';
import type { FilterValueEditorProps } from './types';

type EnumEditorConfig = {
    options?: Array<{ key: string; label: string }>;
};

export function FilterValueEditor({ rule, field, onChange, isDisabled, renderValueEditor }: FilterValueEditorProps) {
    if (renderValueEditor) {
        return <>{renderValueEditor({ rule, field, onChange, isDisabled })}</>;
    }

    if (!field) {
        return <div />;
    }

    const editorConfig = (field.editorConfig ?? {}) as EnumEditorConfig;
    const options = editorConfig.options ?? [];

    switch (field.valueType) {
        case 'number':
            return <FilterValueNumber value={rule.value} onChange={onChange} isDisabled={isDisabled} />;
        case 'date':
            return <FilterValueDate value={rule.value} onChange={onChange} isDisabled={isDisabled} />;
        case 'enum':
            return (
                <FilterValueSingleSelect
                    value={rule.value}
                    options={options}
                    onChange={onChange}
                    isDisabled={isDisabled}
                />
            );
        case 'multi-enum':
            return (
                <FilterValueMultiSelect
                    value={rule.value}
                    options={options}
                    onChange={onChange}
                    isDisabled={isDisabled}
                />
            );
        case 'text':
        default:
            return <FilterValueText value={rule.value} onChange={onChange} isDisabled={isDisabled} />;
    }
}
