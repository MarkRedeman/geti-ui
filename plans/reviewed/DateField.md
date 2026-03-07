# DateField — Peer Review

> **Location:** `packages/ui/src/components/DateField/DateField.tsx`
> **Note:** `TimeField` is co-located in this file and shares the same review.

---

## Summary

A thin Spectrum passthrough for `DateField` and `TimeField`. Both components are exported from the same file, which is a reasonable organisational choice for tightly coupled primitives. Overall quality is good but there are several correctness, type-safety, and structural issues to address.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                              | Location              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| C1  | **`any` generic on Spectrum props.** `SpectrumDateFieldProps<any>` and `SpectrumTimeFieldProps<any>` bypass the generic date-value type parameter entirely. The correct signature is `<T extends DateValue>` — using `any` defeats TypeScript's ability to infer or enforce the date type flowing through `onChange`, `value`, and `defaultValue`. | `DateField.tsx:15,25` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Location                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| W1  | **`TimeField` is not in its own file/directory.** The `TimeField` component lives inside `DateField.tsx` but is expected at `components/TimeField/` — the directory exists but contains only `TimeField.stories.tsx` with no corresponding implementation file. This creates an invisible coupling: a consumer looking for `TimeField` in its own folder will find only the stories file. Either move `TimeField` to its own file or add a clear barrel `index.ts` re-export in the `TimeField/` directory. | `TimeField/` directory      |
| W2  | **Props types are re-exported under aliased names** (`DateFieldProps`, `TimeFieldProps`) but the JSDoc comment above each component does not mention date/time input format, supported locales, or timezone behaviour — all highly relevant to consumers.                                                                                                                                                                                                                                                   | `DateField.tsx:11-13,22-24` |
| W3  | **Comment on line 8–9** references `@react-types/datepicker` as if it were a concern — but the comment is misleading since the workaround chosen (`<any>`) is a type-safety regression, not a safe fix.                                                                                                                                                                                                                                                                                                     | `DateField.tsx:8-9`         |

---

## 2. Accessibility

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                | Location                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| A1  | **No `aria-label` fallback enforcement.** Both components delegate entirely to Spectrum, which itself requires either `label` or `aria-label`. However, neither the component signature nor its JSDoc reminds consumers that one of the two is mandatory for a11y. A runtime PropTypes warning or JSDoc `@required` note would help. | `DateField.tsx:15,25`          |
| A2  | **`TimeField` stories file is in the `TimeField/` directory but has no tests**, meaning keyboard navigation and screen-reader behaviour of `TimeField` is never exercised. The test file in `DateField/` only tests `TimeField` renders — no keyboard segment interaction tests exist.                                               | `DateField/DateField.test.tsx` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                               | Location                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| D1  | **`TimeField` has no dedicated stories file under `DateField/`.** `DateField.stories.tsx` covers only `DateField`. `TimeField.stories.tsx` exists in `TimeField/` directory but is isolated from its implementation. Stories for `TimeField` (disabled, with seconds granularity, with `aria-label`) should exist alongside or within the `DateField` stories file. | `TimeField/TimeField.stories.tsx` |
| D2  | **No `ReadOnly` or `Required` story** for either component. The `argTypes` expose `isReadOnly` and `isRequired` as controls but no story pins those states for snapshot testing or visual documentation.                                                                                                                                                            | `DateField.stories.tsx`           |
| D3  | **`validationState` is deprecated** in Spectrum v3 in favour of the `isInvalid` prop. The stories still use `validationState`.                                                                                                                                                                                                                                      | `DateField.stories.tsx:14-17`     |

---

## 4. Tests

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                   | Location                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| T1  | **Only smoke-test level coverage.** Each component has a single "renders correctly" test with a role assertion. There are no tests for: value changes (`onChange`), keyboard segment navigation (arrow keys), invalid state rendering, or the `isDisabled`/`isReadOnly` interaction-blocking behaviour. | `DateField.test.tsx`                 |
| T2  | **No test for `TimeField` in its own directory.** `TimeField` tests live in `DateField/DateField.test.tsx` which is non-obvious for future maintainers.                                                                                                                                                 | `DateField/DateField.test.tsx:18-26` |

---

## Specific Fixes Required

1. **Replace `<any>` generic** with `<T extends DateValue>` on both `DateField` and `TimeField`, importing `DateValue` from `@internationalized/date`:
    ```tsx
    import { DateValue } from '@internationalized/date';
    export const DateField = <T extends DateValue>(props: SpectrumDateFieldProps<T>) => ...
    ```
2. **Move `TimeField` to its own file** (`TimeField/TimeField.tsx`) with a re-export barrel, and consolidate the orphaned `TimeField.stories.tsx`.
3. **Replace `validationState`** with `isInvalid` in the `Invalid` story.
4. **Add keyboard interaction tests**: arrow key navigation between segments, value change callback assertions.
5. **Add missing stories**: `ReadOnly`, `Required`, and a `TimeField` story file with all variants.
