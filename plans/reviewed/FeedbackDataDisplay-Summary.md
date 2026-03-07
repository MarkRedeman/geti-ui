# Group 5 & 6 Peer Review Summary

**Groups:** 5 (Feedback & Status) + 6 (Data Display)  
**Components reviewed:** 18 (+ AvatarGroup as part of Avatar)  
**Reviewer:** Oracle  
**Date:** 2026-03-06

---

## Executive Summary

All 18 components are structurally sound and follow the Geti wrapper conventions. No components have broken APIs or missing exports at the consumer level. However, there are **two critical bugs**, **several systemic accessibility issues**, and **pervasive test shallowness** that spans both groups.

---

## 🔴 Critical Issues (must fix before ship)

| #   | Component    | Issue                                                                                                                                                                                                |
| --- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Skeleton** | `@keyframes geti-skeleton-shine` is referenced in inline styles but **never defined anywhere** in the codebase. The shimmer animation is silently broken in production.                              |
| 2   | **Skeleton** | `role="img"` is semantically wrong for a loading placeholder. WCAG requires `role="status"` (with `aria-live="polite"`) for loading indicators. Tests will also break once corrected.                |
| 3   | **Badge**    | Icon-only badges (`children = <Icon />` with no text) have zero test coverage for `aria-label` requirement — the only way for screen readers to understand them.                                     |
| 4   | **Tag**      | `aria-label={text}` on a `<div>` with visible child `<span>{text}</span>` is redundant and violates WCAG 4.1.2 (creates duplicate/misleading announcements). Remove `aria-label` from the container. |

---

## 🟠 High-Priority Issues

### Test Coverage Gaps (Interactive Components)

The most pervasive issue across Group 6 is that interactive data display components have no interaction tests:

| Component     | Missing Tests                                                               |
| ------------- | --------------------------------------------------------------------------- |
| **TableView** | Row selection, column sort, keyboard navigation                             |
| **ListView**  | Item selection on click, arrow key navigation                               |
| **ListBox**   | Option selection, `aria-selected` assertion                                 |
| **TagGroup**  | `onRemove` callback — **the component's primary feature**                   |
| **Toast**     | `toast.negative`, `toast.info`, `toast.neutral` — only `positive` is tested |

### Inline Styles in Custom Components

Three Geti-custom components (`Loading`, `Skeleton`, `Tag`, `AvatarGroup`) use inline `CSSProperties` instead of CSS modules. This:

- Blocks pseudo-class styles (`:hover`, `:focus-visible`)
- Cannot respond to `prefers-reduced-motion`
- Cannot be overridden by consumers without `!important`

**Affected:** `Loading`, `Skeleton`, `Tag`, `AvatarGroup`

### Duplicate Tests

A recurring pattern across Group 5: `'renders without crash'` and `'renders with role=X'` are identical test cases. At minimum 4 files affected.

**Affected:** `ProgressBar`, `ProgressCircle`, `Meter`, `IllustratedMessage`

---

## 🟡 Medium-Priority Issues (systemic)

### Missing `Heading` / `Content` exports from `@geti/ui`

`InlineAlert` and `IllustratedMessage` require Spectrum's `Heading` and `Content` companion components as children, but these aren't exported from `@geti/ui`. Consumers must `import { Heading, Content } from '@adobe/react-spectrum'`, leaking the upstream dependency.

**Fix (one-time):** Add to `packages/ui/src/index.ts`:

```ts
export { Heading, Content } from '@adobe/react-spectrum';
```

### Missing `ToastAPI` type export

`Toast.tsx` defines `ToastAPI` but it isn't exported from `index.ts`. Consumers cannot type their own toast wrappers.

### `TableView` sub-component prop types not exported from `index.ts`

`SpectrumColumnProps`, `TableHeaderProps`, `TableBodyProps`, `RowProps`, `CellProps` are exported from `TableView.tsx` but not re-exported from `index.ts`.

### Story quality issues

| Component              | Issue                                                                         |
| ---------------------- | ----------------------------------------------------------------------------- |
| **TagGroup**           | `Removable` story uses `console.log` — doesn't demonstrate actual tag removal |
| **IllustratedMessage** | Both stories use `Alert` icon (wrong semantic intent for empty states)        |
| **Loading**            | Missing `Fullscreen` mode story (the _default_ mode has no story)             |
| **Image**              | All stories use external `picsum.photos` URLs (breaks offline/CI)             |

