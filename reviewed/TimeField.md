# TimeField — Peer Review

> **Location:** `packages/ui/src/components/DateField/DateField.tsx` (co-located)
> **Stories:** `packages/ui/src/components/TimeField/TimeField.stories.tsx`

---

## Summary

`TimeField` is implemented inside `DateField.tsx` but has its stories in a separate `TimeField/` directory with no implementation file. This structural disconnect is the primary concern. The component itself is a minimal passthrough and shares all the same `<any>`-generic type-safety issues as `DateField`.

---

## 1. Code Quality & Type Safety

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                                               | Location           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| C1  | **`any` generic.** `SpectrumTimeFieldProps<any>` bypasses the `TimeValue` generic parameter. The correct form is `<T extends TimeValue>`.                                                                                                                                                                                                                           | `DateField.tsx:25` |
| C2  | **Implementation/stories split across directories.** `TimeField` is implemented in `DateField/DateField.tsx` but has stories in `TimeField/TimeField.stories.tsx`. There is no `TimeField.tsx` in the `TimeField/` directory. Any consumer or IDE navigating to the `TimeField/` folder will find only a stories file and no implementation — a maintenance hazard. | Structural         |

### 🟡 Warnings

| #   | Issue                                                                                            | Location               |
| --- | ------------------------------------------------------------------------------------------------ | ---------------------- |
| W1  | **No barrel `index.ts`** in the `TimeField/` directory to re-export from the canonical location. | `TimeField/` directory |

---

## 2. Accessibility

| #   | Issue                                                                                                                                                                                                                                                  | Location |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| A1  | **No test coverage.** Unlike `DateField`, `TimeField` has no tests at all (the test file is in `DateField/` not `TimeField/`). There is therefore zero test coverage for `TimeField`'s accessibility semantics (label, group role, keyboard segments). | —        |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                           | Location                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| D1  | **Stories file references Storybook title `'Date and Time/TimeField'`** but `TimeField` is not exported from its own file. The file imports from `'./DateField'` — this will work but is fragile and confusing. | `TimeField/TimeField.stories.tsx:2` |
| D2  | **No `WithSeconds` story.** The most common customisation of `TimeField` (showing seconds via `granularity="second"`) is not demonstrated.                                                                      | `TimeField.stories.tsx`             |

---

## 4. Tests

### 🔴 Critical

| #   | Issue                                                                                                                                       | Location                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| T1  | **No dedicated test file.** `TimeField` is tested only as a side-effect inside `DateField.test.tsx`. There is no test file in `TimeField/`. | `TimeField/` directory               |
| T2  | **Single smoke test only.** The one render test doesn't cover value changes, `isDisabled`, keyboard segment stepping, or ARIA semantics.    | `DateField/DateField.test.tsx:18-26` |

---

## Specific Fixes Required

1. **Create `TimeField/TimeField.tsx`** (or a barrel `index.ts`) that re-exports from `DateField/DateField.tsx` to resolve the structural disconnect.
2. **Replace `<any>` with `<T extends TimeValue>`**, importing `TimeValue` from `@internationalized/date`.
3. **Add `TimeField/TimeField.test.tsx`** with at minimum: render test, `isDisabled` test, and `onChange` callback test.
4. **Add stories**: `WithSeconds` (`granularity="second"`), `Disabled`, `ReadOnly`.
