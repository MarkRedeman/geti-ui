import { TextField as SpectrumTextField, SpectrumTextFieldProps } from '@adobe/react-spectrum';

/** Props for the TextField component. Extends Spectrum's TextFieldProps without modification. */
export interface TextFieldProps extends SpectrumTextFieldProps {}

/** A single-line text input that wraps Adobe React Spectrum's TextField. */
export const TextField = (props: TextFieldProps) => <SpectrumTextField {...props} />;
