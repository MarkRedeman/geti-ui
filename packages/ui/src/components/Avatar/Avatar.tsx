// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Avatar as SpectrumAvatar } from '@adobe/react-spectrum';
import type { SpectrumAvatarProps } from '@adobe/react-spectrum';

/**
 * Props for the Avatar component.
 * Extends Spectrum's SpectrumAvatarProps.
 */
export interface AvatarProps extends SpectrumAvatarProps {}

/**
 * An avatar component that wraps Adobe React Spectrum's Avatar.
 * Displays a thumbnail representation of an entity such as a user or organization.
 * Supports image src, alt text, sizes, and disabled state.
 */
export const Avatar = (props: AvatarProps) => <SpectrumAvatar {...props} />;
