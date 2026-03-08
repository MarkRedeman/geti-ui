import {
    DateField as SpectrumDateField,
    SpectrumDateFieldProps,
    TimeField as SpectrumTimeField,
    SpectrumTimeFieldProps,
} from '@adobe/react-spectrum';
import { DateValue } from '@react-types/datepicker';
import { TimeValue } from '@react-types/datepicker';

/**
 * DateFields allow users to enter and edit date and time values using a keyboard.
 * Each part of a date value is displayed in an individually editable segment.
 */
export const DateField = <T extends DateValue>(props: SpectrumDateFieldProps<T>) => {
    return <SpectrumDateField {...props} />;
};

export type { SpectrumDateFieldProps as DateFieldProps };

/**
 * TimeFields allow users to enter and edit time values using a keyboard.
 * Each part of the time is displayed in an individually editable segment.
 */
export const TimeField = <T extends TimeValue>(props: SpectrumTimeFieldProps<T>) => {
    return <SpectrumTimeField {...props} />;
};

export type { SpectrumTimeFieldProps as TimeFieldProps };
