import type { Point, Size, ZoomConfig, ZoomTransformState } from './types';

/** Number of discrete steps between min and max zoom for button-based zoom */
const ZOOM_STEP_COUNT = 10;

/** Minimum visible fraction of content when panning (0.1 = 10%) */
const MIN_VISIBLE_FRACTION = 0.1;

export function clampBetween(min: number, value: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Compute fit-to-screen scale and centering translation for a target inside a container.
 *
 * @param container - viewport dimensions
 * @param target - content dimensions
 * @param padding - visual padding in pixels subtracted from the container on each side (default: 0)
 */
export function getCenterCoordinates(container: Size, target: Size, padding = 0): ZoomConfig['initialCoordinates'] {
    const availableWidth = Math.max(container.width - 2 * padding, 1);
    const availableHeight = Math.max(container.height - 2 * padding, 1);
    const scale = Math.min(availableWidth / target.width, availableHeight / target.height);

    return {
        scale,
        x: (container.width - target.width * scale) / 2,
        y: (container.height - target.height * scale) / 2,
    };
}

/**
 * Returns a state-updater function that computes a new zoom transform
 * anchored at the given cursor position.
 *
 * When `newScale` falls at or below `minScale`, the transform snaps back to
 * the min-scale position (centered via initialCoordinates).
 */
export function getZoomTransform({
    initialCoordinates,
    minScale,
    newScale,
    cursorX,
    cursorY,
}: {
    newScale: number;
    minScale?: number;
    cursorX: number;
    cursorY: number;
    initialCoordinates: ZoomConfig['initialCoordinates'];
}): (prev: ZoomTransformState) => ZoomTransformState {
    const floor = minScale ?? initialCoordinates.scale;

    return (prev) => {
        if (newScale <= floor) {
            return {
                scale: floor,
                translate: { x: initialCoordinates.x, y: initialCoordinates.y },
            };
        }

        const scaleRatio = newScale / prev.scale;
        const newTranslateX = cursorX - scaleRatio * (cursorX - prev.translate.x);
        const newTranslateY = cursorY - scaleRatio * (cursorY - prev.translate.y);

        return {
            scale: newScale,
            translate: { x: newTranslateX, y: newTranslateY },
        };
    };
}

/**
 * Clamp translate values so that at least `MIN_VISIBLE_FRACTION` of the
 * content remains visible inside the container.
 */
export function clampTranslate(translate: Point, scale: number, target: Size, container: Size): Point {
    const contentWidth = target.width * scale;
    const contentHeight = target.height * scale;
    const minVisibleWidth = contentWidth * MIN_VISIBLE_FRACTION;
    const minVisibleHeight = contentHeight * MIN_VISIBLE_FRACTION;

    return {
        x: clampBetween(-(contentWidth - minVisibleWidth), translate.x, container.width - minVisibleWidth),
        y: clampBetween(-(contentHeight - minVisibleHeight), translate.y, container.height - minVisibleHeight),
    };
}

/**
 * Detect if a pointer event is a middle mouse button press.
 */
export function isWheelButton(event: { button: number }): boolean {
    return event.button === 1;
}

export { ZOOM_STEP_COUNT };
