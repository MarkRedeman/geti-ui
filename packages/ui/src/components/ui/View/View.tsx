// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { View as SpectrumView } from '@adobe/react-spectrum';

/**
 * A general purpose layout container that wraps Adobe React Spectrum's View.
 * Supports Spectrum style props for background color, padding, border, and more.
 */
export const View = (props: React.ComponentProps<typeof SpectrumView>) => <SpectrumView {...props} />;

/**
 * Props for the View component.
 * Inferred from Spectrum's View component props.
 */
export type ViewProps = React.ComponentProps<typeof SpectrumView>;
