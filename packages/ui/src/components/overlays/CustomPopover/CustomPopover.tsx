// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { CSSProperties, ReactNode } from 'react';
import {
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    OverlayArrow,
    Popover as AriaPopover,
    PopoverProps as AriaPopoverProps,
    Button as AriaButton,
} from 'react-aria-components';

/**
 * Props for the CustomPopover component.
 * Extends react-aria-components PopoverProps with Geti-specific chrome options.
 */
export interface CustomPopoverProps extends Omit<AriaPopoverProps, 'children' | 'trigger'> {
    /** Content to render inside the popover. */
    children: ReactNode;
    /** Whether to show the directional arrow. @default false */
    showArrow?: boolean;
    /** Custom width for the popover panel. */
    width?: number | string;
    /**
     * The trigger element. If provided, the component manages open state internally via DialogTrigger.
     * Must be a RAC-compatible pressable element (e.g. Button) to receive ARIA and keyboard handlers.
     */
    triggerElement?: ReactNode;
}

/**
 * A Geti-styled popover built on react-aria-components.
 * Adds Geti-specific chrome such as optional arrow rendering and width control.
 * When `triggerElement` is provided, it manages open/close state automatically via DialogTrigger.
 */
export const CustomPopover = ({
    children,
    showArrow = false,
    width,
    triggerElement,
    style,
    ...rest
}: CustomPopoverProps) => {
    const popoverStyle: CSSProperties = {
        ...style,
        ...(width !== undefined ? { width, minWidth: width } : {}),
    };

    const renderArrow = () =>
        showArrow && (
            <OverlayArrow>
                {/* 
                    Arrow SVG points upward (∧) by default. 
                    RAC rotates it automatically to match popover placement.
                */}
                <svg width={12} height={12} viewBox="0 0 12 12">
                    <path d="M0 12 L6 6 L12 12" />
                </svg>
            </OverlayArrow>
        );

    if (triggerElement !== undefined) {
        // Ensure the trigger is a RAC-aware element for accessibility.
        const trigger = typeof triggerElement === 'string' ? <AriaButton>{triggerElement}</AriaButton> : triggerElement;

        return (
            <AriaDialogTrigger>
                {trigger}
                <AriaPopover {...rest} style={popoverStyle}>
                    {renderArrow()}
                    <AriaDialog>{children}</AriaDialog>
                </AriaPopover>
            </AriaDialogTrigger>
        );
    }

    return (
        <AriaPopover {...rest} style={popoverStyle}>
            {renderArrow()}
            <AriaDialog>{children}</AriaDialog>
        </AriaPopover>
    );
};
