// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Slider as SpectrumSlider, SpectrumSliderProps } from '@adobe/react-spectrum';
import { clsx } from 'clsx';

import styles from './Slider.module.css';

/** Props for the Slider component. Extends Spectrum's SliderProps without modification. */
export interface SliderProps extends SpectrumSliderProps {}

/**
 * A slider component wrapping Adobe React Spectrum's Slider.
 * When `isFilled` is true, applies Geti's energy-blue design tokens to the fill track
 * and handle, overriding Spectrum's default accent colour.
 */
export const Slider = ({ UNSAFE_className, ...props }: SliderProps) => {
    return (
        <SpectrumSlider
            {...props}
            UNSAFE_className={clsx(styles.slider, UNSAFE_className) || undefined}
            data-filled={props.isFilled}
        />
    );
};
