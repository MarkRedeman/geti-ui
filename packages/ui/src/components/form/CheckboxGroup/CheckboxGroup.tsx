import { CheckboxGroup as SpectrumCheckboxGroup, SpectrumCheckboxGroupProps } from '@adobe/react-spectrum';

/** Props for the CheckboxGroup component. Extends Spectrum's CheckboxGroupProps without modification. */
export interface CheckboxGroupProps extends SpectrumCheckboxGroupProps {}

/** A group of checkboxes that wraps Adobe React Spectrum's CheckboxGroup. */
export const CheckboxGroup = (props: CheckboxGroupProps) => <SpectrumCheckboxGroup {...props} />;
