// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { ActionButton as SpectrumActionButton, SpectrumActionButtonProps } from '@adobe/react-spectrum';
import { clsx } from 'clsx';

import styles from './ActionButton.module.css';

/** Visual color variant for ActionButton. */
export type ActionButtonColorVariant = 'dark' | 'light' | 'blue';

/**
 * Props for the ActionButton component.
 * Extends Spectrum's ActionButtonProps with an optional color variant.
 */
export interface ActionButtonProps extends SpectrumActionButtonProps {
    /**
     * Applies a predefined color style to the button.
     * - `dark`: subtle border on hover/active (default feel)
     * - `light`: blue-tinted hover/active for light header areas
     * - `blue`: transparent background with blue text
     */
    colorVariant?: ActionButtonColorVariant;
}

const COLOR_VARIANT_CLASSES: Record<ActionButtonColorVariant, string> = {
    dark: styles.actionButtonDark,
    light: styles.actionButtonLight,
    blue: styles.actionButtonBlue,
};

const getColorVariantClass = (colorVariant?: ActionButtonColorVariant): string | undefined =>
    colorVariant ? COLOR_VARIANT_CLASSES[colorVariant] : undefined;

/**
 * An action button component wrapping Adobe React Spectrum's ActionButton.
 * Adds optional `colorVariant` prop for Geti-specific visual styles.
 */
export const ActionButton = ({ colorVariant, UNSAFE_className, ...rest }: ActionButtonProps) => (
    <SpectrumActionButton {...rest} UNSAFE_className={clsx(getColorVariantClass(colorVariant), UNSAFE_className)} />
);
