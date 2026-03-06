// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { ListBox as SpectrumListBox, Item as SpectrumItem } from '@adobe/react-spectrum';
import type { SpectrumListBoxProps } from '@adobe/react-spectrum';

/**
 * Props for the ListBox component.
 * Extends Spectrum's SpectrumListBoxProps.
 */
export interface ListBoxProps<T extends object> extends SpectrumListBoxProps<T> {}

/**
 * Re-export of Spectrum Item for use with ListBox.
 */
export const Item = SpectrumItem;

/**
 * A list box component that wraps Adobe React Spectrum's ListBox.
 * Displays a list of options that users can select from,
 * supporting single and multiple selection modes.
 */
export const ListBox = <T extends object>(props: ListBoxProps<T>) => <SpectrumListBox {...props} />;
