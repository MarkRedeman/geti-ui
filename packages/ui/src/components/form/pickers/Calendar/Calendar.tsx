import {
    Calendar as SpectrumCalendar,
    SpectrumCalendarProps,
    RangeCalendar as SpectrumRangeCalendar,
    SpectrumRangeCalendarProps,
} from '@adobe/react-spectrum';

/**
 * Calendars display a grid of days in one or more months and allow users to select a single date.
 */
export const Calendar = (props: SpectrumCalendarProps<any>) => {
    return <SpectrumCalendar {...props} />;
};

export type { SpectrumCalendarProps as CalendarProps };

/**
 * RangeCalendars display a grid of days in one or more months and allow users to select a range of dates.
 */
export const RangeCalendar = (props: SpectrumRangeCalendarProps<any>) => {
    return <SpectrumRangeCalendar {...props} />;
};

export type { SpectrumRangeCalendarProps as RangeCalendarProps };
