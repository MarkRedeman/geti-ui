// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Breadcrumbs as SpectrumBreadcrumbs, SpectrumBreadcrumbsProps } from '@adobe/react-spectrum';

/**
 * Props for the Breadcrumbs component.
 * Extends Spectrum's SpectrumBreadcrumbsProps without modification.
 */
export interface BreadcrumbsProps<T extends object> extends SpectrumBreadcrumbsProps<T> {}

/**
 * A breadcrumbs component that wraps Adobe React Spectrum's Breadcrumbs.
 * Displays a hierarchy of links, allowing users to navigate back to ancestor pages.
 * Compose with the exported Item component for each breadcrumb link.
 */
export const Breadcrumbs = <T extends object>(props: BreadcrumbsProps<T>) => <SpectrumBreadcrumbs {...props} />;
