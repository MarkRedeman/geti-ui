import { RefObject } from 'react';

import { DialogTrigger as SpectrumDialogTrigger, SpectrumDialogTriggerProps } from '@adobe/react-spectrum';

/**
 * Props for the Popover component.
 * Extends Spectrum's SpectrumDialogTriggerProps and defaults `type` to `'popover'`.
 */
export interface PopoverProps extends Omit<SpectrumDialogTriggerProps, 'type'> {
    /**
     * The type of overlay to render.
     * @default 'popover'
     */
    type?: 'popover' | 'modal' | 'tray' | 'fullscreen' | 'fullscreenTakeover';
    /**
     * The ref of the element the Popover should visually attach itself to.
     * Forwarded to Spectrum's `targetRef`. Defaults to the trigger element if not defined.
     */
    triggerRef?: RefObject<HTMLElement | null>;
}

/**
 * A popover component built on top of Spectrum's DialogTrigger with `type="popover"`.
 * Displays contextual floating content anchored to a trigger element.
 */
export const Popover = ({ type = 'popover', triggerRef, ...rest }: PopoverProps) => (
    <SpectrumDialogTrigger {...rest} type={type} targetRef={triggerRef ?? rest.targetRef} />
);
