// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Switch as SpectrumSwitch, SpectrumSwitchProps } from '@adobe/react-spectrum';
import { clsx } from 'clsx';

import styles from './Switch.module.css';

/** Props for the Switch component. Extends Spectrum's SwitchProps without modification. */
export interface SwitchProps extends SpectrumSwitchProps {}

/**
 * A switch component wrapping Adobe React Spectrum's Switch.
 * When `isEmphasized` is true, applies Geti's energy-blue design tokens to the track
 * and handle, overriding Spectrum's default accent colour.
 */
export const Switch = ({ UNSAFE_className, ...props }: SwitchProps) => {
    return (
        <SpectrumSwitch
            {...props}
            UNSAFE_className={clsx(styles.switch, UNSAFE_className)}
            data-emphasized={props.isEmphasized}
        />
    );
};
