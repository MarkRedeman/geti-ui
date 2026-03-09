import { Picker as SpectrumPicker, SpectrumPickerProps } from '@adobe/react-spectrum';

export { Item } from '@adobe/react-spectrum';

/** Props for the Picker component. Extends Spectrum's PickerProps without modification. */
export interface PickerProps<T extends object> extends SpectrumPickerProps<T> {}

/** A dropdown picker that wraps Adobe React Spectrum's Picker. Use with the exported Item component for options. */
export const Picker = <T extends object>(props: PickerProps<T>) => <SpectrumPicker {...props} />;
