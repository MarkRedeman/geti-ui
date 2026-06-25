import type { Ref } from 'react';
import { TextField as SpectrumTextField, SpectrumTextFieldProps } from '@adobe/react-spectrum';
import type { TextFieldRef } from '@react-types/textfield';

/** Props for the TextField component. Extends Spectrum's TextFieldProps with a typed ref. */
export interface TextFieldProps extends SpectrumTextFieldProps {
    ref?: Ref<TextFieldRef>;
}

/** A single-line text input that wraps Adobe React Spectrum's TextField. */
export const TextField = (props: TextFieldProps) => <SpectrumTextField {...props} />;
