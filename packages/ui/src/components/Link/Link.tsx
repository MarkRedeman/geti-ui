// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Link as SpectrumLink, SpectrumLinkProps } from '@adobe/react-spectrum';

/**
 * Props for the Link component.
 * Extends Spectrum's LinkProps without modification.
 */
export interface LinkProps extends SpectrumLinkProps {}

/**
 * A link component wrapping Adobe React Spectrum's Link.
 * Supports primary and secondary variants, quiet style, and standard anchor attributes.
 */
export const Link = (props: LinkProps) => <SpectrumLink {...props} />;
