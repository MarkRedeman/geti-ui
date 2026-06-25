import type { Ref } from 'react';
import { Grid as SpectrumGrid } from '@adobe/react-spectrum';
import type { GridProps } from '@adobe/react-spectrum';
import type { DOMRefValue } from '@react-types/shared';

/**
 * Props for the Grid component.
 * Extends Spectrum's GridProps with a typed ref.
 */
export interface GridComponentProps extends GridProps {
    ref?: Ref<DOMRefValue<HTMLDivElement>>;
}

/**
 * A layout container using CSS grid that wraps Adobe React Spectrum's Grid.
 * Supports Spectrum dimension values for consistent and adaptive sizing and spacing.
 */
export const Grid = (props: GridComponentProps) => <SpectrumGrid {...props} />;
