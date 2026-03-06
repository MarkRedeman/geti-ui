// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { type CSSProperties } from 'react';

import { Slider as SpectrumSlider, SpectrumSliderProps } from '@adobe/react-spectrum';

/** Props for the Slider component. Extends Spectrum's SliderProps without modification. */
export interface SliderProps extends SpectrumSliderProps {}

/**
 * A slider component wrapping Adobe React Spectrum's Slider.
 * When `isFilled` is true, applies Geti's energy-blue design tokens to the fill track
 * and handle, overriding Spectrum's default accent colour.
 */
export const Slider = ({ UNSAFE_style, ...props }: SliderProps) => {
    const filledStyles: CSSProperties = props.isFilled
        ? ({
              '--spectrum-slider-fill-track-color': 'var(--energy-blue)',
              '--spectrum-slider-handle-border-color': 'var(--energy-blue)',
              '--spectrum-slider-handle-border-color-down': 'var(--energy-blue-lighter)',
              '--spectrum-slider-handle-border-color-hover': 'var(--energy-blue-light)',
          } as CSSProperties)
        : {};

    return <SpectrumSlider {...props} UNSAFE_style={{ ...UNSAFE_style, ...filledStyles }} />;
};
