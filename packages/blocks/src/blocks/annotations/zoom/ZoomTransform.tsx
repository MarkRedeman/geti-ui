import { type ReactNode, useCallback, useEffect, useRef } from 'react';

import { createUseGesture, dragAction, pinchAction, wheelAction } from '@use-gesture/react';

import type { Point, Size } from './types';
import { useContainerSize } from './useContainerSize';
import { usePanning } from './usePanning';
import { useSyncZoom } from './useSyncZoom';
import { useWheelPanning } from './useWheelPanning';
import { clampBetween, clampTranslate, getZoomTransform } from './utils';
import { useZoomInternal } from './ZoomProvider';

import styles from './ZoomTransform.module.css';

export type ZoomTransformProps = {
    /** Dimensions of the content being zoomed (e.g., image width/height) */
    target: Size;
    /** Content to render inside the zoomable viewport */
    children: ReactNode;
    /** Maximum zoom = initialScale * this value. Default: 10 */
    zoomInMultiplier?: number;
    /**
     * Minimum zoom = initialScale * this value. Default: 0.5.
     * Allows zooming out beyond fit-to-screen. Set to 1 to prevent
     * zooming out past fit-to-screen.
     */
    zoomOutMultiplier?: number;
    /**
     * Whether zoom and pan interactions are enabled. Default: true.
     * When false, the viewport displays content at fit-to-screen with
     * no gesture handlers (no wheel zoom, pinch, drag, or middle-click pan).
     */
    interactive?: boolean;
    /**
     * Action to perform on double-click. Default: 'none'.
     * - `'fitToScreen'` — reset to fit-to-screen on double-click
     * - `'none'` — no double-click behavior
     */
    doubleClickMode?: 'fitToScreen' | 'none';
};

const useGesture = createUseGesture([wheelAction, pinchAction, dragAction]);

const ANIMATION_DURATION_MS = 200;

export function ZoomTransform({
    children,
    target,
    zoomInMultiplier = 10,
    zoomOutMultiplier = 0.5,
    interactive = true,
    doubleClickMode = 'none',
}: ZoomTransformProps) {
    const { config, transform, setTransform, setContainerSize, fitToScreen } = useZoomInternal();
    const { isPanning, setIsPanning } = usePanning();
    const containerRef = useRef<HTMLDivElement>(null);
    const containerSize = useContainerSize(containerRef);
    const { onPointerDown, onPointerUp, onPointerMove, onMouseLeave, isGrabbing } = useWheelPanning(setIsPanning);

    // Keep provider's container size ref in sync so zoomTo/zoomBy can use it
    useEffect(() => {
        setContainerSize(containerSize);
    }, [containerSize, setContainerSize]);

    // Track whether the current render should animate (transient, not in state)
    const animatingRef = useRef(false);
    const animationTimerRef = useRef<ReturnType<typeof setTimeout>>();

    useSyncZoom({ container: containerSize, zoomInMultiplier, zoomOutMultiplier, target });

    const cursorIcon = !interactive ? 'default' : isPanning && isGrabbing ? 'grabbing' : isPanning ? 'grab' : 'default';

    const handleTranslateUpdate = useCallback(
        ({ x, y }: Point) => {
            setTransform((prev) => {
                const newTranslate = {
                    x: prev.translate.x + x,
                    y: prev.translate.y + y,
                };

                return {
                    ...prev,
                    translate: clampTranslate(newTranslate, prev.scale, target, containerSize),
                };
            });
        },
        [setTransform, target, containerSize]
    );

    useGesture(
        {
            onPinch: ({ origin, offset: [deltaDistance] }) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;

                const factor = 1 + deltaDistance / 200;
                const newScale = clampBetween(
                    config.minScale,
                    config.initialCoordinates.scale * factor,
                    config.maxZoomIn
                );
                const relativeCursor = { x: origin[0] - rect.left, y: origin[1] - rect.top };

                setTransform(
                    getZoomTransform({
                        newScale,
                        minScale: config.minScale,
                        cursorX: relativeCursor.x,
                        cursorY: relativeCursor.y,
                        initialCoordinates: config.initialCoordinates,
                    })
                );
            },
            onWheel: ({ event, delta: [, verticalScrollDelta] }) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;

                const factor = 1 - verticalScrollDelta / 500;
                const newScale = clampBetween(
                    config.minScale,
                    transform.scale * factor,
                    config.maxZoomIn
                );
                const relativeCursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };

                setTransform((prev) => {
                    const newState = getZoomTransform({
                        newScale,
                        minScale: config.minScale,
                        cursorX: relativeCursor.x,
                        cursorY: relativeCursor.y,
                        initialCoordinates: config.initialCoordinates,
                    })(prev);

                    newState.translate = clampTranslate(newState.translate, newState.scale, target, containerSize);
                    return newState;
                });
            },
            onDrag: ({ delta: [x, y] }) => handleTranslateUpdate({ x, y }),
        },
        {
            target: containerRef,
            eventOptions: { passive: false },
            wheel: { preventDefault: true, enabled: interactive },
            pinch: { preventDefault: true, enabled: interactive },
            drag: { enabled: interactive && isPanning },
        }
    );

    // Check if we should animate (fit-to-screen or button zoom triggers this)
    const shouldAnimate = animatingRef.current;
    if (shouldAnimate) {
        // Clear the animation flag after the transition completes
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = setTimeout(() => {
            animatingRef.current = false;
        }, ANIMATION_DURATION_MS);
    }

    return (
        <div
            ref={containerRef}
            className={styles.wrapper}
            style={
                {
                    cursor: cursorIcon,
                    touchAction: interactive ? 'none' : undefined,
                    transform: 'translate3d(0, 0, 0)',
                    '--zoom-scale': transform.scale,
                } as React.CSSProperties
            }
            onPointerMove={interactive ? onPointerMove(handleTranslateUpdate) : undefined}
            onPointerDown={interactive ? onPointerDown : undefined}
            onPointerUp={interactive ? onPointerUp : undefined}
            onMouseLeave={interactive ? onMouseLeave : undefined}
        >
            <div
                data-testid="zoom-transform"
                className={styles.content}
                onDragStart={(e) => e.preventDefault()}
                style={{
                    transformOrigin: '0 0',
                    transition: shouldAnimate ? `transform ${ANIMATION_DURATION_MS}ms ease` : 'none',
                    transform: `translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})`,
                }}
            >
                {children}
            </div>
        </div>
    );
}
