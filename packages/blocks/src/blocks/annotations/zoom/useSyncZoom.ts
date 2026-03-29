import { useLayoutEffect, useMemo } from 'react';

import type { Size } from './types';
import { getCenterCoordinates } from './utils';
import { useZoomInternal } from './ZoomProvider';

type UseSyncZoomOptions = {
    container: Size;
    target: Size;
    zoomInMultiplier: number;
    zoomOutMultiplier: number;
    fitPadding: number;
};

/**
 * Synchronizes zoom config when container or target size changes.
 *
 * Uses useLayoutEffect so the transform is applied before the browser
 * paints, preventing a one-frame flash at scale=1 that would cause
 * the ResizeObserver to measure a wrong container size (due to content
 * overflow).
 *
 * Reads the `userHasInteractedRef` from ZoomProvider. If the user has
 * actively zoomed/panned, only the config (initialCoordinates, limits) is
 * updated without resetting the current transform. Otherwise, the viewport
 * is re-centered to fit the content.
 */
export function useSyncZoom({ container, target, zoomInMultiplier, zoomOutMultiplier, fitPadding }: UseSyncZoomOptions) {
    const { setConfig, setTransform, userHasInteractedRef } = useZoomInternal();
    const containerWidth = container.width;
    const containerHeight = container.height;
    const targetWidth = target.width;
    const targetHeight = target.height;

    const targetZoom = useMemo(() => {
        if (!containerWidth || !containerHeight) {
            return { scale: 1.0, x: 0, y: 0 };
        }

        return getCenterCoordinates(
            { width: containerWidth, height: containerHeight },
            { width: targetWidth, height: targetHeight },
            fitPadding
        );
    }, [containerHeight, containerWidth, fitPadding, targetHeight, targetWidth]);

    // Reset interaction flag when the target content changes (new image, etc.)
    useLayoutEffect(() => {
        userHasInteractedRef.current = false;
    }, [targetHeight, targetWidth, userHasInteractedRef]);

    useLayoutEffect(() => {
        const roundedCoordinates = {
            scale: Number(targetZoom.scale.toFixed(3)),
            x: Number(targetZoom.x.toFixed(3)),
            y: Number(targetZoom.y.toFixed(3)),
        };

        setConfig({
            initialCoordinates: roundedCoordinates,
            minScale: roundedCoordinates.scale * zoomOutMultiplier,
            maxScale: roundedCoordinates.scale * zoomInMultiplier,
        });

        if (!userHasInteractedRef.current) {
            // User hasn't zoomed/panned - apply fit-to-screen
            setTransform({
                scale: roundedCoordinates.scale,
                translate: { x: roundedCoordinates.x, y: roundedCoordinates.y },
            });
        }
        // Otherwise: keep user's current transform (they zoomed/panned intentionally)
    }, [
        fitPadding,
        setConfig,
        setTransform,
        targetHeight,
        targetWidth,
        targetZoom,
        userHasInteractedRef,
        zoomInMultiplier,
        zoomOutMultiplier,
    ]);
}
