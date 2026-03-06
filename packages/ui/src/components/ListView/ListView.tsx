// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { ListView as SpectrumListView, Item as SpectrumItem } from '@adobe/react-spectrum';
import type { SpectrumListViewProps } from '@adobe/react-spectrum';

/**
 * Props for the ListView component.
 * Extends Spectrum's SpectrumListViewProps.
 */
export interface ListViewProps<T extends object> extends SpectrumListViewProps<T> {}

/**
 * Re-export of Spectrum Item for use with ListView.
 */
export const Item = SpectrumItem;

/**
 * A list view component that wraps Adobe React Spectrum's ListView.
 * Displays a list of interactive items, supporting selection, drag-and-drop,
 * and multiple density variants.
 */
export const ListView = <T extends object>(props: ListViewProps<T>) => <SpectrumListView {...props} />;
