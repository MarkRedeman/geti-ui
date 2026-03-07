// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Checkbox as SpectrumCheckbox, SpectrumCheckboxProps } from '@adobe/react-spectrum';

/** Props for the Checkbox component. Extends Spectrum's CheckboxProps without modification. */
export interface CheckboxProps extends SpectrumCheckboxProps {}

/** A checkbox input that wraps Adobe React Spectrum's Checkbox. */
export const Checkbox = (props: CheckboxProps) => <SpectrumCheckbox {...props} />;
