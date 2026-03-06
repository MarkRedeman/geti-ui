# Loading — Peer Review

**File:** `packages/ui/src/components/Loading/Loading.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

`Loading` is a Geti-custom composite built on top of `ProgressCircle`. It provides three layout modes (`inline`, `overlay`, `fullscreen`) as inline `CSSProperties` objects. Reasonably well-implemented with good JSDoc. Issues: inline styles should migrate to CSS modules, the `Fullscreen` story is missing, and tests are shallow.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟠 Medium | **Inline `CSSProperties` objects** (`FULLSCREEN_STYLE`, `OVERLAY_STYLE`, `INLINE_STYLE`) are module-level constants — this is acceptable for static values, but they should be CSS module classes. Inline styles cannot be overridden from outside without `!important` or the `style` prop. This diverges from the project's CSS module convention (see `ActionButton`, `Button`, `ToggleButtons`). |
| 2   | 🟡 Low    | `LoadingProps` extends `SpectrumProgressCircleProps` and adds `mode`, `style`, `className`. However `SpectrumProgressCircleProps` already includes `UNSAFE_className` and `UNSAFE_style`; the added `className` and `style` apply to the **wrapper `div`**, not the `ProgressCircle`. This difference is not documented in the interface.                                                            |
| 3   | 🟡 Low    | `size = 'L'` default is correct for most use cases. The `...rest` spread passes all remaining props to `ProgressCircle`, which is fine — but `style` is extracted from `rest` and applied to the outer `div`, so callers cannot pass `style` directly to the inner `ProgressCircle`. This asymmetry is implicit.                                                                                     |
| 4   | ✅ —      | Ternary chain for `baseStyle` is readable; no `any` types; good use of `CSSProperties`.                                                                                                                                                                                                                                                                                                              |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                                           |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Delegates ARIA to `ProgressCircle` → `SpectrumProgressCircle`. Gets `role="progressbar"`, `aria-label`, `aria-busy` via Spectrum.                                                                                                                                                                                                                 |
| 2   | 🟡 Low   | The outer container `div` has no semantic role. In `fullscreen` and `overlay` modes it acts as a backdrop/overlay — consider adding `aria-hidden="true"` to the container and keeping ARIA only on the inner spinner. Alternatively, the container could use `role="status"` or `role="progressbar"` at the top level and hide the inner element. |
| 3   | 🟡 Low   | The hardcoded `aria-label="Loading..."` on `ProgressCircle` cannot be overridden from `Loading` without explicitly passing `aria-label` as a prop — but because `...rest` is spread _after_ the hardcoded `aria-label`, a caller-provided `aria-label` _will_ correctly override it. This is actually fine but worth a JSDoc note.                |

---

## 3. Documentation

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                          |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —      | Excellent JSDoc: component description, `@example` blocks for all three modes, all props documented with `@default`.                                                                                                                                                                             |
| 2   | 🔴 Medium | **Missing `Fullscreen` story.** The `fullscreen` mode is the default (`mode='fullscreen'`), yet there is no story demonstrating it. Stories only cover `Inline`, `Overlay`, `Small`, and `Large`. The fullscreen mode is not visible in Storybook.                                               |
| 3   | 🟡 Low    | `argTypes.mode` has `options` declared but no story uses `args.mode` directly — all stories use explicit `render` or hardcoded props. The Default story is absent (Storybook will auto-generate one but it will render the fullscreen spinner with no container, which may look broken in docs). |

---

## 4. Tests

| #   | Severity | Finding                                                                                                                                                                                               |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟡 Low   | All tests only check `getByRole('progressbar')` is in the document. No test verifies CSS layout mode differences (e.g. that `position: 'fixed'` is applied for fullscreen, `'absolute'` for overlay). |
| 2   | 🟡 Low   | Test `'renders in inline mode'` is near-identical to `'renders without crash'`. Should be consolidated.                                                                                               |
| 3   | ✅ —     | `'renders with accessible label'` correctly uses `getByRole('progressbar', { name: 'Loading...' })` — good.                                                                                           |
| 4   | 🟡 Low   | No test for `className` or custom `style` being applied to the wrapper.                                                                                                                               |
| 5   | 🟡 Low   | No test for `size` prop propagation.                                                                                                                                                                  |

---

## Specific Fixes Required

### 1. Migrate to CSS module

Create `Loading.module.css`:

```css
.inline {
    display: flex;
    align-items: center;
    justify-content: center;
}
.overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.fullscreen {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

Apply via `UNSAFE_className` or a CSS module import.

### 2. Add missing Fullscreen story

```tsx
export const Fullscreen: Story = {
    args: { mode: 'fullscreen' },
    parameters: {
        docs: { description: { story: 'Fixed fullscreen overlay. Use sparingly for blocking operations.' } },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 300, height: 200, position: 'relative', border: '1px dashed gray' }}>
                <Story />
            </div>
        ),
    ],
};
```

### 3. Strengthen mode tests

```tsx
it('applies fixed positioning in fullscreen mode', () => {
    const { container } = renderLoading({ mode: 'fullscreen' });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ position: 'fixed' });
});

it('applies absolute positioning in overlay mode', () => {
    const { container } = renderLoading({ mode: 'overlay' });
    expect(container.firstChild).toHaveStyle({ position: 'absolute' });
});
```

---

## Overall Rating: 🟡 Acceptable

Functionally correct and well-documented. Needs CSS module migration, a Fullscreen story, and deeper test assertions.
