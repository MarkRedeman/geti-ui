import { fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { usePanning } from './usePanning';

describe('usePanning', () => {
    it('returns false by default', () => {
        const { result } = renderHook(() => usePanning());
        expect(result.current.isPanning).toBe(false);
    });

    it('sets isPanning to true on Control keydown', () => {
        const { result } = renderHook(() => usePanning());

        act(() => {
            fireEvent.keyDown(window, { key: 'Control' });
        });
        expect(result.current.isPanning).toBe(true);
    });

    it('sets isPanning to false on Control keyup', () => {
        const { result } = renderHook(() => usePanning());

        act(() => {
            fireEvent.keyDown(window, { key: 'Control' });
        });
        expect(result.current.isPanning).toBe(true);

        act(() => {
            fireEvent.keyUp(window, { key: 'Control' });
        });
        expect(result.current.isPanning).toBe(false);
    });

    it('sets isPanning to true on Meta keydown (macOS)', () => {
        const { result } = renderHook(() => usePanning());

        act(() => {
            fireEvent.keyDown(window, { key: 'Meta' });
        });
        expect(result.current.isPanning).toBe(true);
    });

    it('does not set isPanning for other keys', () => {
        const { result } = renderHook(() => usePanning());

        act(() => {
            fireEvent.keyDown(window, { key: 'Space' });
        });
        expect(result.current.isPanning).toBe(false);
    });

    it('resets isPanning on window blur', () => {
        const { result } = renderHook(() => usePanning());

        act(() => {
            fireEvent.keyDown(window, { key: 'Control' });
        });
        expect(result.current.isPanning).toBe(true);

        act(() => {
            fireEvent.blur(window);
        });
        expect(result.current.isPanning).toBe(false);
    });
});
