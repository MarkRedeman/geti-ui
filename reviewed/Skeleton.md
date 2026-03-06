# Skeleton — Peer Review

**File:** `packages/ui/src/components/Skeleton/Skeleton.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

`Skeleton` is a fully custom Geti component (no Spectrum base). Implementation is well-structured with clear props and good JSDoc. However, there are two significant issues: (1) the `@keyframes geti-skeleton-shine` animation is referenced in inline styles but **never defined anywhere in the codebase** — the shimmer animation will be silently broken in production; (2) the use of `role="img"` for a loading placeholder is semantically incorrect — `role="status"` is the WCAG-recommended pattern.

---

## 1. Code Quality & Type Safety

| #   | Severity        | Finding                                                                                                                                                                                                                                                                                                                                                 |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 **Critical** | **Missing `@keyframes geti-skeleton-shine` definition.** The `animation` property references `geti-skeleton-shine 2s ease infinite` but there is no `@keyframes` block anywhere in the CSS files (`src/theme/*.css` or any module). The skeleton will render as a static gradient with no shimmer. This needs a CSS module or a global style injection. |
| 2   | 🟠 Medium       | **Inline `CSSProperties` for the shimmer gradient** — same concern as `Loading`. Should use a CSS module for maintainability and to enable `prefers-reduced-motion` media query support. The current implementation cannot respect `prefers-reduced-motion` without a CSS rule.                                                                         |
| 3   | 🟡 Low          | `shimmerStyle` is declared at module level with `backgroundSize: '200% 100%'` — this works, but combining it with the spread (`{ ...shimmerStyle, ...style }`) means callers can accidentally override `backgroundSize` and break the animation. No defensive note exists.                                                                              |
| 4   | ✅ —            | Width/height normalization (`typeof width === 'number' ? \`${width}px\` : width`) is correct and well-handled.                                                                                                                                                                                                                                          |
| 5   | ✅ —            | Good use of `isCircle` and `isAspectRatioOne` flags for shape control.                                                                                                                                                                                                                                                                                  |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                                       |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 High  | **`role="img"` is wrong for a loading skeleton.** WCAG guidance and common practice recommend `role="status"` (with `aria-live="polite"`) or `role="progressbar"` for loading placeholders. `role="img"` announces the element as an image, which is misleading. The correct pattern is: `role="status"` + `aria-label` + `aria-busy="true"`. |
| 2   | 🟡 Low   | The fallback `aria-label="Loading…"` hardcodes the label. This is acceptable but the ellipsis character (`…` U+2026) is different from three dots (`...`) used in `Loading.tsx`. Consistent usage should be enforced.                                                                                                                         |
| 3   | 🟡 Low   | `aria-busy="true"` is always set — even when the skeleton is used decoratively. Consider making it a prop or removing it, since `aria-busy` is most meaningful on a container element that is actually updating.                                                                                                                              |

---

## 3. Documentation

| #   | Severity  | Finding                                                                                                                                                                                             |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —      | JSDoc for props is thorough, with `@example` blocks for rectangle, circle, and aspect-ratio cases.                                                                                                  |
| 2   | ✅ —      | Stories cover Rectangle, Circle, Square, TextBlock, and Card layouts — excellent variety.                                                                                                           |
| 3   | 🔴 Medium | **No story or JSDoc note about the broken animation.** Developers using Storybook will see a static gray block and assume the component works. The missing keyframes must be fixed before shipping. |
| 4   | 🟡 Low    | No story demonstrates `prefers-reduced-motion` behavior (or lack thereof).                                                                                                                          |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                   |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —      | Tests cover: render, circle variant, rectangle, custom `aria-label`, and `aria-busy`.                                     |
| 2   | 🔴 Medium | **Tests use `role="img"`** — if the role is corrected to `role="status"`, all tests will break. Fix role, then fix tests. |
| 3   | 🟡 Low    | No test for `isAspectRatioOne` prop (it produces `aspectRatio: '1'` in style — should be asserted).                       |
| 4   | 🟡 Low    | No test verifies that `width` and `height` numbers are converted to pixel strings correctly.                              |
| 5   | 🟡 Low    | No test for `className` prop being applied to the element.                                                                |

---

## Specific Fixes Required

### 1. Fix missing keyframes — create `Skeleton.module.css`

```css
/* Skeleton.module.css */
.skeleton {
    background: linear-gradient(
        to right,
        rgba(88, 90, 98, 0.15) 0%,
        rgba(88, 90, 98, 0.35) 50%,
        rgba(88, 90, 98, 0.15) 75%
    );
    background-size: 200% 100%;
    animation: shine 2s ease infinite;
    display: block;
}

@keyframes shine {
    0% {
        background-position: 200% center;
    }
    100% {
        background-position: -200% center;
    }
}

@media (prefers-reduced-motion: reduce) {
    .skeleton {
        animation: none;
    }
}
```

### 2. Fix ARIA role

```tsx
// Before:
<span role="img" aria-label={ariaLabel ?? 'Loading…'} aria-busy="true" ... />

// After:
<span role="status" aria-label={ariaLabel ?? 'Loading…'} aria-live="polite" ... />
```

### 3. Update tests after role fix

```tsx
it('renders without crash', () => {
    renderSkeleton();
    expect(screen.getByRole('status')).toBeInTheDocument();
});
```

---

## Overall Rating: 🔴 Needs Work

The shimmer animation is silently broken (missing keyframes) and the ARIA role is semantically incorrect. Both are must-fix before shipping.
