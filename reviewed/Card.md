# Card — Peer Review

**File:** `packages/ui/src/components/Card/Card.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🔴 Needs significant fixes

---

## Summary

The `Card` is a custom component (not a thin wrapper) and its implementation has several meaningful issues: broken focus visibility due to `style={{ all: 'unset' }}`, dual `onPress`/`onClick` API mismatch with Spectrum conventions, the interactive variant renders a `<button>` inside a `<View>` div which creates a non-Spectrum interaction model, and inline `style` usage violates the project's `UNSAFE_className` convention. Tests are good and catch the right behaviour, but the implementation has correctness problems.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🔴 High   | Interactive `Card` uses `onClick` on a native `<button>` but the Props interface and JSDoc specify `onPress` (Spectrum convention). `onPress` is **not** the same as `onClick` — `onPress` fires on pointer-up and on Enter/Space for keyboard, while `onClick` also fires. The Props type implies Spectrum semantics but the DOM handler is vanilla. This is misleading to consumers who expect Spectrum-style `usePress` behaviour (e.g. no fire on pointer cancel). ⏳ _Still open — `onClick={isDisabled ? undefined : onPress}` pattern unchanged._ |
| 1.2 | 🔴 High   | `style={{ all: 'unset', ... }}` on the inner `<button>` **completely removes** the browser's default focus ring (`:focus-visible` outline). There is no replacement focus style — the interactive card is keyboard-inaccessible visually. See section 2. ⏳ _Still open — `style={{ all: 'unset', ... }}` and `className="geti-card-button"` present but no `:focus-visible` CSS module created._                                                                                                                                                        |
| 1.3 | 🟠 Medium | Inline `style` is used (`style={{ all: 'unset', display: 'block', ... }}`). The AGENTS.md convention is to use `UNSAFE_className` for CSS overrides, not `UNSAFE_style` / `style`. This should be a CSS module or `UNSAFE_className`. ⏳ _Still open._                                                                                                                                                                                                                                                                                                   |
| 1.4 | 🟡 Low    | `UNSAFE_className` is only applied to the outer `View`, not to the inner `button` or `article`. A consumer who needs to style the inner element has no path to do so.                                                                                                                                                                                                                                                                                                                                                                                    |
| 1.5 | ✅        | Copyright header present.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 1.6 | ✅        | Props type is explicit and well-documented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 1.7 | 🟡 Low    | `isSelected` + `aria-pressed` is correct for toggle buttons; however, if this card is used in a `CardView` (non-toggle list select), `aria-pressed` semantics are wrong — `aria-selected` is more appropriate in a list context.                                                                                                                                                                                                                                                                                                                         |

**Fix (1.1 & 1.2):** Replace the native `<button>` + `onClick` with Spectrum's `PressResponder` / `usePress`, or use the library's own `PressableElement`, which handles both `onPress` semantics and focus management correctly:

```tsx
import { usePress } from '@react-aria/interactions';

// Or use the library wrapper:
import { PressableElement } from '../PressableElement/PressableElement';
```

---

## 2. Accessibility

| #   | Severity    | Finding                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🔴 Critical | `style={{ all: 'unset' }}` on the button removes all browser focus styles including `:focus-visible`. The interactive card has **no visible focus indicator**, failing WCAG 2.1 SC 2.4.7 (Focus Visible) and SC 2.4.11 (Focus Appearance, 2.2). ⏳ _Still open — `all: 'unset'` present and no `.geti-card-button:focus-visible` CSS rule added._                                                                            |
| 2.2 | 🟠 Medium   | `aria-disabled={isDisabled}` is set in addition to `disabled`. When `disabled` is present, `aria-disabled` is redundant. If the intent is to keep the element focusable but visually/semantically disabled (Spectrum pattern), remove the native `disabled` attribute and use only `aria-disabled`. Currently both are set — this is internally inconsistent. ⏳ _Still open — both `disabled` and `aria-disabled` are set._ |
| 2.3 | 🟡 Low      | The static (non-interactive) card renders as `<article>` — this is a valid semantic choice for a self-contained content block. However `<article>` announces itself in some screen readers, which may be noisy in a long `CardView` list. Consider whether `<section>` or a plain `<div>` with appropriate ARIA would be better. This depends on the intended content semantics.                                             |
| 2.4 | ✅          | `aria-label` passed through to both `<button>` and `<article>`.                                                                                                                                                                                                                                                                                                                                                              |
| 2.5 | ✅          | `aria-pressed` set when interactive and selected.                                                                                                                                                                                                                                                                                                                                                                            |

**Fix (2.1):** At minimum add a focus style before removing `all: 'unset'`:

```css
/* In a CSS module */
.interactiveButton:focus-visible {
    outline: 2px solid var(--spectrum-focus-ring-color);
    outline-offset: 2px;
}
```

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity | Finding                                                                                                                        |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 3.1 | ✅       | JSDoc on component and all props.                                                                                              |
| 3.2 | ✅       | Four stories: Default, Selectable, Selected, Disabled.                                                                         |
| 3.3 | ✅       | `parameters.a11y: {}` present.                                                                                                 |
| 3.4 | 🟡 Low   | No story demonstrating keyboard interaction (Tab → Enter). Given the custom interaction model this is important documentation. |
| 3.5 | 🟡 Low   | `onPress` in stories fires `() => {}` — a no-op. Using Storybook `action('onPress')` would make the story more useful.         |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                                                         |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅         | Tests `role="article"` for static and `role="button"` for interactive.                                                                                                          |
| 4.2 | ✅         | Tests `onPress` call and disabled no-call.                                                                                                                                      |
| 4.3 | ✅         | Tests `aria-pressed` when selected.                                                                                                                                             |
| 4.4 | ✅         | Uses `rstest.fn()` correctly.                                                                                                                                                   |
| 4.5 | 🔴 Missing | No test that keyboard-focuses the button and triggers with `{Enter}` or `{Space}`. Given the `all: 'unset'` concern this is a critical missing test. ⏳ _Still open._           |
| 4.6 | 🟡 Low     | No test for `isSelected` on a static (non-interactive) card — `isSelected` has no visible/semantic effect on the `<article>` branch (the `backgroundColor` change is CSS-only). |

**Suggested test:**

```ts
it('calls onPress on keyboard Enter', async () => {
    const onPress = rstest.fn();
    renderCard({ onPress });
    const button = screen.getByRole('button', { name: 'Test card' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledOnce();
});
```

---

## Action Items

- [ ] **Fix Critical**: Restore focus visibility — remove `all: 'unset'` or add explicit `:focus-visible` CSS (`Critical`). ⏳ _Still open._
- [ ] **Fix High**: Replace `onClick` on native `<button>` with Spectrum-compatible `onPress` via `usePress` or the library's `PressableElement` (`High`). ⏳ _Still open._
- [ ] **Fix Medium**: Resolve `disabled` + `aria-disabled` dual usage — pick one pattern (`Medium`). ⏳ _Still open._
- [ ] **Fix Medium**: Replace inline `style` with `UNSAFE_className` + CSS module (`Medium`). ⏳ _Still open._
- [ ] Add keyboard `{Enter}`/`{Space}` test (`High`). ⏳ _Still open._
- [ ] Consider `aria-selected` in list-selection contexts vs `aria-pressed` for toggle semantics (`Low`).
