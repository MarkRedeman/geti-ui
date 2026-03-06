// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { CSSProperties } from 'react';

/**
 * Props for the Skeleton component.
 */
export interface SkeletonProps {
    /**
     * Renders the skeleton as a circle instead of a rectangle.
     * @default false
     */
    isCircle?: boolean;

    /**
     * Enforces a 1:1 aspect ratio on the skeleton.
     * @default false
     */
    isAspectRatioOne?: boolean;

    /**
     * Width of the skeleton element. Accepts any valid CSS width value.
     * @example '100%', '200px', 'size-2400'
     */
    width?: string | number;

    /**
     * Height of the skeleton element. Accepts any valid CSS height value.
     * @example '24px', '100%'
     */
    height?: string | number;

    /**
     * Additional CSS class names.
     */
    className?: string;

    /**
     * Additional inline styles applied to the skeleton element.
     */
    style?: CSSProperties;

    /**
     * Accessible label for the skeleton (announced to screen readers).
     */
    'aria-label'?: string;
}

const shimmerStyle: CSSProperties = {
    background: `linear-gradient(
        to right,
        rgba(88, 90, 98, 0.15) 0%,
        rgba(88, 90, 98, 0.35) 50%,
        rgba(88, 90, 98, 0.15) 75%
    )`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s ease infinite',
};

/**
 * A skeleton placeholder component used to indicate content is loading.
 * Renders a shimmering rectangle or circle in place of real content.
 *
 * @example
 * // Rectangle skeleton
 * <Skeleton width="100%" height={24} />
 *
 * // Circle skeleton
 * <Skeleton isCircle width={40} height={40} />
 *
 * // Square with aspect ratio enforced
 * <Skeleton isAspectRatioOne width={80} />
 */
export const Skeleton = ({
    isCircle = false,
    isAspectRatioOne = false,
    width,
    height,
    className,
    style = {},
    'aria-label': ariaLabel,
}: SkeletonProps) => {
    const computedStyle: CSSProperties = {
        ...shimmerStyle,
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : '1rem',
        borderRadius: isCircle ? '50%' : '4px',
        aspectRatio: isAspectRatioOne ? '1' : undefined,
        display: 'block',
        ...style,
    };

    return (
        <span
            role="img"
            aria-label={ariaLabel ?? 'Loading…'}
            aria-busy="true"
            className={className}
            style={computedStyle}
        />
    );
};
