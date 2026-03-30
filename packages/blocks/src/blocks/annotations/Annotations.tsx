import { AnnotationContext } from './AnnotationProvider';
import { AnnotationShape } from './AnnotationShape';
import { HoverableAnnotation, HoveredProvider } from './HoveredProvider';
import { MaskAnnotations } from './MaskAnnotations';
import { SelectableAnnotation, SelectedProvider } from './SelectedProvider';
import type { Annotation, AnnotationsProps } from './types';
import { DEFAULT_ANNOTATION_STYLES } from './types';

// ---------------------------------------------------------------------------
// Internal single-annotation renderer
// ---------------------------------------------------------------------------

function AnnotationItem({
    annotation,
    interactive,
}: {
    annotation: Annotation;
    interactive: boolean;
}) {
    const shape = <AnnotationShape />;

    if (!interactive) {
        return (
            <AnnotationContext.Provider value={annotation}>
                {shape}
            </AnnotationContext.Provider>
        );
    }

    return (
        <AnnotationContext.Provider value={annotation}>
            <HoverableAnnotation>
                <SelectableAnnotation>
                    {shape}
                </SelectableAnnotation>
            </HoverableAnnotation>
        </AnnotationContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

/**
 * Fully composed annotation renderer.
 *
 * Renders an `<svg>` element sized to `width` x `height`, with each annotation
 * drawn as the appropriate SVG shape. When `interactive` (the default), hover
 * highlighting, click-to-select, and the dimming mask are enabled.
 *
 * For full control over composition, use the individual primitives instead:
 * `HoveredProvider`, `SelectedProvider`, `HoverableAnnotation`,
 * `SelectableAnnotation`, `MaskAnnotations`, `AnnotationShape`.
 *
 * @example
 * ```tsx
 * <Annotations annotations={data} width={800} height={600} />
 * ```
 */
export function Annotations({ annotations, width, height, interactive = true }: AnnotationsProps) {
    const content = (
        <svg width={width} height={height} style={DEFAULT_ANNOTATION_STYLES}>
            {interactive ? (
                <MaskAnnotations annotations={annotations} width={width} height={height}>
                    {annotations.map((annotation) => (
                        <AnnotationItem
                            key={annotation.id}
                            annotation={annotation}
                            interactive={interactive}
                        />
                    ))}
                </MaskAnnotations>
            ) : (
                annotations.map((annotation) => (
                    <AnnotationItem
                        key={annotation.id}
                        annotation={annotation}
                        interactive={false}
                    />
                ))
            )}
        </svg>
    );

    if (!interactive) {
        return content;
    }

    return (
        <HoveredProvider>
            <SelectedProvider>
                {content}
            </SelectedProvider>
        </HoveredProvider>
    );
}
