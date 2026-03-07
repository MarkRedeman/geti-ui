# RangeCalendar — Peer Review

> **Location:** `packages/ui/src/components/Calendar/Calendar.tsx` (co-located with `Calendar`)
> **Stories:** `packages/ui/src/components/Calendar/RangeCalendar.stories.tsx`

---

## Summary

`RangeCalendar` is implemented correctly as a passthrough. All structural and type-safety concerns are shared with `Calendar` (see `Calendar.md`). This document highlights the issues unique to the range-selection context.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                          | Location          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| C1  | **`any` generic on `SpectrumRangeCalendarProps<any>`.** The `value` is typed as `RangeValue<any>` which loses type checking on `start` and `end`. Use `<T extends DateValue>` so that `value.start: T` and `value.end: T` are correctly typed. | `Calendar.tsx:20` |

---

## 2. Accessibility

| #   | Issue                                                                                                                                                                                | Location                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| A1  | **Range-spanning interactions not tested.** Multi-day selection where start and end span different weeks or months requires correct `aria-selected` propagation. This is not tested. | `Calendar.test.tsx:42-56` |
| A2  | **Test button selector `/17/` is ambiguous in multi-month view.** A grid showing two months could have two cells named "17".                                                         | `Calendar.test.tsx:51`    |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                    | Location                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| D1  | **Stories are identical to `Calendar.stories.tsx`** in structure — no story shows the key differentiating feature: a pre-populated `defaultValue` range. | `RangeCalendar.stories.tsx` |
| D2  | **No `WithConstraints` story** (`minValue`, `maxValue`, `isDateUnavailable`).                                                                            | `RangeCalendar.stories.tsx` |
| D3  | **No `Controlled` story** showing `value` and `onChange` state management for range selection.                                                           | `RangeCalendar.stories.tsx` |

---

## 4. Tests

### 🟡 Warnings

| #   | Issue                                                                                                       | Location               |
| --- | ----------------------------------------------------------------------------------------------------------- | ---------------------- |
| T1  | **`onChange` assertion is too weak** — only asserts called, not the `{ start, end }` range object returned. | `Calendar.test.tsx:55` |
| T2  | **No test for invalid range** (start after end, or outside `minValue`/`maxValue`).                          | `Calendar.test.tsx`    |

---

## Specific Fixes Required

1. **Replace `<any>` with `<T extends DateValue>`**.
2. **Add `DefaultValue` story** with a hard-coded pre-selected range.
3. **Add `WithConstraints` story** showing `minValue`, `maxValue`.
4. **Strengthen `onChange` assertion** to check `{ start, end }` payload.
5. **Add test for constrained range** — dates outside `minValue`/`maxValue` should not be selectable.
