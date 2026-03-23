import { renderHook } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';
import { createMediaRenderContext, useFocusOnSelect, useVirtualMediaItems } from './hooks';

type TestItem = { id: string; label: string };

describe('useVirtualMediaItems', () => {
    it('returns empty array for zero items', () => {
        const { result } = renderHook(() => useVirtualMediaItems<TestItem>(0, () => undefined));
        expect(result.current).toEqual([]);
    });

    it('returns expected length and placeholder keys', () => {
        const getItemAt = (index: number) => (index === 1 ? { id: 'b', label: 'B' } : undefined);
        const { result } = renderHook(() => useVirtualMediaItems<TestItem>(3, getItemAt));

        expect(result.current).toHaveLength(3);
        expect(result.current[0]?.key).toBe('placeholder-0');
        expect(result.current[1]?.key).toBe('b');
        expect(result.current[2]?.key).toBe('placeholder-2');
    });
});

describe('createMediaRenderContext', () => {
    it('marks placeholder entries as not selected and no-op on press', () => {
        const onItemPress = rstest.fn();
        const context = createMediaRenderContext<TestItem>({
            entry: { key: 'placeholder-0', index: 0, item: undefined },
            effectiveSelection: new Set<string>(),
            effectiveSelectionSet: new Set<string>(),
            selectionMode: 'multiple',
            onItemPress,
        });

        expect(context.isPlaceholder).toBe(true);
        expect(context.isSelected).toBe(false);
        context.onPress();
        expect(onItemPress).not.toHaveBeenCalled();
    });

    it('treats all selection as selected', () => {
        const context = createMediaRenderContext<TestItem>({
            entry: { key: 'a', index: 0, item: { id: 'a', label: 'A' } },
            effectiveSelection: 'all',
            effectiveSelectionSet: new Set<string>(),
            selectionMode: 'multiple',
        });

        expect(context.isSelected).toBe(true);
    });

    it('calls onItemPress and onItemDoublePress for real items', () => {
        const onItemPress = rstest.fn();
        const onItemDoublePress = rstest.fn();
        const context = createMediaRenderContext<TestItem>({
            entry: { key: 'a', index: 2, item: { id: 'a', label: 'A' } },
            effectiveSelection: new Set(['a']),
            effectiveSelectionSet: new Set(['a']),
            selectionMode: 'multiple',
            onItemPress,
            onItemDoublePress,
        });

        context.onPress();
        context.onDoublePress();

        expect(onItemPress).toHaveBeenCalledOnce();
        expect(onItemDoublePress).toHaveBeenCalledOnce();
        expect(onItemPress.mock.calls[0]?.[0]?.index).toBe(2);
    });
});

describe('useFocusOnSelect', () => {
    it('does not focus when disabled', () => {
        const root = document.createElement('div');
        const option = document.createElement('div');
        option.setAttribute('data-key', 'a');
        option.setAttribute('role', 'option');
        option.tabIndex = -1;
        option.focus = rstest.fn();
        option.scrollIntoView = rstest.fn();
        root.appendChild(option);

        renderHook(() =>
            useFocusOnSelect({
                focusOnSelect: false,
                selection: new Set(['a']),
                containerRef: { current: root },
            })
        );

        expect(option.focus).not.toHaveBeenCalled();
    });

    it('focuses selected element when enabled', () => {
        const root = document.createElement('div');
        const option = document.createElement('div');
        option.setAttribute('data-key', 'a');
        option.setAttribute('role', 'option');
        option.tabIndex = -1;
        option.focus = rstest.fn();
        option.scrollIntoView = rstest.fn();
        root.appendChild(option);

        renderHook(() =>
            useFocusOnSelect({
                focusOnSelect: true,
                selection: new Set(['a']),
                containerRef: { current: root },
            })
        );

        expect(option.focus).toHaveBeenCalled();
    });
});
