import { type PointerEvent, useRef, useState } from 'react';

import type { Point } from './types';
import { isWheelButton } from './utils';

/**
 * Handles middle-mouse-button (wheel) drag-to-pan interactions.
 *
 * Bug fix from reference: `isGrabbing` is only set when the wheel button
 * is pressed, not for all pointer down events.
 */
export function useWheelPanning(setIsPanning: (value: boolean) => void) {
    const [isGrabbing, setIsGrabbing] = useState(false);
    const lastPos = useRef<Point | null>(null);

    return {
        isGrabbing,
        onMouseLeave: () => {
            setIsPanning(false);
            setIsGrabbing(false);
            lastPos.current = null;
        },
        onPointerMove: (callback: (delta: Point) => void) => (event: PointerEvent<HTMLDivElement>) => {
            // Use lastPos ref (set on wheel-button pointerdown) instead of checking
            // event.button - during pointermove, button is always 0.
            if (lastPos.current !== null) {
                const dx = event.clientX - lastPos.current.x;
                const dy = event.clientY - lastPos.current.y;
                lastPos.current = { x: event.clientX, y: event.clientY };
                callback({ x: dx, y: dy });
            }
        },
        onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
            if (isWheelButton(event)) {
                event.currentTarget.setPointerCapture(event.pointerId);
                setIsGrabbing(true);
                setIsPanning(true);
                lastPos.current = { x: event.clientX, y: event.clientY };
            }
        },
        onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }

            setIsPanning(false);
            setIsGrabbing(false);
            lastPos.current = null;
        },
    };
}
