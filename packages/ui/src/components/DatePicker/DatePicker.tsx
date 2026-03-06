import { DatePicker as SpectrumDatePicker, SpectrumDatePickerProps } from '@adobe/react-spectrum';

/**
 * DatePickers combine a DateField and a Calendar popover to allow users to enter or select a date and time value.
 */
export const DatePicker = (props: SpectrumDatePickerProps<any>) => {
    // Safari mobile fix: Explicit width to avoid layout flickering
    return <SpectrumDatePicker width="size-2400" {...props} />;
};

export type { SpectrumDatePickerProps as DatePickerProps };
