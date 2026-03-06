import { DateRangePicker as SpectrumDateRangePicker, SpectrumDateRangePickerProps } from '@adobe/react-spectrum';

/**
 * DateRangePickers combine two DateFields and a RangeCalendar popover to allow users to enter or select a date and time range.
 */
export const DateRangePicker = (props: SpectrumDateRangePickerProps<any>) => {
    // Safari mobile fix: Explicit width to avoid layout flickering
    return <SpectrumDateRangePicker width="size-2400" {...props} />;
};

export type { SpectrumDateRangePickerProps as DateRangePickerProps };
