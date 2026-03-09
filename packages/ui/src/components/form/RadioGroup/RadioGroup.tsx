import { RadioGroup as SpectrumRadioGroup, SpectrumRadioGroupProps } from '@adobe/react-spectrum';

/** Props for the RadioGroup component. Extends Spectrum's RadioGroupProps without modification. */
export interface RadioGroupProps extends SpectrumRadioGroupProps {}

/** A group of radio buttons that wraps Adobe React Spectrum's RadioGroup. */
export const RadioGroup = (props: RadioGroupProps) => <SpectrumRadioGroup {...props} />;
