// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Tooltip as SpectrumTooltip, SpectrumTooltipProps } from '@adobe/react-spectrum';

/**
 * Props for the Tooltip component.
 * Extends Spectrum's SpectrumTooltipProps.
 */
export interface TooltipProps extends SpectrumTooltipProps {}

/**
 * A tooltip component that wraps Adobe React Spectrum's Tooltip.
 * Displays a short description when a user hovers or focuses a trigger element.
 */
export const Tooltip = (props: TooltipProps) => <SpectrumTooltip {...props} />;
