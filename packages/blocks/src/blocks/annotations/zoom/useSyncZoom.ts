import { useEffect, useMemo } from 'react';

import type { Size } from './types';
import { getCenterCoordinates } from './utils';
import { useZoomInternal } from './ZoomProvider';

type UseSyncZoomOptions = {
    container: Size;
    target: Size;
    zoomInMultiplier: number;
};

/**
 * Synchronizes zoom config when container or target size changes.
 *
 * Improvement from reference: if the user has actively zoomed/panned
 * (i.e., is NOT at the fit-to-screen state), we only update the config
 * (initialCoordinates, maxZoomIn) without resetting the user's current
 * transform. If the user is at the default fit-to-screen state, we re-center.
 */
export function useSyncZoom({ container, target, zoomInMultiplier }: UseSyncZoomOptions) {
    const { config, transform, setConfig, setTransform } = useZoomInternal();

    const targetZoom = useMemo(() => {
        if (!container.width || !container.height) {
            return { scale: 1.0, x: 0, y: 0 };
        }

        return getCenterCoordinates(container, target);
    }, [container, target]);

    useEffect(() => {
        const scale = Number(targetZoom.scale.toFixed(3));
        const x = Number(targetZoom.x.toFixed(3));
        const y = Number(targetZoom.y.toFixed(3));

        const newConfig = {
            initialCoordinates: { ...targetZoom },
            maxZoomIn: scale * zoomInMultiplier,
        };

        setConfig(newConfig);

        // Check if user is at (or near) the current fit-to-screen state
        const isAtFitToScreen =
            Math.abs(transform.scale - config.initialCoordinates.scale) < 0.001 &&
            Math.abs(transform.translate.x - config.initialCoordinates.x) < 1 &&
            Math.abs(transform.translate.y - config.initialCoordinates.y) < 1;

        if (isAtFitToScreen || config.initialCoordinates.scale === 1.0) {
            // User hasn't zoomed, or this is the initial sync — apply fit-to-screen
            setTransform({
                scale,
                translate: { x, y },
            });
        }
        // Otherwise: keep user's current transform (they zoomed/panned intentionally)
    }, [targetZoom, zoomInMultiplier, setConfig, setTransform]);
}
