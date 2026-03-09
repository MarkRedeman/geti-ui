import { Radio as SpectrumRadio, SpectrumRadioProps } from '@adobe/react-spectrum';

/** Props for the Radio component. Extends Spectrum's RadioProps without modification. */
export interface RadioProps extends SpectrumRadioProps {}

/** A radio button that wraps Adobe React Spectrum's Radio. Intended to be used inside RadioGroup. */
export const Radio = (props: RadioProps) => <SpectrumRadio {...props} />;
