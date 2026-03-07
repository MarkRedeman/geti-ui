// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Flex as SpectrumFlex } from '@adobe/react-spectrum';
import type { FlexProps } from '@adobe/react-spectrum';

/**
 * Props for the Flex component.
 * Re-exports Spectrum's FlexProps.
 */
export interface FlexComponentProps extends FlexProps {}

/**
 * A layout container using CSS flexbox that wraps Adobe React Spectrum's Flex.
 * Supports Spectrum dimension values and the `gap` property for consistent spacing.
 */
export const Flex = (props: FlexComponentProps) => <SpectrumFlex {...props} />;
