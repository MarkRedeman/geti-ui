import { NumberField as SpectrumNumberField, SpectrumNumberFieldProps } from '@adobe/react-spectrum';

/** Props for the NumberField component. Extends Spectrum's NumberFieldProps without modification. */
export interface NumberFieldProps extends SpectrumNumberFieldProps {}

/** A numeric input that wraps Adobe React Spectrum's NumberField. */
export const NumberField = (props: NumberFieldProps) => <SpectrumNumberField {...props} />;
