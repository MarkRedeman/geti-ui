# Calendar — Peer Review

> **Location:** `packages/ui/src/components/Calendar/Calendar.tsx`
> **Note:** `RangeCalendar` is co-located. Both stories files are reviewed here.

---

## Summary

Both `Calendar` and `RangeCalendar` are clean, minimal Spectrum passthroughs. The `Calendar.test.tsx` is the strongest test file in the date/time group — it includes real interaction tests. The main issues are the recurring `<any>` generic, the absence of a dedicated `RangeCalendar` test, and missing validation/constrained stories.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                 | Location             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| C1  | **`any` generic.** Both `SpectrumCalendarProps<any>` and `SpectrumRangeCalendarProps<any>` lose type safety on `value`, `defaultValue`, `minValue`, `maxValue`, and `onChange`. Use `<T extends DateValue>` for both. | `Calendar.tsx:11,20` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                | Location       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| W1  | **`RangeCalendar` is not in its own file.** It lives in `Calendar.tsx` but could logically be its own file (like `DateField`/`TimeField`) for discoverability. As long as the barrel exports are correct (they are), this is minor but worth noting for consistency. | `Calendar.tsx` |

---

## 2. Accessibility

### ✅ Positive

- Both components correctly use `aria-label` in stories (not `label`, since Calendar is not a form field).
- The interaction test on line 26–28 correctly targets day buttons by accessible name (`/15/`).

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                    | Location                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| A1  | **Date selector button pattern `/15/` is fragile.** The test finds a button with name matching `/15/`. On the day of the 15th of any month this passes, but Spectrum's Calendar gives each day button a fully qualified accessible name (e.g. `"Thursday, March 15, 2026"`). The regex `/15/` could match multiple dates in a multi-month view. Use a more specific assertion or `getAllByRole` with `visibleMonths: 1`. | `Calendar.test.tsx:26,50-51` |
| A2  | **Keyboard navigation not tested.** Arrow key navigation between days, Page Up/Down for month change, and Home/End for week boundaries are not covered.                                                                                                                                                                                                                                                                  | `Calendar.test.tsx`          |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                            | Location                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| D1  | **No `WithMinMax` story.** The most important behavioural difference between Calendar and a simple date field is the ability to restrict selectable dates via `minValue`/`maxValue`. No story demonstrates this. | `Calendar.stories.tsx`      |
| D2  | **`RangeCalendar` stories mirror `Calendar` exactly** — no story shows a pre-selected range via `defaultValue`, which is the primary differentiator of `RangeCalendar`.                                          | `RangeCalendar.stories.tsx` |
| D3  | **No `onChange` story.** Neither stories file shows `onChange` wired up for interactive demonstration. A `Controlled` story with `useState` would be valuable.                                                   | Both stories files          |

---

## 4. Tests

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                      | Location                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| T1  | **`rstest.fn()` used in `Calendar.test.tsx`** (`import { rstest }` on line 3). This is not the idiomatic way to create mocks in rstest — `vi.fn()` from `vitest` is the standard import, and rstest typically re-exports `vi`. Verify that `rstest.fn()` is the correct API for this project. If not, change to `vi.fn()`. | `Calendar.test.tsx:3,19,43` |
| T2  | **No `RangeCalendar` test file.** `RangeCalendar` tests live inside `Calendar.test.tsx` which is acceptable, but there is no coverage for: min/max date constraints, pre-selected range rendering, or range spanning month boundaries.                                                                                     | `Calendar.test.tsx:32-56`   |
| T3  | **`onChange` assertion is too weak.** The test asserts `expect(onChange).toHaveBeenCalled()` without checking the value passed. For a date component this is important — at minimum assert `expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ day: 15 }))`.                                                  | `Calendar.test.tsx:28,55`   |

---

## Specific Fixes Required

1. **Replace `<any>` with `<T extends DateValue>`** on both `Calendar` and `RangeCalendar`.
2. **Strengthen interaction test button selectors** — use a specific date string or `visibleMonths: 1` constraint.
3. **Assert `onChange` value payload**, not just that it was called.
4. **Add `WithMinMax` story** for both `Calendar` and `RangeCalendar`.
5. **Add `DefaultValue` story** for `RangeCalendar` showing a pre-selected range.
6. **Verify `rstest.fn()` vs `vi.fn()`** — confirm mock API is correct for this test runner.
