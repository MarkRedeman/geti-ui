// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Button as SpectrumButton, SpectrumButtonProps } from '@adobe/react-spectrum';

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
}

/**
 * A button component that wraps Adobe React Spectrum's Button.
 * Excludes legacy variants (`cta`, `overBackground`) and defaults to `accent`.
 */
export const Button = ({ variant = 'accent', ...rest }: ButtonProps) => <SpectrumButton {...rest} variant={variant} />;
