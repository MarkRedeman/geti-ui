import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { SelectionBounds, SelectionMode, SelectionRect } from './types';

interface UseDragSelectionOptions {
    enabled?: boolean;
    mode: SelectionMode;
    bounds: SelectionBounds;
    onSelectionEnd?: (selection: SelectionRect | null) => void;
}

interface UseDragSelectionReturn {
    dragRect: SelectionRect | null;
    isDragging: boolean;
    clearSelection: () => void;
    onPointerDown: (event: ReactPointerEvent<SVGRectElement>) => void;
    onPointerMove: (event: ReactPointerEvent<SVGRectElement>) => void;
    onPointerUp: (event: ReactPointerEvent<SVGRectElement>) => void;
    onPointerLeave: (event: ReactPointerEvent<SVGRectElement>) => void;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function normalizeRect(startX: number, startY: number, endX: number, endY: number): SelectionRect {
    return {
        x0: Math.min(startX, endX),
        y0: Math.min(startY, endY),
        x1: Math.max(startX, endX),
        y1: Math.max(startY, endY),
    };
}

function getSvgPointerPosition(event: ReactPointerEvent<SVGRectElement>): { x: number; y: number } {
    const svg = event.currentTarget.ownerSVGElement;

    if (svg) {
        const ctm = svg.getScreenCTM();
        if (ctm) {
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const transformed = point.matrixTransform(ctm.inverse());
            return { x: transformed.x, y: transformed.y };
        }
    }

    return {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
    };
}

export function useDragSelection({
    enabled = false,
    mode,
    bounds,
    onSelectionEnd,
}: UseDragSelectionOptions): UseDragSelectionReturn {
    const [dragRect, setDragRect] = useState<SelectionRect | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startRef = useRef<{ x: number; y: number } | null>(null);
    const latestRectRef = useRef<SelectionRect | null>(null);

    const clearSelection = () => {
        setDragRect(null);
        setIsDragging(false);
        startRef.current = null;
        latestRectRef.current = null;
    };

    const getConstrainedRect = (startX: number, startY: number, currentX: number, currentY: number): SelectionRect => {
        if (mode === 'column') {
            return normalizeRect(startX, bounds.top, currentX, bounds.bottom);
        }

        if (mode === 'row') {
            return normalizeRect(bounds.left, startY, bounds.right, currentY);
        }

        return normalizeRect(startX, startY, currentX, currentY);
    };

    const onPointerDown = (event: ReactPointerEvent<SVGRectElement>) => {
        if (!enabled) {
            return;
        }

        const target = event.currentTarget;
        target.setPointerCapture?.(event.pointerId);

        const pointer = getSvgPointerPosition(event);
        const startX = clamp(pointer.x, bounds.left, bounds.right);
        const startY = clamp(pointer.y, bounds.top, bounds.bottom);

        startRef.current = { x: startX, y: startY };
        setIsDragging(true);
        const initialRect = getConstrainedRect(startX, startY, startX, startY);
        latestRectRef.current = initialRect;
        setDragRect(initialRect);
    };

    const onPointerMove = (event: ReactPointerEvent<SVGRectElement>) => {
        if (!enabled || !isDragging || startRef.current === null) {
            return;
        }

        const pointer = getSvgPointerPosition(event);
        const currentX = clamp(pointer.x, bounds.left, bounds.right);
        const currentY = clamp(pointer.y, bounds.top, bounds.bottom);
        const nextRect = getConstrainedRect(startRef.current.x, startRef.current.y, currentX, currentY);
        latestRectRef.current = nextRect;
        setDragRect(nextRect);
    };

    const finishDrag = (event: ReactPointerEvent<SVGRectElement>) => {
        if (!enabled || !isDragging) {
            return;
        }

        event.currentTarget.releasePointerCapture?.(event.pointerId);

        const start = startRef.current;
        setIsDragging(false);
        startRef.current = null;
        const resolvedRect = (() => {
            if (start) {
                const pointer = getSvgPointerPosition(event);
                const currentX = clamp(pointer.x, bounds.left, bounds.right);
                const currentY = clamp(pointer.y, bounds.top, bounds.bottom);
                return getConstrainedRect(start.x, start.y, currentX, currentY);
            }

            return latestRectRef.current;
        })();

        if (!resolvedRect) {
            onSelectionEnd?.(null);
            return;
        }

        const width = resolvedRect.x1 - resolvedRect.x0;
        const height = resolvedRect.y1 - resolvedRect.y0;

        if (width < 2 || height < 2) {
            setDragRect(null);
            latestRectRef.current = null;
            onSelectionEnd?.(null);
            return;
        }

        latestRectRef.current = resolvedRect;
        setDragRect(resolvedRect);
        onSelectionEnd?.(resolvedRect);
    };

    return {
        dragRect,
        isDragging,
        clearSelection,
        onPointerDown,
        onPointerMove,
        onPointerUp: finishDrag,
        onPointerLeave: finishDrag,
    };
}
