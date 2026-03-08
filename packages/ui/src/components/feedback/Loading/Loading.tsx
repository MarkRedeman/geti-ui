// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { CSSProperties } from 'react';

import { SpectrumProgressCircleProps } from '@adobe/react-spectrum';

import IntelLoadingWebp from '../IntelBrandedLoading/intel-loading.webp';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';

/**
 * Props for the Loading component.
 *
 * Extends Adobe Spectrum's ProgressCircle props to provide a flexible loading indicator
 * suitable for various use cases.
 */
export interface LoadingProps extends Omit<SpectrumProgressCircleProps, 'variant'> {
    /**
     * The display mode for the loading component.
     * - 'inline': Renders centered without overlay positioning.
     * - 'fullscreen': Renders as a fixed full-screen overlay.
     * - 'overlay': Renders as an absolutely-positioned overlay.
     * @default 'fullscreen'
     */
    mode?: 'inline' | 'fullscreen' | 'overlay';

    /**
     * The visual variant of the loading indicator.
     * - 'spinner': Renders an Adobe Spectrum progress circle.
     * - 'intel': Renders the Intel branded loading animation.
     * @default 'spinner'
     */
    variant?: 'spinner' | 'intel';

    /**
     * Additional CSS styles applied to the container element.
     */
    style?: CSSProperties;

    /**
     * Additional CSS class names applied to the container element.
     */
    className?: string;
}

const INTEL_SIZE_MAP: Record<NonNullable<SpectrumProgressCircleProps['size']>, number> = {
    S: 24,
    M: 48,
    L: 192,
};

const FULLSCREEN_STYLE: CSSProperties = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const OVERLAY_STYLE: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const INLINE_STYLE: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

/**
 * A flexible loading component that renders a progress spinner or Intel branded animation
 * in different layout modes.
 *
 * Supports inline, fullscreen, and overlay display patterns used throughout Geti.
 *
 * @example
 * // Simple inline loading spinner
 * <Loading mode="inline" size="M" />
 *
 * // Full-screen overlay
 * <Loading mode="fullscreen" />
 *
 * // Intel branded loading (full-page style by default)
 * <Loading variant="intel" />
 *
 * // Absolutely-positioned overlay
 * <Loading mode="overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
 */
export const Loading = ({
    mode = 'fullscreen',
    variant = 'spinner',
    size = 'L',
    style = {},
    className,
    ...rest
}: LoadingProps) => {
    const baseStyle = mode === 'inline' ? INLINE_STYLE : mode === 'overlay' ? OVERLAY_STYLE : FULLSCREEN_STYLE;

    if (variant === 'intel') {
        const px = INTEL_SIZE_MAP[size as keyof typeof INTEL_SIZE_MAP] ?? INTEL_SIZE_MAP['L'];
        return (
            <div style={{ ...baseStyle, ...style }} className={className}>
                <img src={IntelLoadingWebp} role="progressbar" alt="Loading" width={px} height={px} />
            </div>
        );
    }

    return (
        <div style={{ ...baseStyle, ...style }} className={className}>
            <ProgressCircle aria-label="Loading..." isIndeterminate size={size} {...rest} />
        </div>
    );
};
