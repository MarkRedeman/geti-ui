// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import {
  Calendar,
  DateField,
  DatePicker,
  DateRangePicker,
  Divider,
  Flex,
  RangeCalendar,
  TimeField,
  View,
} from '@geti/ui';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <Flex direction="column" gap="size-50" marginBottom="size-200">
    <h2
      style={{
        margin: 0,
        fontSize: 'var(--spectrum-global-dimension-font-size-400)',
        fontWeight: 700,
        color: 'var(--spectrum-global-color-gray-800)',
        letterSpacing: '0.01em',
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          margin: 0,
          fontSize: 'var(--spectrum-global-dimension-font-size-75)',
          color: 'var(--spectrum-global-color-gray-600)',
        }}
      >
        {subtitle}
      </p>
    )}
    <Divider size="S" marginTop="size-100" />
  </Flex>
);

const SubLabel = ({ children }: { children: string }) => (
  <p
    style={{
      margin: '0 0 4px 0',
      fontSize: 'var(--spectrum-global-dimension-font-size-50)',
      fontWeight: 600,
      color: 'var(--spectrum-global-color-gray-500)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    }}
  >
    {children}
  </p>
);

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export function DateControlsKitchenSinkExample() {
  return (
    <View padding="size-250" width="100%">
      <Flex direction="column" gap="size-400">
        <View>
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: 'var(--spectrum-global-dimension-font-size-600)',
              fontWeight: 800,
              color: 'var(--spectrum-global-color-gray-900)',
            }}
          >
            Date Controls — Kitchen Sink
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--spectrum-global-dimension-font-size-100)',
              color: 'var(--spectrum-global-color-gray-600)',
            }}
          >
            Showcase of date and time picker components: DateField, TimeField, DatePicker,
            DateRangePicker, Calendar, and RangeCalendar.
          </p>
        </View>

        <Divider size="L" />

        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Date &amp; Time Controls"
            subtitle="DateField, TimeField, DatePicker, DateRangePicker, Calendar, RangeCalendar"
          />

          <Flex direction="column" gap="size-300">
            {/* DateField */}
            <div>
              <SubLabel>DateField — keyboard date entry</SubLabel>
              <Flex direction="column" gap="size-150">
                <DateField label="Start date" width="size-2400" />
                <DateField label="With time" granularity="minute" width="size-2400" />
                <DateField
                  label="Invalid"
                  validationState="invalid"
                  errorMessage="Please enter a valid date."
                  width="size-2400"
                />
                <DateField label="Disabled" isDisabled width="size-2400" />
              </Flex>
            </div>

            <Divider size="S" />

            {/* TimeField */}
            <div>
              <SubLabel>TimeField — keyboard time entry</SubLabel>
              <Flex direction="column" gap="size-150">
                <TimeField label="Start time" width="size-2400" />
                <TimeField label="With seconds" granularity="second" width="size-2400" />
                <TimeField label="Disabled" isDisabled width="size-2400" />
              </Flex>
            </div>

            <Divider size="S" />

            {/* DatePicker */}
            <div>
              <SubLabel>DatePicker — calendar popover</SubLabel>
              <Flex direction="column" gap="size-150">
                <DatePicker label="Event date" />
                <DatePicker label="With time" granularity="minute" />
                <DatePicker label="Disabled" isDisabled />
              </Flex>
            </div>

            <Divider size="S" />

            {/* DateRangePicker */}
            <div>
              <SubLabel>DateRangePicker — start &amp; end range</SubLabel>
              <Flex direction="column" gap="size-150">
                <DateRangePicker label="Training window" />
                <DateRangePicker label="Disabled range" isDisabled />
              </Flex>
            </div>

            <Divider size="S" />

            {/* Calendar */}
            <div>
              <SubLabel>Calendar — inline single-date picker</SubLabel>
              <Flex direction="row" gap="size-400" wrap alignItems="start">
                <Flex direction="column" gap="size-75" alignItems="center">
                  <Calendar aria-label="Select annotation date" />
                  <span
                    style={{
                      fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                      color: 'var(--spectrum-global-color-gray-600)',
                    }}
                  >
                    Default
                  </span>
                </Flex>
                <Flex direction="column" gap="size-75" alignItems="center">
                  <Calendar aria-label="Disabled calendar" isDisabled />
                  <span
                    style={{
                      fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                      color: 'var(--spectrum-global-color-gray-600)',
                    }}
                  >
                    Disabled
                  </span>
                </Flex>
              </Flex>
            </div>

            <Divider size="S" />

            {/* RangeCalendar */}
            <div>
              <SubLabel>RangeCalendar — inline date-range picker</SubLabel>
              <RangeCalendar aria-label="Select data export range" />
            </div>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
