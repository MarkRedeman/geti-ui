# DateRangePicker — Peer Review

> **Location:** `packages/ui/src/components/DateRangePicker/DateRangePicker.tsx`

---

## Summary

Nearly identical in structure to `DatePicker` — a minimal Spectrum passthrough with the same Safari width fix. All the issues from `DatePicker` apply here with equal severity. One additional concern: range selection introduces extra complexity (start/end validation, `minValue`/`maxValue`) that is entirely absent from tests and stories.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                        | Location                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| C1  | **`any` generic.** `SpectrumDateRangePickerProps<any>` loses type safety on `value.start`, `value.end`, `onChange`, `defaultValue`, `minValue`, and `maxValue`. Use `<T extends DateValue>`. | `DateRangePicker.tsx:6` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                   | Location                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| W1  | **Same prop-override bug as `DatePicker`.** `width="size-2400" {...props}` means a consumer-supplied `width` is silently dropped. Fix: `{...props} width={props.width ?? 'size-2400'}`. | `DateRangePicker.tsx:8` |

---

## 2. Accessibility

| #   | Issue                                                                                                                                                                                                                      | Location                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| A1  | **Range validation states untested.** When `start > end` or `value` is outside `minValue`/`maxValue`, Spectrum should show an invalid state. These scenarios are not covered by tests or stories.                          | `DateRangePicker.test.tsx` |
| A2  | **No `aria-label` guidance.** The component has two internal `DateField` segments (start and end) — consumers must supply a label to describe the full range picker, not just individual segments. This is not documented. | `DateRangePicker.tsx:4-5`  |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                       | Location                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| D1  | **No `WithMinMax` or `Invalid` story.** Key range picker constraints (`minValue`, `maxValue`) and validation states are not demonstrated in Storybook.                                      | `DateRangePicker.stories.tsx`    |
| D2  | **Story title says `'Event range and time'` for `WithTime`** — this is cosmetically inconsistent; the `WithTime` story for `DatePicker` says `'Event date and time'`. Minor but asymmetric. | `DateRangePicker.stories.tsx:28` |

---

## 4. Tests

### 🟡 Warnings

| #   | Issue                                                                                                                                                                               | Location                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| T1  | **Single smoke test only.** No coverage for: range start/end selection, `minValue`/`maxValue` constraint enforcement, keyboard navigation, or closing the calendar after selection. | `DateRangePicker.test.tsx` |

---

## Specific Fixes Required

1. **Fix prop-override order**: `{...props} width={props.width ?? 'size-2400'}`.
2. **Replace `<any>` with `<T extends DateValue>`**.
3. **Add `WithMinMax` story** demonstrating `minValue`/`maxValue` and `isInvalid` state.
4. **Add range-selection test**: click start date, click end date, assert `onChange` receives correct range object.
5. **Add `isInvalid` story** (replace deprecated `validationState`).
