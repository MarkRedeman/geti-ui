// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { ComboBox as SpectrumComboBox, SpectrumComboBoxProps } from '@adobe/react-spectrum';

export { Item } from '@adobe/react-spectrum';

/** Props for the ComboBox component. Extends Spectrum's ComboBoxProps without modification. */
export interface ComboBoxProps<T extends object> extends SpectrumComboBoxProps<T> {}

/** A combobox input that wraps Adobe React Spectrum's ComboBox. Use with the exported Item component for options. */
export const ComboBox = <T extends object>(props: ComboBoxProps<T>) => <SpectrumComboBox {...props} />;
