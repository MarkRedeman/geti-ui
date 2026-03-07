// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { TagGroup as SpectrumTagGroup, Item as SpectrumItem } from '@adobe/react-spectrum';
import type { SpectrumTagGroupProps } from '@adobe/react-spectrum';

/**
 * Props for the TagGroup component.
 * Extends Spectrum's SpectrumTagGroupProps.
 */
export interface TagGroupProps<T extends object> extends SpectrumTagGroupProps<T> {}

/**
 * Re-export of Spectrum Item for use with TagGroup.
 */
export const Item = SpectrumItem;

/**
 * A tag group component that wraps Adobe React Spectrum's TagGroup.
 * Displays a collection of tag items that can optionally be removed by the user.
 */
export const TagGroup = <T extends object>(props: TagGroupProps<T>) => <SpectrumTagGroup {...props} />;
