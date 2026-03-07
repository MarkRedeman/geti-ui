// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { InlineAlert as SpectrumInlineAlert, SpectrumInlineAlertProps } from '@adobe/react-spectrum';

/**
 * Props for the InlineAlert component.
 * Extends Spectrum's SpectrumInlineAlertProps.
 */
export interface InlineAlertProps extends SpectrumInlineAlertProps {}

/**
 * An inline alert component that wraps Adobe React Spectrum's InlineAlert.
 * Inline alerts display a non-modal message associated with objects in a view.
 * These are often used in form validation to aggregate feedback for multiple fields.
 */
export const InlineAlert = (props: InlineAlertProps) => <SpectrumInlineAlert {...props} />;
