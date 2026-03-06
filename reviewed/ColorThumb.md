# ColorThumb — Peer Review

**File:** `packages/ui/src/components/ColorThumb/ColorThumb.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🟠 Needs fixes

---

## Summary

`ColorThumb` is a custom decorative component built on top of the library's `View`. It's a simple colour swatch square used as a display element (not interactive). The implementation is functionally correct but violates the project convention on `UNSAFE_style` usage and is missing a copyright header. Accessibility handling for the purely decorative nature needs explicit documentation.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                         |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🔴 High   | **Missing copyright header**.                                                                                                                                                                                                                                                                                                   |
| 1.2 | 🟠 Medium | Uses `UNSAFE_style` for all visual properties (`backgroundColor`, `width`, `height`). AGENTS.md states: _"Use `UNSAFE_className` for CSS overrides (not `UNSAFE_style`)"_. This should use a CSS module class instead, both for performance (avoids inline style recalculation on every render) and for convention consistency. |
| 1.3 | ✅        | Extends `ViewProps` correctly — consumers get all Spectrum dimension/spacing props.                                                                                                                                                                                                                                             |
| 1.4 | ✅        | `color` and `size` props are typed with defaults.                                                                                                                                                                                                                                                                               |
| 1.5 | 🟡 Low    | `size` is typed as `number` but `View`'s width/height expects Spectrum dimension values (e.g. `'size-100'`). Passing `10` as a raw pixel number relies on `UNSAFE_style` casting — this is intentional given the pixel-precision requirement for colour thumbs, but should be documented in the JSDoc.                          |
| 1.6 | 🟡 Low    | Spreading `rest.UNSAFE_style` first and then overriding `backgroundColor`/`width`/`height` means consumers can't override these specific properties via `UNSAFE_style`. This is likely intentional but should be documented.                                                                                                    |

**Fix (1.2) — preferred approach:**

```css
/* ColorThumb.module.css */
.thumb {
    background-color: var(--color-thumb-color);
    width: var(--color-thumb-size);
    height: var(--color-thumb-size);
}
```

```tsx
import styles from './ColorThumb.module.css';

export const ColorThumb = ({ color, size = 10, ...rest }: ColorThumbProps) => (
    <View
        {...rest}
        UNSAFE_className={styles.thumb}
        UNSAFE_style={
            {
                '--color-thumb-color': color,
                '--color-thumb-size': `${size}px`,
            } as React.CSSProperties
        }
    />
);
```

> If CSS custom properties feel overly complex for this simple case, a pragmatic middle ground is to keep `UNSAFE_style` but add a comment acknowledging the exception with a rationale (pixel-precision colour display).

---

## 2. Accessibility

| #   | Severity  | Finding                                                                                                                                                                                                                                                        |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟠 Medium | `ColorThumb` has no `role` or `aria-label`. As a purely decorative element, it should be explicitly marked `aria-hidden="true"` to prevent screen readers from announcing a nameless element. The JSDoc should document this intended purely decorative usage. |
| 2.2 | ✅        | Since `View` is a `<div>`, there is no implicit interactive role — correct for a display element.                                                                                                                                                              |

**Fix (2.1):**

```tsx
export const ColorThumb = ({ color, size = 10, ...rest }: ColorThumbProps) => (
  <View
    {...rest}
    aria-hidden="true"
    UNSAFE_style={{ ... }}
  />
);
```

> Allow consumers to override `aria-hidden` via `...rest` if they need to make it visible to AT in specific contexts.

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity | Finding                                                                                                                 |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| 3.1 | ✅       | JSDoc present with brief description.                                                                                   |
| 3.2 | ✅       | Two stories: Default, Sizes — appropriate for a display-only component.                                                 |
| 3.3 | 🟡 Low   | `parameters.a11y: {}` **absent**.                                                                                       |
| 3.4 | 🟡 Low   | No story title namespace (`title:` is absent from the meta) — stories will appear at the root of the Storybook sidebar. |

**Fix (3.4):**

```ts
const meta: Meta<typeof ColorThumb> = {
    component: ColorThumb,
    title: 'Color/ColorThumb',
    // ...
};
```

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅         | Renders with `backgroundColor` style.                                                                                                  |
| 4.2 | 🟡 Low     | Test queries by `document.getElementById` using a hardcoded `id` — this is fragile. Prefer `screen.getByTestId` or structural queries. |
| 4.3 | 🔴 Missing | No test for custom `size` prop (width/height values).                                                                                  |
| 4.4 | 🔴 Missing | No test confirming `aria-hidden="true"` (once fix 2.1 is applied).                                                                     |
| 4.5 | 🟡 Low     | Unused `React` import.                                                                                                                 |

---

## Action Items

- [ ] **Fix High**: Add copyright header (`High`).
- [ ] **Fix Medium**: Replace `UNSAFE_style` with `UNSAFE_className` + CSS module, or add a comment justifying the exception (`Medium`).
- [ ] **Fix Medium**: Add `aria-hidden="true"` as default for decorative use (`Medium`).
- [ ] Add `title: 'Color/ColorThumb'` to story meta (`Medium`).
- [ ] Add `parameters.a11y: {}` to stories (`Medium`).
- [ ] Add `size` and `aria-hidden` tests (`Low`).
- [ ] Remove unused `React` import (`Low`).
