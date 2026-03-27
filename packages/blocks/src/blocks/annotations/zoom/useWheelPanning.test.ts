import { type PointerEvent } from 'react';

import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, rstest } from '@rstest/core';

import { useWheelPanning } from './useWheelPanning';

function createWheelPointerEvent(data: Partial<PointerEvent<HTMLDivElement>> = {}) {
    return { clientX: 0, clientY: 0, ...data, button: 1 } as PointerEvent<HTMLDivElement>;
}

function createLeftPointerEvent(data: Partial<PointerEvent<HTMLDivElement>> = {}) {
    return { clientX: 0, clientY: 0, ...data, button: 0 } as PointerEvent<HTMLDivElement>;
}

describe('useWheelPanning', () => {
    it('initializes with default values', () => {
        const setIsPanning = rstest.fn();
        const { result } = renderHook(() => useWheelPanning(setIsPanning));
        expect(result.current.isGrabbing).toBe(false);
    });

    it('sets isGrabbing to true on middle mouse pointer down', () => {
        const setIsPanning = rstest.fn();
        const { result } = renderHook(() => useWheelPanning(setIsPanning));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent({ clientX: 10, clientY: 20 }));
        });

        expect(result.current.isGrabbing).toBe(true);
        expect(setIsPanning).toHaveBeenCalledWith(true);
    });

    it('does NOT set isGrabbing for left mouse pointer down', () => {
        const setIsPanning = rstest.fn();
        const { result } = renderHook(() => useWheelPanning(setIsPanning));

        act(() => {
            result.current.onPointerDown(createLeftPointerEvent({ clientX: 10, clientY: 20 }));
        });

        expect(result.current.isGrabbing).toBe(false);
        expect(setIsPanning).not.toHaveBeenCalled();
    });

    it('reports delta on pointer move while panning', () => {
        const setIsPanning = rstest.fn();
        const onDelta = rstest.fn();
        const { result } = renderHook(() => useWheelPanning(setIsPanning));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent({ clientX: 10, clientY: 10 }));
            result.current.onPointerMove(onDelta)(
                createWheelPointerEvent({ clientX: 20, clientY: 15 }),
            );
        });

        expect(onDelta).toHaveBeenCalledWith({ x: 10, y: 5 });
    });

    it('reports delta on pointer move with button: 0 (browser behavior during move)', () => {
        const setIsPanning = rstest.fn();
        const onDelta = rstest.fn();
        const { result } = renderHook(() => useWheelPanning(setIsPanning));

        // Start with middle-button pointerdown
        act(() => {
            result.current.onPointerDown(createWheelPointerEvent({ clientX: 10, clientY: 10 }));
        });

        // Move with button: 0 (this is what browsers actually report during pointermove)
        act(() => {
            result.current.onPointerMove(onDelta)(
                createLeftPointerEvent({ clientX: 25, clientY: 18 }),
            );
        });

        expect(onDelta).toHaveBeenCalledWith({ x: 15, y: 8 });
    });

    it('resets on pointer up', () => {
        const setIsPanning = rstest.fn();
        const { result } = renderHook(() => useWheelPanning(setIsPanning));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent());
        });
        expect(result.current.isGrabbing).toBe(true);

        act(() => {
            result.current.onPointerUp();
        });
        expect(result.current.isGrabbing).toBe(false);
        expect(setIsPanning).toHaveBeenCalledWith(false);
    });

    it('resets on mouse leave', () => {
        const setIsPanning = rstest.fn();
        const { result } = renderHook(() => useWheelPanning(setIsPanning));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent());
        });

        act(() => {
            result.current.onMouseLeave();
        });

        expect(result.current.isGrabbing).toBe(false);
        expect(setIsPanning).toHaveBeenCalledWith(false);
    });
});
