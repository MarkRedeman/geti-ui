import { useMemo, useState } from 'react';
import { DEFAULT_FILTER_CONDITION, createEmptyRule, removeRuleById, upsertRule } from './utils';
import type { FilterModel, FilterRule } from './types';

export type UseFilterRulesDraftOptions = {
    initial: FilterModel;
    onCreate?: () => FilterRule;
};

export type UseFilterRulesDraftResult = {
    draft: FilterModel;
    isDirty: boolean;
    addRule: (rule?: Partial<FilterRule>) => void;
    updateRule: (id: string, patch: Partial<FilterRule>) => void;
    removeRule: (id: string) => void;
    clearAll: () => void;
    reset: (to?: FilterModel) => void;
    apply: () => FilterModel;
    setDraft: (next: FilterModel) => void;
};

function createRuleId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useFilterRulesDraft({ initial, onCreate }: UseFilterRulesDraftOptions): UseFilterRulesDraftResult {
    const [draft, setDraft] = useState<FilterModel>(initial);

    const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);

    const addRule = (rule?: Partial<FilterRule>) => {
        const nextRule = onCreate
            ? onCreate()
            : {
                  ...createEmptyRule(createRuleId()),
                  ...rule,
              };

        setDraft((previous) => ({
            ...previous,
            condition: previous.condition ?? DEFAULT_FILTER_CONDITION,
            rules: [...previous.rules, nextRule],
        }));
    };

    const updateRule = (id: string, patch: Partial<FilterRule>) => {
        setDraft((previous) => {
            const current = previous.rules.find((rule) => rule.id === id);
            if (!current) {
                return previous;
            }

            return upsertRule(previous, {
                ...current,
                ...patch,
            });
        });
    };

    const removeRule = (id: string) => {
        setDraft((previous) => removeRuleById(previous, id));
    };

    const clearAll = () => {
        setDraft((previous) => ({
            ...previous,
            rules: [],
        }));
    };

    const reset = (to?: FilterModel) => {
        setDraft(to ?? initial);
    };

    const apply = () => draft;

    return {
        draft,
        isDirty,
        addRule,
        updateRule,
        removeRule,
        clearAll,
        reset,
        apply,
        setDraft,
    };
}
