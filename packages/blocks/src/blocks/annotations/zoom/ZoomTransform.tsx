import {
    type CSSProperties,
    type PointerEvent,
    type ReactNode,
    type RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

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
     * Visual padding (in pixels) between the content edges and the container
     * edges at fit-to-screen. Default: 0 (content fills the container
     * edge-to-edge, respecting aspect ratio).
     */
    fitPadding?: number;
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

type ZoomInternalState = ReturnType<typeof useZoomInternal>;

type GestureSyncDeps = {
    config: ZoomInternalState['config'];
    containerRef: RefObject<HTMLDivElement | null>;
    containerSize: Size;
    interactive: boolean;
    markInteracted: ZoomInternalState['markInteracted'];
    setTransform: ZoomInternalState['setTransform'];
    target: Size;
};

function useDiscreteAnimationState(triggerDiscreteAnimationRef: ZoomInternalState['triggerDiscreteAnimationRef']) {
    // Local-only visual flag. Keeping this state here avoids provider/context
    // updates for animation toggles and keeps gesture updates immediate.
    const [isAnimating, setIsAnimating] = useState(false);
    // Used to reset the animation window when multiple discrete actions happen
    // close together (e.g. repeated +/- clicks).
    const animationTimerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        // No animation requested.
        if (!isAnimating) {
            return;
        }

        // Restart the timer for each new discrete action.
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = setTimeout(() => {
            setIsAnimating(false);
        }, ANIMATION_DURATION_MS);

        return () => {
            clearTimeout(animationTimerRef.current);
        };
    }, [isAnimating]);

    useEffect(() => {
        // Provider actions (fitToScreen / zoomBy / zoomTo) call this callback
        // right before applying the transform.
        triggerDiscreteAnimationRef.current = () => {
            setIsAnimating(true);
        };

        return () => {
            // Avoid calling setState on an unmounted component.
            triggerDiscreteAnimationRef.current = null;
        };
    }, [triggerDiscreteAnimationRef]);

    return isAnimating;
}

function useZoomGestureSync({
    config,
    containerRef,
    containerSize,
    interactive,
    markInteracted,
    setTransform,
    target,
}: GestureSyncDeps) {
    const { isPanning, setIsPanning } = usePanning();
    const { onPointerDown, onPointerUp, onPointerMove, onMouseLeave, isGrabbing } = useWheelPanning(setIsPanning);

    const handleTranslateUpdate = useCallback(
        ({ x, y }: Point) => {
            markInteracted();
            setTransform((prev) => {
                const newTranslate = {
                    x: prev.translate.x + x,
                    y: prev.translate.y + y,
                };

                const clamped = clampTranslate(newTranslate, prev.scale, target, containerSize);

                return {
                    ...prev,
                    translate: clamped,
                };
            });
        },
        [containerSize, markInteracted, setTransform, target]
    );

    useGesture(
        {
            onPinch: ({ origin, offset: [deltaDistance] }) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;

                markInteracted();
                const factor = 1 + deltaDistance / 200;
                const relativeCursor = { x: origin[0] - rect.left, y: origin[1] - rect.top };

                setTransform((prev) => {
                    const newScale = clampBetween(config.minScale, prev.scale * factor, config.maxScale);
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
            onWheel: ({ event, delta: [, verticalScrollDelta] }) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;

                markInteracted();
                const factor = 1 - verticalScrollDelta / 500;
                const relativeCursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };

                setTransform((prev) => {
                    const newScale = clampBetween(config.minScale, prev.scale * factor, config.maxScale);
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
            onPointerDown: ({ event }) => {
                if (!interactive) {
                    return;
                }

                onPointerDown(event as unknown as PointerEvent<HTMLDivElement>);
            },
            onPointerMove: ({ event }) => {
                if (!interactive) {
                    return;
                }

                onPointerMove(handleTranslateUpdate)(event as unknown as PointerEvent<HTMLDivElement>);
            },
            onPointerUp: ({ event }) => {
                if (!interactive) {
                    return;
                }

                onPointerUp(event as unknown as PointerEvent<HTMLDivElement>);
            },
            onMouseLeave: () => {
                if (!interactive) {
                    return;
                }

                onMouseLeave();
            },
        },
        {
            target: containerRef,
            eventOptions: { passive: false },
            wheel: { preventDefault: true, enabled: interactive },
            pinch: { preventDefault: true, enabled: interactive },
            drag: { enabled: interactive && isPanning },
        }
    );

    return { isPanning, isGrabbing };
}

function getCursorIcon(interactive: boolean, isPanning: boolean, isGrabbing: boolean) {
    if (!interactive) {
        return 'default';
    }

    if (isPanning && isGrabbing) {
        return 'grabbing';
    }

    if (isPanning) {
        return 'grab';
    }

    return 'default';
}

export function ZoomTransform({
    children,
    target,
    zoomInMultiplier = 10,
    zoomOutMultiplier = 0.5,
    fitPadding = 0,
    interactive = true,
    doubleClickMode = 'none',
}: ZoomTransformProps) {
    const {
        config,
        transform,
        setTransform,
        setContainerSize,
        fitToScreen,
        markInteracted,
        triggerDiscreteAnimationRef,
    } = useZoomInternal();
    const containerRef = useRef<HTMLDivElement>(null);
    const containerSize = useContainerSize(containerRef);

    useEffect(() => {
        setContainerSize(containerSize);
    }, [containerSize, setContainerSize]);

    const isAnimating = useDiscreteAnimationState(triggerDiscreteAnimationRef);

    useSyncZoom({ container: containerSize, zoomInMultiplier, zoomOutMultiplier, fitPadding, target });

    const handleDoubleClick = useCallback(() => {
        if (interactive && doubleClickMode === 'fitToScreen') {
            fitToScreen();
        }
    }, [doubleClickMode, fitToScreen, interactive]);

    const { isPanning, isGrabbing } = useZoomGestureSync({
        config,
        containerRef,
        containerSize,
        interactive,
        markInteracted,
        setTransform,
        target,
    });

    const cursorIcon = getCursorIcon(interactive, isPanning, isGrabbing);

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
                } as CSSProperties
            }
            onDoubleClick={handleDoubleClick}
        >
            <div
                data-testid="zoom-transform"
                className={styles.content}
                onDragStart={(e) => e.preventDefault()}
                style={{
                    transformOrigin: '0 0',
                    transition: isAnimating ? `transform ${ANIMATION_DURATION_MS}ms ease` : 'none',
                    transform: `translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale})`,
                }}
            >
                {children}
            </div>
        </div>
    );
}
