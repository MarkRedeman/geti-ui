import { forwardRef } from 'react';
import { SearchField as SpectrumSearchField, SpectrumSearchFieldProps } from '@adobe/react-spectrum';
import type { TextFieldRef } from '@react-types/textfield';

/** Props for the SearchField component. Extends Spectrum's SearchFieldProps without modification. */
export interface SearchFieldProps extends Omit<SpectrumSearchFieldProps, 'ref'> {}

/** A search input that wraps Adobe React Spectrum's SearchField. Supports ref forwarding via TextFieldRef. */
export const SearchField = forwardRef<TextFieldRef, SearchFieldProps>((props, ref) => (
    <SpectrumSearchField {...props} ref={ref} />
));

SearchField.displayName = 'SearchField';
