import { useId } from 'react';

import { AnnotationContext } from './AnnotationProvider';
import { AnnotationShape } from './AnnotationShape';
import { useHoveredAnnotation, useIsHovered } from './HoveredProvider';
import type { MaskAnnotationsProps } from './types';

/**
 * SVG `<mask>` that dims all annotations except the one currently hovered.
 *
 * When no annotation is hovered the mask is fully transparent.
 * On hover, the background darkens and a cutout reveals the hovered annotation.
 *
 * Must be used inside a `<HoveredProvider>`.
 */
export function MaskAnnotations({ annotations, children, width, height }: MaskAnnotationsProps) {
    const isHovered = useIsHovered();
    const hoveredAnnotationId = useHoveredAnnotation();
    const maskOpacity = isHovered ? 0.8 : 0.0;
    const maskId = useId();

    return (
        <>
            <mask id={maskId}>
                <rect x='0' y='0' width={width} height={height} style={{ fill: 'white', fillOpacity: 1.0 }} />
                {annotations.map((annotation) => (
                    <g
                        key={annotation.id}
                        style={{
                            fill: 'black',
                            fillOpacity: annotation.id === hoveredAnnotationId ? 1.0 : 0.0,
                            transitionProperty: 'fill-opacity',
                            transitionTimingFunction: 'ease-in-out',
                            transitionDuration: annotation.id === hoveredAnnotationId ? '0.2s' : '0.1s',
                            transitionDelay: annotation.id === hoveredAnnotationId ? '0s' : '0.25s',
                        }}
                    >
                        <AnnotationContext.Provider value={annotation}>
                            <AnnotationShape />
                        </AnnotationContext.Provider>
                    </g>
                ))}
            </mask>
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                mask={`url(#${maskId})`}
                style={{
                    fillOpacity: maskOpacity,
                    fill: 'black',
                    strokeWidth: 0,
                    transition: 'fill-opacity 0.1s ease-in-out',
                    transitionDelay: isHovered ? '0s' : '0.25s',
                    transitionDuration: isHovered ? '0.2s' : '0.1s',
                }}
            />
            <g>{children}</g>
        </>
    );
}
