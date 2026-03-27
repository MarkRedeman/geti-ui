import { createContext, useCallback, useContext, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

import type { Point, Size, ZoomConfig, ZoomTransformState } from './types';
import { clampBetween, clampTranslate, getZoomTransform, ZOOM_STEP_COUNT } from './utils';

// --- Contexts ---

const ZoomConfigContext = createContext<ZoomConfig | null>(null);
const ZoomTransformContext = createContext<ZoomTransformState | null>(null);

type ZoomActions = {
    setTransform: Dispatch<SetStateAction<ZoomTransformState>>;
    setConfig: Dispatch<SetStateAction<ZoomConfig>>;
    setContainerSize: (size: Size) => void;
    fitToScreen: () => void;
    zoomBy: (step: number) => void;
    zoomTo: (scale: number, anchor?: Point) => void;
};

const ZoomActionsContext = createContext<ZoomActions | null>(null);

// --- Hooks ---

export function useZoom(): ZoomTransformState & ZoomConfig {
    const config = useContext(ZoomConfigContext);
    const transform = useContext(ZoomTransformContext);

    if (!config || !transform) {
        throw new Error('useZoom must be used within a <ZoomProvider>');
    }

    return { ...config, ...transform };
}

export function useZoomActions(): Omit<ZoomActions, 'setTransform' | 'setConfig' | 'setContainerSize'> {
    const context = useContext(ZoomActionsContext);

    if (!context) {
        throw new Error('useZoomActions must be used within a <ZoomProvider>');
    }

    const { fitToScreen, zoomBy, zoomTo } = context;
    return { fitToScreen, zoomBy, zoomTo };
}

/**
 * Internal hook — used only by ZoomTransform and useSyncZoom.
 * Not part of the public API.
 */
export function useZoomInternal() {
    const config = useContext(ZoomConfigContext);
    const transform = useContext(ZoomTransformContext);
    const actions = useContext(ZoomActionsContext);

    if (!config || !transform || !actions) {
        throw new Error('useZoomInternal must be used within a <ZoomProvider>');
    }

    return { config, transform, ...actions };
}

// --- Provider ---

export type ZoomProviderProps = {
    children: ReactNode;
    /** Target content dimensions — used for pan boundary clamping */
    target?: Size;
};

const INITIAL_CONFIG: ZoomConfig = {
    initialCoordinates: { scale: 1.0, x: 0, y: 0 },
    minScale: 1.0,
    maxZoomIn: 1,
};

const INITIAL_TRANSFORM: ZoomTransformState = {
    scale: 1.0,
    translate: { x: 0, y: 0 },
};

export function ZoomProvider({ children, target }: ZoomProviderProps) {
    const [config, setConfig] = useState<ZoomConfig>(INITIAL_CONFIG);
    const [transform, setTransform] = useState<ZoomTransformState>(INITIAL_TRANSFORM);
    const containerSizeRef = useRef<Size>({ width: 0, height: 0 });

    const setContainerSize = useCallback((size: Size) => {
        containerSizeRef.current = size;
    }, []);

    const fitToScreen = () => {
        setTransform({
            scale: config.initialCoordinates.scale,
            translate: { x: config.initialCoordinates.x, y: config.initialCoordinates.y },
        });
    };

    const zoomBy = (step: number) => {
        setTransform((prev) => {
            const stepSize = (config.maxZoomIn - config.minScale) / ZOOM_STEP_COUNT;
            const newScale = clampBetween(
                config.minScale,
                prev.scale + stepSize * step,
                config.maxZoomIn
            );

            const newState = getZoomTransform({
                newScale,
                minScale: config.minScale,
                cursorX: config.initialCoordinates.x,
                cursorY: config.initialCoordinates.y,
                initialCoordinates: config.initialCoordinates,
            })(prev);

            if (target) {
                newState.translate = clampTranslate(
                    newState.translate,
                    newState.scale,
                    target,
                    containerSizeRef.current
                );
            }

            return newState;
        });
    };

    const zoomTo = (scale: number, anchor?: Point) => {
        setTransform((prev) => {
            const clampedScale = clampBetween(config.minScale, scale, config.maxZoomIn);
            const container = containerSizeRef.current;

            let newTranslate: Point;

            if (anchor) {
                // anchor is in content-space coordinates — compute translation to
                // center that point in the viewport at the given scale
                newTranslate = {
                    x: container.width / 2 - anchor.x * clampedScale,
                    y: container.height / 2 - anchor.y * clampedScale,
                };
            } else {
                // No anchor — zoom toward center using the standard focal-point math
                const result = getZoomTransform({
                    newScale: clampedScale,
                    minScale: config.minScale,
                    cursorX: config.initialCoordinates.x,
                    cursorY: config.initialCoordinates.y,
                    initialCoordinates: config.initialCoordinates,
                })(prev);
                newTranslate = result.translate;
            }

            if (target) {
                newTranslate = clampTranslate(
                    newTranslate,
                    clampedScale,
                    target,
                    container
                );
            }

            return { scale: clampedScale, translate: newTranslate };
        });
    };

    const actions: ZoomActions = {
        setTransform,
        setConfig,
        setContainerSize,
        fitToScreen,
        zoomBy,
        zoomTo,
    };

    return (
        <ZoomConfigContext.Provider value={config}>
            <ZoomTransformContext.Provider value={transform}>
                <ZoomActionsContext.Provider value={actions}>{children}</ZoomActionsContext.Provider>
            </ZoomTransformContext.Provider>
        </ZoomConfigContext.Provider>
    );
}

// Export the container size ref setter for internal use by ZoomTransform
export { type ZoomActions };
