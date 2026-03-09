import { RangeSlider as SpectrumRangeSlider, SpectrumRangeSliderProps } from '@adobe/react-spectrum';

/** Props for the RangeSlider component. Extends Spectrum's RangeSliderProps without modification. */
export interface RangeSliderProps extends SpectrumRangeSliderProps {}

/** A dual-handle range slider that wraps Adobe React Spectrum's RangeSlider. */
export const RangeSlider = (props: RangeSliderProps) => <SpectrumRangeSlider {...props} />;
