// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { TextArea as SpectrumTextArea, SpectrumTextAreaProps } from '@adobe/react-spectrum';

/** Props for the TextArea component. Extends Spectrum's TextAreaProps without modification. */
export interface TextAreaProps extends SpectrumTextAreaProps {}

/** A multi-line text input that wraps Adobe React Spectrum's TextArea. */
export const TextArea = (props: TextAreaProps) => <SpectrumTextArea {...props} />;
