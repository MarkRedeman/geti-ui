import { type PointerEvent } from 'react';

import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from '@rstest/core';

import { useWheelPanning } from './useWheelPanning';

function createWheelPointerEvent(data: Partial<PointerEvent<HTMLDivElement>> = {}) {
    return { clientX: 0, clientY: 0, ...data, button: 1 } as PointerEvent<HTMLDivElement>;
}

function createLeftPointerEvent(data: Partial<PointerEvent<HTMLDivElement>> = {}) {
    return { clientX: 0, clientY: 0, ...data, button: 0 } as PointerEvent<HTMLDivElement>;
}

describe('useWheelPanning', () => {
    it('initializes with default values', () => {
        const calls: boolean[] = [];
        const { result } = renderHook(() => useWheelPanning((v) => calls.push(v)));
        expect(result.current.isGrabbing).toBe(false);
    });

    it('sets isGrabbing to true on middle mouse pointer down', () => {
        const calls: boolean[] = [];
        const { result } = renderHook(() => useWheelPanning((v) => calls.push(v)));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent({ clientX: 10, clientY: 20 }));
        });

        expect(result.current.isGrabbing).toBe(true);
    });

    it('does NOT set isGrabbing for left mouse pointer down', () => {
        const calls: boolean[] = [];
        const { result } = renderHook(() => useWheelPanning((v) => calls.push(v)));

        act(() => {
            result.current.onPointerDown(createLeftPointerEvent({ clientX: 10, clientY: 20 }));
        });

        expect(result.current.isGrabbing).toBe(false);
    });

    it('reports delta on pointer move while panning', () => {
        const panCalls: boolean[] = [];
        const deltaCalls: { x: number; y: number }[] = [];
        const { result } = renderHook(() => useWheelPanning((v) => panCalls.push(v)));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent({ clientX: 10, clientY: 10 }));
            result.current.onPointerMove((delta) => deltaCalls.push(delta))(
                createWheelPointerEvent({ clientX: 20, clientY: 15 }),
            );
        });

        expect(deltaCalls).toEqual([{ x: 10, y: 5 }]);
    });

    it('resets on pointer up', () => {
        const panCalls: boolean[] = [];
        const { result } = renderHook(() => useWheelPanning((v) => panCalls.push(v)));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent());
        });
        expect(result.current.isGrabbing).toBe(true);

        act(() => {
            result.current.onPointerUp();
        });
        expect(result.current.isGrabbing).toBe(false);
        expect(panCalls).toContain(false);
    });

    it('resets on mouse leave', () => {
        const panCalls: boolean[] = [];
        const { result } = renderHook(() => useWheelPanning((v) => panCalls.push(v)));

        act(() => {
            result.current.onPointerDown(createWheelPointerEvent());
        });

        act(() => {
            result.current.onMouseLeave();
        });

        expect(result.current.isGrabbing).toBe(false);
        expect(panCalls).toContain(false);
    });
});
