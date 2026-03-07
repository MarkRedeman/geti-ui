// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { TabPanels as SpectrumTabPanels, SpectrumTabPanelsProps } from '@adobe/react-spectrum';

/**
 * Props for the TabPanels component.
 * Extends Spectrum's SpectrumTabPanelsProps without modification.
 */
export interface TabPanelsProps<T extends object> extends SpectrumTabPanelsProps<T> {}

/**
 * A tab panels component that wraps Adobe React Spectrum's TabPanels.
 * Renders the content area corresponding to the selected tab. Must be used inside Tabs with Item children.
 */
export const TabPanels = <T extends object>(props: TabPanelsProps<T>) => <SpectrumTabPanels {...props} />;
