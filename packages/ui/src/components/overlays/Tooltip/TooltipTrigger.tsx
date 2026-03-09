import { TooltipTrigger as SpectrumTooltipTrigger, SpectrumTooltipTriggerProps } from '@adobe/react-spectrum';

/**
 * Props for the TooltipTrigger component.
 * Extends Spectrum's SpectrumTooltipTriggerProps.
 */
export interface TooltipTriggerProps extends SpectrumTooltipTriggerProps {}

/**
 * Wraps a trigger element and a Tooltip, managing open/close state on hover or focus.
 * Must receive exactly two children: the trigger element and a Tooltip.
 */
export const TooltipTrigger = (props: TooltipTriggerProps) => <SpectrumTooltipTrigger {...props} />;
