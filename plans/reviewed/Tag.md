# Tag — Peer Review

**File:** `packages/ui/src/components/Tag/Tag.tsx`  
**Group:** 6 — Data Display  
**Reviewer:** Oracle

---

## Summary

`Tag` is a fully custom Geti component (no Spectrum base). It renders a styled `<div>` with optional prefix dot, prefix element, and suffix element. Implementation is functionally correct but has several notable issues: inline style objects instead of CSS modules, `aria-label` on a `<div>` with visible text is redundant and semantically incorrect, the `...rest` spread is untyped (implicitly `{}`), and the `darkMode` prop name conflicts with modern design system conventions.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟠 Medium | **`...rest` is silently typed as `{}`** — `TagProps` has no `extends` clause, so TypeScript will only accept declared props. Any undeclared prop (e.g., `onClick`, `onKeyDown`) will be a type error. This is actually **correct** type safety, but the `{...rest}` spread on the `<div>` without proper typing means if the interface is ever extended with HTML attributes, they won't be properly typed. Recommend: `export interface TagProps extends React.HTMLAttributes<HTMLDivElement>` (minus conflicting props like `children`). ⏳ _Still open — `TagProps` still does not extend `HTMLAttributes<HTMLDivElement>`._ |
| 2   | 🟠 Medium | **All styles are inline `CSSProperties` objects** — violates the project CSS module convention used by `ActionButton`, `Button`, `ToggleButtons`. `Tag` is a Geti-custom component and should use a CSS module. Inline styles: cannot use pseudo-classes (`:hover`, `:focus`), cannot use `prefers-reduced-motion`, are harder to override. ⏳ _Still open — all styles remain as inline `CSSProperties` objects in the component file._                                                                                                                                                                                        |
| 3   | 🟡 Low    | `darkMode` prop is a binary boolean. This doesn't integrate with the `ThemeProvider` or CSS custom properties. It manually switches between `gray-100` and `gray-200`. Consider deprecating in favour of CSS variable-based theming.                                                                                                                                                                                                                                                                                                                                                                                            |
| 4   | 🟡 Low    | `data-testid={id}` is set when `id` is provided — this duplicates the element's `id`. Using `id` as a test hook is fragile. Better: remove `data-testid` or make it a separate prop.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 5   | ✅ —      | Width/size calculations use Spectrum tokens consistently (e.g., `var(--spectrum-global-dimension-size-75)`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

---

## 2. Accessibility

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 High   | **`aria-label={text}` on a `<div>` with visible `<span>{text}</span>` is redundant and incorrect.** WCAG 2.1 Success Criterion 4.1.2 states that `aria-label` should only be used when there is no visible text label. Since the text is visible as a child `<span>`, the `aria-label` is ignored by most AT (or creates duplicate announcements). Remove `aria-label` from the container div. The visible `<span>{text}</span>` is sufficient. ✅ **Fixed:** `aria-label={text}` removed from container `<div>`. |
| 2   | 🟠 Medium | **No semantic role on the container `<div>`.** The tag renders as a generic `<div>` with no ARIA role. If it represents a status or category label, it should have `role="status"` or be wrapped in a list item. If it's interactive (has `onClick`), it needs `role="button"` and keyboard handlers. Currently it has neither. ⏳ _Still open._                                                                                                                                                                  |
| 3   | 🟡 Low    | `title={tooltip}` provides a native tooltip but this is not keyboard accessible. The tooltip is only shown on hover, not on focus. Should use `Tooltip` component from `@geti/ui`.                                                                                                                                                                                                                                                                                                                                |
| 4   | 🟡 Low    | The accent dot (`<span style={styles.dot} aria-hidden="true" />`) is correctly hidden from AT. ✅                                                                                                                                                                                                                                                                                                                                                                                                                 |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                     |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Props are well-documented with JSDoc.                                                                                                       |
| 2   | ✅ —     | Stories cover all variants: Default, NoDot, WithPrefix, WithSuffix, WithTooltip, DarkMode.                                                  |
| 3   | 🟡 Low   | No story showing `Tag` used inside a list context (semantic container).                                                                     |
| 4   | 🟡 Low   | No story demonstrating interactive `Tag` with `onClick` — which would be a common use case but is currently unsupported by the type system. |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —      | Good test coverage: render, dot presence, no-dot, prefix, suffix, aria-label, tooltip.                                                                                                                                                                                                                                                                                                                                           |
| 2   | 🔴 Medium | **`aria-label` test is testing wrong behavior.** `it('has aria-label set to the text')` tests `screen.getByLabelText('Accessible Tag')` — this works because `aria-label` is set on the div, but as noted above, this is incorrect a11y practice. The test will need to change once the `aria-label` is removed. ⏳ _Still open — `aria-label` was removed from source but the test may need updating to query by text instead._ |
| 3   | 🟡 Low    | Test for `data-testid` uses `screen.getByTestId('test-id')` implicitly (via `children` count) — fragile DOM structure assertion.                                                                                                                                                                                                                                                                                                 |
| 4   | 🟡 Low    | No test for `darkMode` prop changing the background color.                                                                                                                                                                                                                                                                                                                                                                       |
| 5   | 🟡 Low    | No test for `tooltip` — `title` attribute presence is tested but the accessible tooltip interaction is not.                                                                                                                                                                                                                                                                                                                      |

---

## Specific Fixes Required

### 1. Extend from HTMLDivElement attributes

```tsx
export interface TagProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    id?: string;
    text: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    withDot?: boolean;
    tooltip?: string;
    darkMode?: boolean;
}
```

⏳ _Still open._

### 2. Remove redundant `aria-label`

```tsx
// Before:
<div ... aria-label={text} title={tooltip} {...rest}>

// After:
<div ... title={tooltip} {...rest}>
  {/* Visible <span>{text}</span> is the accessible name */}
```

✅ **Fixed:** `aria-label={text}` removed from the container `<div>`.

### 3. Migrate to CSS module

Create `Tag.module.css` with base styles, border-radius, padding, and hover states.

⏳ _Still open — inline style objects remain._

### 4. Use accessible tooltip

```tsx
// Replace title={tooltip} with:
tooltip ? (
    <Tooltip trigger={<div ...>{/* content */}</div>}>{tooltip}</Tooltip>
) : (
    <div ...>{/* content */}</div>
)
```

⏳ _Still open._

### 5. Update aria-label test

```tsx
// After removing aria-label from div:
it('renders text content', () => {
    render(<Tag text="Accessible Tag" />);
    expect(screen.getByText('Accessible Tag')).toBeInTheDocument();
});
```

⏳ _Still open — test file not yet updated._

---

## Overall Rating: 🟠 Needs Attention

Functionally works but the redundant `aria-label`, missing CSS module, and inaccessible tooltip are real issues that need addressing before production.
