// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { type CSSProperties } from 'react';

import { Switch as SpectrumSwitch, SpectrumSwitchProps } from '@adobe/react-spectrum';

/** Props for the Switch component. Extends Spectrum's SwitchProps without modification. */
export interface SwitchProps extends SpectrumSwitchProps {}

/**
 * A switch component wrapping Adobe React Spectrum's Switch.
 * When `isEmphasized` is true, applies Geti's energy-blue design tokens to the track
 * and handle, overriding Spectrum's default accent colour.
 */
export const Switch = ({ UNSAFE_style, ...props }: SwitchProps) => {
    const emphasizedStyles: CSSProperties = props.isEmphasized
        ? ({
              '--spectrum-switch-emphasized-track-color-selected': 'var(--energy-blue)',
              '--spectrum-switch-emphasized-track-color-selected-hover': 'var(--energy-blue-light)',
              '--spectrum-switch-emphasized-track-color-selected-down': 'var(--energy-blue-lighter)',
              '--spectrum-switch-emphasized-handle-border-color-selected': 'var(--energy-blue)',
              '--spectrum-switch-emphasized-handle-border-color-selected-hover': 'var(--energy-blue-light)',
              '--spectrum-switch-emphasized-handle-border-color-selected-down': 'var(--energy-blue-lighter)',
          } as CSSProperties)
        : {};

    return <SpectrumSwitch {...props} UNSAFE_style={{ ...UNSAFE_style, ...emphasizedStyles }} />;
};
