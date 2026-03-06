// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import {
    Disclosure as SpectrumDisclosure,
    DisclosurePanel,
    DisclosureTitle,
    SpectrumDisclosureProps,
    SpectrumDisclosurePanelProps,
    SpectrumDisclosureTitleProps,
} from '@adobe/react-spectrum';

/**
 * Props for the Disclosure component.
 * Extends Spectrum's SpectrumDisclosureProps.
 */
export interface DisclosureProps extends SpectrumDisclosureProps {}

/**
 * A collapsible section of content that wraps Adobe React Spectrum's Disclosure.
 * Composed of a heading (DisclosureTitle) that expands and collapses a panel (DisclosurePanel).
 */
export const Disclosure = (props: DisclosureProps) => <SpectrumDisclosure {...props} />;

export type { SpectrumDisclosurePanelProps as DisclosurePanelProps };
export type { SpectrumDisclosureTitleProps as DisclosureTitleProps };
export { DisclosurePanel, DisclosureTitle };
