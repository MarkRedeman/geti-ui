import type { Ref } from 'react';
import { SearchField as SpectrumSearchField, SpectrumSearchFieldProps } from '@adobe/react-spectrum';
import type { TextFieldRef } from '@react-types/textfield';

/** Props for the SearchField component. Extends Spectrum's SearchFieldProps with a typed ref. */
export interface SearchFieldProps extends SpectrumSearchFieldProps {
    ref?: Ref<TextFieldRef>;
}

/** A search input that wraps Adobe React Spectrum's SearchField. */
export const SearchField = (props: SearchFieldProps) => <SpectrumSearchField {...props} />;
