import { Badge as SpectrumBadge, SpectrumBadgeProps } from '@adobe/react-spectrum';

/**
 * Props for the Badge component.
 * Extends Spectrum's SpectrumBadgeProps.
 */
export interface BadgeProps extends SpectrumBadgeProps {}

/**
 * A badge component that wraps Adobe React Spectrum's Badge.
 * Badges are used for showing a small amount of color-categorized metadata,
 * ideal for getting a user's attention.
 */
export const Badge = (props: BadgeProps) => <SpectrumBadge {...props} />;
