// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Form as SpectrumForm, SpectrumFormProps } from '@adobe/react-spectrum';

/** Props for the Form component. Extends Spectrum's FormProps without modification. */
export interface FormProps extends SpectrumFormProps {}

/** A form container that wraps Adobe React Spectrum's Form. Propagates isDisabled and validationBehavior to children. */
export const Form = (props: FormProps) => <SpectrumForm {...props} />;
