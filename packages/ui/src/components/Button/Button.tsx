// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Button as SpectrumButton, SpectrumButtonProps } from '@adobe/react-spectrum';
import { clsx } from 'clsx';

type VariantWithoutLegacy = Exclude<SpectrumButtonProps['variant'], 'cta' | 'overBackground'>;

/**
 * Props for the Button component.
 * Extends Spectrum's ButtonProps, excluding legacy variants `cta` and `overBackground`.
 */
export interface ButtonProps extends Omit<SpectrumButtonProps, 'variant'> {
    /**
     * Visual style of the button.
     * @default 'accent'
     */
    variant?: VariantWithoutLegacy;
    /** Optional CSS class name(s) to apply via Spectrum's UNSAFE_className escape hatch. */
    UNSAFE_className?: string;
}

/**
 * A button component that wraps Adobe React Spectrum's Button.
 * Excludes legacy variants (`cta`, `overBackground`) and defaults to `accent`.
 * Accepts `UNSAFE_className` and merges it cleanly via clsx.
 */
export const Button = ({ variant = 'accent', UNSAFE_className, ...rest }: ButtonProps) => (
    <SpectrumButton {...rest} variant={variant} UNSAFE_className={clsx(UNSAFE_className) || undefined} />
);
