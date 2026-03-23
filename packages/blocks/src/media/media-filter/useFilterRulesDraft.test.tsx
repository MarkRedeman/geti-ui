import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { useFilterRulesDraft } from './useFilterRulesDraft';
import type { FilterModel } from './types';

const initial: FilterModel = {
    condition: 'and',
    rules: [],
};

describe('useFilterRulesDraft', () => {
    it('adds and removes rules', () => {
        const { result } = renderHook(() => useFilterRulesDraft({ initial }));

        act(() => {
            result.current.addRule({ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' });
        });
        expect(result.current.draft.rules).toHaveLength(1);

        act(() => {
            result.current.removeRule('r1');
        });
        expect(result.current.draft.rules).toHaveLength(0);
    });

    it('updates a rule patch', () => {
        const { result } = renderHook(() => useFilterRulesDraft({ initial }));

        act(() => {
            result.current.addRule({ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' });
        });
        act(() => {
            result.current.updateRule('r1', { value: 'car' });
        });

        expect(result.current.draft.rules[0]?.value).toBe('car');
    });

    it('tracks dirty state, reset and apply', () => {
        const { result } = renderHook(() => useFilterRulesDraft({ initial }));

        expect(result.current.isDirty).toBe(false);

        act(() => {
            result.current.addRule({ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' });
        });

        expect(result.current.isDirty).toBe(true);
        expect(result.current.apply()).toEqual({
            condition: 'and',
            rules: [{ id: 'r1', field: 'MEDIA_NAME', operator: 'CONTAINS', value: 'road' }],
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.isDirty).toBe(false);
        expect(result.current.draft).toEqual(initial);
    });
});
