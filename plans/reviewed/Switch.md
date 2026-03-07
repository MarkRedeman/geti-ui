# Review: Switch

**File:** `packages/ui/src/components/Switch/Switch.tsx`
**Reviewed:** 2026-03-06

---

## Summary

Switch is the second custom-logic component in this group (after PasswordField), applying Geti energy-blue tokens when `isEmphasized` is true. The implementation is reasonable but uses `UNSAFE_style` to pass CSS custom properties — a pattern explicitly discouraged by AGENTS.md. Tests cover the key states but miss the token-application assertion.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity      | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🔴 Convention | **Uses `UNSAFE_style`** to inject CSS custom properties. AGENTS.md explicitly says _"Use `UNSAFE_className` for CSS overrides (not `UNSAFE_style`)"_. The intent is correct (override Spectrum tokens) but the mechanism violates the repo convention. The fix is a CSS module with a `.emphasized` class that sets these custom properties, applied via `UNSAFE_className`. ✅ **Fixed:** `UNSAFE_style` replaced with `UNSAFE_className` + `Switch.module.css` using `[data-emphasized='true']` selector, applied via `clsx`. |
| 1.2 | 🟡 Low        | `UNSAFE_style` is both extracted from incoming props and merged back in. If a consumer also passes `UNSAFE_style`, their values will be shadowed by the energyBlue tokens when `isEmphasized` is true (merge order: `{ ...UNSAFE_style, ...emphasizedStyles }` — consumer styles win, but the intent isn't documented). ✅ **Fixed by resolution of 1.1** — `UNSAFE_style` is no longer used for emphasized styles; consumers can freely pass `UNSAFE_style` through.                                                           |
| 1.3 | 🟡 Low        | `emphasizedStyles` is typed as `CSSProperties` but the custom properties (`--spectrum-switch-*`) are not standard CSS properties — the double cast `as CSSProperties` is needed but a comment should explain why. ✅ **Fixed by resolution of 1.1** — custom properties are now in the CSS module; no cast needed.                                                                                                                                                                                                              |
| 1.4 | 🟢 Good       | The token names (`--spectrum-switch-emphasized-*`) correctly target the Spectrum component-level tokens.                                                                                                                                                                                                                                                                                                                                                                                                                        |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                                                                           |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good  | Spectrum renders `role="switch"` with `aria-checked`.                                                                                                                                                                                                                             |
| 2.2 | 🟡 Low   | No test verifying the visual emphasis (energy-blue) is applied — colour change has no a11y impact, but the absence of any style assertion means the `isEmphasized` path is essentially un-tested beyond "renders without crash". ⏳ _Still open — no style assertion test added._ |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                                                                                                        |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1 | 🟡 Low   | No `EmphasizedSelected` story — showing the energy-blue colour in the on state is the main visual selling point. `Emphasized` story only shows the off state. ⏳ _Still open._ |
| 3.2 | 🟡 Low   | No story for `isReadOnly`. ⏳ _Still open._                                                                                                                                    |
| 3.3 | 🟢 Good  | `Emphasized` story documents the Geti-specific prop.                                                                                                                           |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🟡 Low     | `accepts isEmphasized prop without error` — tests render but not the style outcome. The style can't be asserted via ARIA, but `UNSAFE_style` inline styles are queryable via `element.style.getPropertyValue('--spectrum-switch-emphasized-track-color-selected')`. ⏳ _Still open — no CSS custom property assertion added (fix via `UNSAFE_className` makes this harder to query directly, but CSS module application can be checked via class name)._ |
| 4.2 | 🔴 Missing | No test for `isReadOnly` state (switch should not be toggleable). ⏳ _Still open._                                                                                                                                                                                                                                                                                                                                                                       |
| 4.3 | 🟢 Good    | `onChange` fired on click, not fired when disabled — both correct.                                                                                                                                                                                                                                                                                                                                                                                       |

---

## Fixes Needed

1. **Replace `UNSAFE_style` with `UNSAFE_className`** and a CSS module `.emphasized` class that sets the `--spectrum-switch-emphasized-*` tokens. _(High — AGENTS.md convention)_ ✅ **Fixed.**
2. **Add `EmphasizedSelected` story** showing the energy-blue colour in the on state. _(Low — docs)_ ⏳ _Still open._
3. **Add `isReadOnly` story and test.** _(Low)_ ⏳ _Still open._
4. **Assert style application in `isEmphasized` test** (e.g. check the custom property value). _(Low)_ ⏳ _Still open._
