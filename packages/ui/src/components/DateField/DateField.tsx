import {
    DateField as SpectrumDateField,
    SpectrumDateFieldProps,
    TimeField as SpectrumTimeField,
    SpectrumTimeFieldProps,
} from '@adobe/react-spectrum';

// DateValue is commonly used in these props but we can just use the Spectrum types directly
// to avoid the @react-types/datepicker missing type issue since they are re-exported or bundled.

/**
 * DateFields allow users to enter and edit date and time values using a keyboard.
 * Each part of a date value is displayed in an individually editable segment.
 */
export const DateField = (props: SpectrumDateFieldProps<any>) => {
    return <SpectrumDateField {...props} />;
};

export type { SpectrumDateFieldProps as DateFieldProps };

/**
 * TimeFields allow users to enter and edit time values using a keyboard.
 * Each part of the time is displayed in an individually editable segment.
 */
export const TimeField = (props: SpectrumTimeFieldProps<any>) => {
    return <SpectrumTimeField {...props} />;
};

export type { SpectrumTimeFieldProps as TimeFieldProps };
