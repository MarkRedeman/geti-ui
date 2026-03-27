import { type ReactNode, useCallback, useRef } from 'react';

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
};

const useGesture = createUseGesture([wheelAction, pinchAction, dragAction]);

const ANIMATION_DURATION_MS = 200;

export function ZoomTransform({ children, target, zoomInMultiplier = 10 }: ZoomTransformProps) {
    const { config, transform, setTransform } = useZoomInternal();
    const { isPanning, setIsPanning } = usePanning();
    const containerRef = useRef<HTMLDivElement>(null);
    const containerSize = useContainerSize(containerRef);
    const { onPointerDown, onPointerUp, onPointerMove, onMouseLeave, isGrabbing } = useWheelPanning(setIsPanning);

    // Track whether the current render should animate (transient, not in state)
    const animatingRef = useRef(false);
    const animationTimerRef = useRef<ReturnType<typeof setTimeout>>();

    useSyncZoom({ container: containerSize, zoomInMultiplier, target });

    const cursorIcon = isPanning && isGrabbing ? 'grabbing' : isPanning ? 'grab' : 'default';

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
                    config.initialCoordinates.scale,
                    config.initialCoordinates.scale * factor,
                    config.maxZoomIn
                );
                const relativeCursor = { x: origin[0] - rect.left, y: origin[1] - rect.top };

                setTransform(
                    getZoomTransform({
                        newScale,
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
                    config.initialCoordinates.scale,
                    transform.scale * factor,
                    config.maxZoomIn
                );
                const relativeCursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };

                setTransform((prev) => {
                    const newState = getZoomTransform({
                        newScale,
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
            wheel: { preventDefault: true },
            pinch: { preventDefault: true },
            drag: { enabled: isPanning },
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
                    touchAction: 'none',
                    transform: 'translate3d(0, 0, 0)',
                    '--zoom-scale': transform.scale,
                } as React.CSSProperties
            }
            onPointerMove={onPointerMove(handleTranslateUpdate)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onMouseLeave={onMouseLeave}
        >
            <div
                data-testid="zoom-transform"
                className={styles.content}
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