### AvatarGroup structural issues

- `key={avatarProps.alt ?? index}` — `index` as key fallback causes incorrect reconciliation on reorder
- Overflow badge `aria-label` on non-interactive `<span>` is ignored by most AT
- Overflow badge size is hardcoded and doesn't scale with `size` prop
- `Math.max(0, ...)` not used — negative overflow is possible if `max > avatars.length`

---

## Component Ratings

| Component          | Rating             | Primary Concern                                  |
| ------------------ | ------------------ | ------------------------------------------------ |
| ProgressBar        | 🟢 Good            | Duplicate test                                   |
| ProgressCircle     | 🟢 Good            | Duplicate test, missing value assertions         |
| Loading            | 🟡 Acceptable      | Inline styles, missing fullscreen story          |
| Meter              | 🟢 Good            | Duplicate test                                   |
| StatusLight        | 🟡 Acceptable      | No ARIA role assertions, no `isDisabled` test    |
| InlineAlert        | 🟢 Good            | `Heading`/`Content` not exported                 |
| **Toast**          | 🟡 Acceptable      | 3 of 4 toast variants untested                   |
| Badge              | 🟡 Acceptable      | Icon-only a11y untested (critical use case)      |
| **Skeleton**       | 🔴 Needs Work      | Broken animation + wrong ARIA role               |
| TableView          | 🟡 Acceptable      | No selection/sort tests, sub-types not in index  |
| ListView           | 🟡 Acceptable      | No interaction tests                             |
| ListBox            | 🟡 Acceptable      | No interaction tests                             |
| **TagGroup**       | 🟠 Needs Attention | `onRemove` completely untested                   |
| **Tag**            | 🟠 Needs Attention | Wrong ARIA, inline styles, inaccessible tooltip  |
| IllustratedMessage | 🟡 Acceptable      | Story icons wrong, thin tests                    |
| Avatar             | 🟡 Acceptable      | `isDisabled` untested                            |
| AvatarGroup        | 🟡 Acceptable      | Overflow badge a11y, inline styles, key fallback |
| Image              | 🟢 Good            | Hollow `src` assertion, external URLs            |

---

## Recommended Fix Priority

### Sprint 1 — Critical bugs

1. **Skeleton**: Add `@keyframes` CSS (via module), fix `role="status"`, update tests
2. **Tag**: Remove redundant `aria-label`, extend props from `HTMLAttributes<HTMLDivElement>`

### Sprint 2 — Interaction test coverage

3. **TagGroup**: Add `onRemove` tests, fix Removable story to use state
4. **Toast**: Add `negative`, `info`, `neutral` variant tests
5. **TableView**: Add row selection test
6. **ListView** / **ListBox**: Add click selection tests

### Sprint 3 — Systemic fixes

7. Export `Heading`, `Content` from `index.ts`
8. Export `ToastAPI` type from `index.ts`
9. Export `TableView` sub-component prop types from `index.ts`
10. Migrate `Loading`, `AvatarGroup` to CSS modules

### Sprint 4 — Polish

11. Fix duplicate tests in ProgressBar, ProgressCircle, Meter
12. Fix AvatarGroup key fallback, overflow badge role, size scaling
13. Fix IllustratedMessage story icons
14. Replace external URLs in Image/Avatar stories with stable fixtures
15. Add `isDisabled` tests to Avatar, StatusLight
16. Add missing `Fullscreen` story to Loading

---

## Cross-Cutting Observations

1. **The "empty interface extension" pattern** (`interface XProps extends SpectrumXProps {}`) is used consistently across all Spectrum wrappers. This is intentional and signals extensibility intent. A team decision on whether to prefer `type XProps = SpectrumXProps` for pure passthroughs would clean this up uniformly.

2. **Tests are systematically too shallow** — the pattern of "assert element is in the document" without any ARIA attribute or interaction assertion repeats across nearly every component. A team-wide guideline for minimum test assertions (e.g., at least one ARIA attribute and one interaction per interactive component) would improve quality.

3. **External URLs in stories** (`picsum.photos`, `pravatar.cc`) will fail in offline/CI environments. A shared set of local placeholder images or data URIs should be established.
