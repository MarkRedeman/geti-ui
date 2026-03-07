# DatePicker — Peer Review

> **Location:** `packages/ui/src/components/DatePicker/DatePicker.tsx`

---

## Summary

A minimal Spectrum passthrough that adds a hard-coded `width="size-2400"` for a Safari mobile layout fix. The workaround is commented but has the important implication that consumers cannot reduce the width below this value. Type-safety and test coverage are the main concerns.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                        | Location           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| C1  | **`any` generic.** `SpectrumDatePickerProps<any>` bypasses the `DateValue` generic. This means `onChange` and `value` receive `any` type, eliminating type checking for date ranges and values. Use `<T extends DateValue>`. | `DatePicker.tsx:6` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                         | Location             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| W1  | **Hard-coded `width="size-2400"` is not overridable.** Because the prop spread comes _after_ the fixed width (`width="size-2400" {...props}`), a consumer passing `width="size-3400"` would be silently ignored — the fixed value wins since it appears first. The spread should come first: `{...props} width={props.width ?? "size-2400"}`. | `DatePicker.tsx:8`   |
| W2  | **No `minWidth` guard.** The comment explains the Safari fix but a minimum width constraint via `minWidth` would be safer than an absolute `width` which also constrains the maximum.                                                                                                                                                         | `DatePicker.tsx:7-8` |

---

## 2. Accessibility

| #   | Issue                                                                                                                                                                                       | Location              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| A1  | **No label enforcement.** `DatePicker` requires either `label` or `aria-label` for a11y compliance, but this is not documented or enforced.                                                 | `DatePicker.tsx:6`    |
| A2  | **Calendar popover keyboard interaction not tested.** The test only verifies the field group renders — it does not open the calendar with Space/Enter, navigate days, or close with Escape. | `DatePicker.test.tsx` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                     | Location                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| D1  | **Safari width fix not documented in JSDoc.** The inline comment explains the fix but the exported `DatePickerProps` type consumers see has no mention of the width constraint. A `@remarks` tag in the JSDoc would help. | `DatePicker.tsx:4-5`     |
| D2  | **No `Invalid` or `Required` story.** The `argTypes` expose `errorMessage` and `isRequired` but no story pins these states.                                                                                               | `DatePicker.stories.tsx` |
| D3  | **`validationState` should be replaced with `isInvalid`** in all stories — `validationState` is deprecated in Spectrum v3.                                                                                                | `DatePicker.stories.tsx` |

---

## 4. Tests

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                            | Location              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| T1  | **Single smoke test only.** No coverage for: calendar opening, date selection via calendar click, date segment keyboard entry, disabled state blocking interaction, or validation state display. | `DatePicker.test.tsx` |
| T2  | **Width regression not tested.** Given the Safari fix, a test asserting the minimum rendered width prevents regression if the default is later removed.                                          | `DatePicker.test.tsx` |

---

## Specific Fixes Required

1. **Fix prop override order**: Change `width="size-2400" {...props}` to `{...props} width={props.width ?? 'size-2400'}` so consumers can override the width.
2. **Replace `<any>` generic** with `<T extends DateValue>`.
3. **Add JSDoc `@remarks`** documenting the Safari mobile width constraint.
4. **Add `Invalid` and `Required` stories.**
5. **Add test**: calendar trigger opens calendar, date can be selected, Escape closes.
