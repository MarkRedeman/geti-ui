import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type Dispatch,
    type MutableRefObject,
    type ReactNode,
    type SetStateAction,
} from 'react';

import type { Point, Rect, Size, ZoomConfig, ZoomToOptions, ZoomTransformState } from './types';
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
    zoomTo: (viewport: Rect, options?: ZoomToOptions) => void;
    /** Mark that the user has interacted (zoomed/panned). Used internally by ZoomTransform. */
    markInteracted: () => void;
    /** Ref tracking whether the user has interacted. Used internally by useSyncZoom. */
    userHasInteractedRef: MutableRefObject<boolean>;
    /** Internal animation trigger for discrete actions. */
    triggerDiscreteAnimationRef: MutableRefObject<(() => void) | null>;
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

export function useZoomActions(): Omit<ZoomActions, 'setTransform' | 'setConfig' | 'setContainerSize' | 'markInteracted' | 'userHasInteractedRef' | 'triggerDiscreteAnimationRef'> {
    const context = useContext(ZoomActionsContext);

    if (!context) {
        throw new Error('useZoomActions must be used within a <ZoomProvider>');
    }

    const { fitToScreen, zoomBy, zoomTo } = context;
    return { fitToScreen, zoomBy, zoomTo };
}

/**
 * Internal hook - used only by ZoomTransform and useSyncZoom.
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
    /** Target content dimensions - used for pan boundary clamping */
    target?: Size;
};

const INITIAL_CONFIG: ZoomConfig = {
    initialCoordinates: { scale: 1.0, x: 0, y: 0 },
    minScale: 1.0,
    maxScale: 1,
};

const INITIAL_TRANSFORM: ZoomTransformState = {
    scale: 1.0,
    translate: { x: 0, y: 0 },
};

export function ZoomProvider({ children, target }: ZoomProviderProps) {
    const [config, setConfig] = useState<ZoomConfig>(INITIAL_CONFIG);
    const [transform, setTransform] = useState<ZoomTransformState>(INITIAL_TRANSFORM);
    const containerSizeRef = useRef<Size>({ width: 0, height: 0 });
    const configRef = useRef(config);
    const userHasInteractedRef = useRef(false);
    const triggerDiscreteAnimationRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    const setContainerSize = useCallback((size: Size) => {
        containerSizeRef.current = size;
    }, []);

    const markInteracted = useCallback(() => {
        userHasInteractedRef.current = true;
    }, []);

    const fitToScreen = useCallback(() => {
        const currentConfig = configRef.current;
        userHasInteractedRef.current = false;
        triggerDiscreteAnimationRef.current?.();

        setTransform({
            scale: currentConfig.initialCoordinates.scale,
            translate: { x: currentConfig.initialCoordinates.x, y: currentConfig.initialCoordinates.y },
        });
    }, []);

    const zoomBy = useCallback((step: number) => {
        const currentConfig = configRef.current;
        userHasInteractedRef.current = true;
        triggerDiscreteAnimationRef.current?.();

        setTransform((prev) => {
            const ratioPerStep = Math.pow(currentConfig.maxScale / currentConfig.minScale, 1 / ZOOM_STEP_COUNT);
            const newScale = clampBetween(
                currentConfig.minScale,
                prev.scale * Math.pow(ratioPerStep, step),
                currentConfig.maxScale
            );

            const anchorX = containerSizeRef.current.width / 2;
            const anchorY = containerSizeRef.current.height / 2;

            const newState = getZoomTransform({
                newScale,
                minScale: currentConfig.minScale,
                cursorX: anchorX,
                cursorY: anchorY,
                initialCoordinates: currentConfig.initialCoordinates,
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
    }, [target]);

    const zoomTo = useCallback((viewport: Rect, options?: ZoomToOptions) => {
        const currentConfig = configRef.current;
        const padding = options?.padding ?? 0;
        userHasInteractedRef.current = true;
        triggerDiscreteAnimationRef.current?.();

        setTransform(() => {
            const container = containerSizeRef.current;

            // Available viewport space after subtracting padding on both sides
            const availableWidth = Math.max(container.width - 2 * padding, 1);
            const availableHeight = Math.max(container.height - 2 * padding, 1);

            // Scale to fit the content-space rectangle into the available viewport space
            const scaleToFit = Math.min(
                availableWidth / viewport.width,
                availableHeight / viewport.height
            );
            const clampedScale = clampBetween(currentConfig.minScale, scaleToFit, currentConfig.maxScale);

            // Center of the target rectangle in content-space
            const rectCenterX = viewport.x + viewport.width / 2;
            const rectCenterY = viewport.y + viewport.height / 2;

            // Translate so the rect center maps to the viewport center
            let newTranslate: Point = {
                x: container.width / 2 - rectCenterX * clampedScale,
                y: container.height / 2 - rectCenterY * clampedScale,
            };

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
    }, [target]);

    const actions = useMemo<ZoomActions>(
        () => ({
            setTransform,
            setConfig,
            setContainerSize,
            fitToScreen,
            zoomBy,
            zoomTo,
            markInteracted,
            userHasInteractedRef,
            triggerDiscreteAnimationRef,
        }),
        [fitToScreen, markInteracted, setContainerSize, zoomBy, zoomTo]
    );

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
