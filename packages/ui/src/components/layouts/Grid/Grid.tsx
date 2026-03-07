// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Grid as SpectrumGrid } from '@adobe/react-spectrum';
import type { GridProps } from '@adobe/react-spectrum';

/**
 * Props for the Grid component.
 * Re-exports Spectrum's GridProps.
 */
export interface GridComponentProps extends GridProps {}

/**
 * A layout container using CSS grid that wraps Adobe React Spectrum's Grid.
 * Supports Spectrum dimension values for consistent and adaptive sizing and spacing.
 */
export const Grid = (props: GridComponentProps) => <SpectrumGrid {...props} />;
