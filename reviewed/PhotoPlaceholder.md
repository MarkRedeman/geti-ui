# PhotoPlaceholder — Peer Review

> **Location:** `packages/ui/src/components/PhotoPlaceholder/PhotoPlaceholder.tsx`

---

## Summary

`PhotoPlaceholder` is a well-thought-out component for avatar initials with deterministic colour selection. The implementation is clean, the `utils.ts` functions are well-documented, and the tests cover the key logic paths. The main gaps are accessibility (no `role` or `aria-label`), a typing inconsistency in `ViewProps`, and the missing `alt` text pattern.

---

## 1. Code Quality & Type Safety

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                        | Location                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| W1  | **`ViewProps<5>` type parameter.** `ViewProps<5>` is used for `width` and `height` — the numeric type parameter is not the correct usage of `ViewProps`. The scale-level parameter is not documented to accept `5` and may produce unexpected type narrowing. Use `DimensionValue` directly from `@react-types/shared` instead.              | `PhotoPlaceholder.tsx:13-15` |
| W2  | **`borderRadius` accepts a plain `string`.** This bypasses Spectrum's design token system. Using `UNSAFE_style` for the border radius is acceptable (as done here), but the prop type should note that Spectrum tokens (e.g. `'size-100'`) are not supported here — only raw CSS values.                                                     | `PhotoPlaceholder.tsx:17`    |
| W3  | **`getForegroundColor` receives hardcoded CSS variable strings** (`'var(--spectrum-global-color-gray-50)'`). If the consumer overrides theme variables or renders outside a Spectrum provider, the contrast function cannot compute the correct colour because CSS variables are not resolved in JS. Consider using hardcoded hex fallbacks. | `PhotoPlaceholder.tsx:36-38` |
| W4  | **`name.trim().length === 0` fallback uses `indicator`**, but `indicator` could be an email address, UUID, or other non-display string. The fallback letter could be `@` or `-`. Consider a more robust fallback (e.g. `?`).                                                                                                                 | `PhotoPlaceholder.tsx:32`    |

---

## 2. Accessibility

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                               | Location |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| A1  | **No accessible label.** The component renders a `View` with a text letter. There is no `role`, `aria-label`, or `title` indicating who this avatar represents. Screen reader users will hear the letter alone ("J") without context ("Avatar for John Doe"). Add `aria-label={name |          | indicator}`to the outer`View`. ✅ **Fixed:** an inner `div`now has`role="img"`and`aria-label={name \|\| indicator}`. | `PhotoPlaceholder.tsx:41-53` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                         | Location                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| A2  | **`Text` containing the initials letter has no semantic role.** It is rendered as a generic text node. This is acceptable (the `View` should carry the accessible label), but it should be `aria-hidden` to avoid screen readers announcing both the `aria-label` and the text content. ✅ **Fixed:** `<Text aria-hidden="true">` is now set. | `PhotoPlaceholder.tsx:50` |

---

## 3. Documentation

### ✅ Positive

- JSDoc on `utils.ts` functions is clear and includes a source reference.
- Prop descriptions are complete and accurate.

### 🟡 Warnings

| #   | Issue                                                                                                                         | Location                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| D1  | **No story showing `name=""` fallback behaviour.** The `indicator` fallback path is tested but not demonstrated in Storybook. | `PhotoPlaceholder.stories.tsx` |
| D2  | **`getForegroundColor` CSS variable caveat** is not documented in the JSDoc for `PhotoPlaceholder`.                           | `PhotoPlaceholder.tsx:21-22`   |

---

## 4. Tests

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                               | Location                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| T1  | **Tests verify rendered letter but not aria-label.** Given the accessibility gap (A1), the tests should also assert `getByRole('img', { name: 'John Doe' })` once the fix is applied.                                               | `PhotoPlaceholder.test.tsx` |
| T2  | **No test for `hexaToRGBA` edge cases.** `utils.ts` handles 5-character hex (3-char shorthand + alpha), 7-character, and 9-character inputs. Tests for `hexaToRGBA('')`, invalid hex lengths, and the `NaN` alpha path are missing. | `PhotoPlaceholder/utils.ts` |

---

## Specific Fixes Required

1. **Add `aria-label={name || indicator}` and `role="img"`** to the outer `View` to make the avatar accessible. ✅ **Fixed:** inner `div` with `role="img"` and `aria-label={name || indicator}` added.
2. **Add `aria-hidden="true"` to the inner `Text`** to prevent duplicate announcements. ✅ **Fixed:** `<Text aria-hidden="true">` implemented.
3. **Replace `ViewProps<5>`** with `DimensionValue` for `width` and `height` prop types. ⏳ _Still open — `ViewProps<5>` unchanged._
4. **Add a `FallbackIndicator` story** demonstrating the `name=""` fallback path. ⏳ _Not verified._
5. **Add unit tests for `hexaToRGBA`** covering empty string, 4-char, 7-char, and 9-char inputs. ⏳ _Still open._
6. **Document the CSS variable limitation** in `getForegroundColor`'s JSDoc. ⏳ _Still open._
