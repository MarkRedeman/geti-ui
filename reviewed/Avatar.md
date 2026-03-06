# Avatar & AvatarGroup — Peer Review

**Files:**

- `packages/ui/src/components/Avatar/Avatar.tsx`
- `packages/ui/src/components/Avatar/AvatarGroup.tsx`  
  **Group:** 6 — Data Display  
  **Reviewer:** Oracle

---

## Summary

`Avatar` is a clean Spectrum passthrough. `AvatarGroup` is a fully custom Geti component that stacks avatars and shows an overflow badge. Both are generally well-implemented. Key issues: `AvatarGroup` uses inline styles (should be CSS module), the overflow badge's `aria-label` on a non-interactive `<span>` is wrong, the `key` fallback using `index` is fragile, and `isDisabled` is untested.

---

## 1. Code Quality & Type Safety

### Avatar

| #   | Severity | Finding                                                                                    |
| --- | -------- | ------------------------------------------------------------------------------------------ |
| 1   | ✅ —     | Clean Spectrum passthrough. Empty interface extension (same minor note as other wrappers). |
| 2   | ✅ —     | Full spread passthrough.                                                                   |

### AvatarGroup

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                 |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟠 Medium | **All styles are inline `CSSProperties` objects** in a `styles` dictionary. Should use a CSS module. The component cannot respond to hover, dark mode overrides, or `prefers-reduced-motion` without a CSS file.                                                                                                                        |
| 2   | 🟠 Medium | **`key={avatarProps.alt ?? index}`** — using `index` as a key fallback is an anti-pattern. If the `avatars` array is reordered without `alt` values, React will produce incorrect reconciliation. The `AvatarProps` interface requires `src` (from Spectrum) — use `src` as the key fallback instead: `key={avatarProps.src ?? index}`. |
| 3   | 🟡 Low    | `overflow: number` is typed locally but the variable `overflow = avatars.length - max` can be negative when `max > avatars.length` — this produces a negative `overflow` value. The `overflow > 0` guard prevents rendering, but a cleaner approach is: `const overflow = Math.max(0, avatars.length - max)`.                           |
| 4   | 🟡 Low    | The overflow badge has hardcoded dimensions (`width: '32px', height: '32px'`) that don't scale with the `size` prop. If all avatars are small (`avatar-size-50`), the overflow badge will be visually disproportionate.                                                                                                                 |
| 5   | ✅ —      | `AvatarGroupProps` types are clean and well-documented.                                                                                                                                                                                                                                                                                 |

---

## 2. Accessibility

### Avatar

| #   | Severity | Finding                                                                                                                    |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `SpectrumAvatar` renders `role="img"` with `alt` text. Tests correctly verify `getByRole('img', { name: 'Jane Doe' })`.    |
| 2   | 🟡 Low   | No test for `isDisabled` — Spectrum renders a disabled avatar with reduced opacity and possibly `aria-disabled`. Untested. |

### AvatarGroup

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 High  | **The overflow badge `<span aria-label="+2 more">` is a non-interactive `<span>`.** `aria-label` on a non-interactive element without a role is ignored by most AT. The overflow count should either: (a) use `role="img" aria-label="+2 more"` to announce it as an image/icon, or (b) be wrapped in a visually-hidden `<span>` with the text and a visual `+2` span. Currently, screen readers will likely read it as "+2" without context. |
| 2   | 🟡 Low   | The group's `aria-label="{n} avatars"` is good but uses a count that includes overflowed (hidden) avatars. Consider `aria-label="{visible.length} of {avatars.length} users shown"`.                                                                                                                                                                                                                                                          |
| 3   | 🟡 Low   | No test verifies the overflow badge has an accessible name.                                                                                                                                                                                                                                                                                                                                                                                   |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                                                                                                                                                                  |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc on `Avatar` and `AvatarGroup` is clear. `AvatarGroup` documents all props.                                                                                                                                                                                                         |
| 2   | ✅ —     | Stories: Default, Small, Large, Disabled, FallbackSrc, Group (AvatarGroup with 5 avatars, max=3).                                                                                                                                                                                        |
| 3   | 🟡 Low   | `AvatarGroup` stories are in `Avatar.stories.tsx` — this is fine since `AvatarGroup` lives in the same folder, but the story type annotation (`AvatarGroupStory`) switches between `StoryObj<typeof Avatar>` and `StoryObj<typeof AvatarGroup>`. This is correct but slightly confusing. |
| 4   | 🟡 Low   | No story for `AvatarGroup` with `size` prop overriding individual avatar sizes.                                                                                                                                                                                                          |
| 5   | 🟡 Low   | `FallbackSrc` story uses a broken URL — this is intentional but Storybook will show a broken image indefinitely. Consider using a data URI with a placeholder instead.                                                                                                                   |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                                 |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —      | Avatar tests: render, alt text, disabled. Minimal but adequate for a thin wrapper.                                                                                      |
| 2   | ✅ —      | AvatarGroup tests: render, overflow count, no overflow when within max, correct count at max. Good edge case coverage.                                                  |
| 3   | 🟠 Medium | **`isDisabled` not tested for Avatar.** The test `'renders as disabled when isDisabled is set'` only checks existence — doesn't verify `aria-disabled` or visual class. |
| 4   | 🟡 Low    | No test for the overflow badge's accessible name.                                                                                                                       |
| 5   | 🟡 Low    | No test for `AvatarGroup` with `size` prop applied to all avatars.                                                                                                      |

---

## Specific Fixes Required

### 1. Fix overflow badge role

```tsx
// Before:
<span style={styles.overflow} aria-label={`${overflow} more`}>
    +{overflow}
</span>

// After:
<span style={styles.overflow} role="img" aria-label={`${overflow} more avatars`}>
    <span aria-hidden="true">+{overflow}</span>
</span>
```

### 2. Fix key fallback

```tsx
// Before:
<span key={avatarProps.alt ?? index} style={styles.item}>

// After:
<span key={avatarProps.src ?? avatarProps.alt ?? index} style={styles.item}>
```

### 3. Clamp overflow value

```tsx
const overflow = Math.max(0, avatars.length - max);
```

### 4. Strengthen disabled test

```tsx
it('renders as disabled with reduced opacity', () => {
    renderAvatar({ isDisabled: true });
    const img = screen.getByRole('img');
    // Spectrum applies aria-disabled at the wrapper level
    expect(img.closest('[aria-disabled]')).toBeInTheDocument();
});
```

### 5. Migrate to CSS module

Create `Avatar.module.css` (or `AvatarGroup.module.css`) with `.group`, `.item`, `.overflow` classes.

---

## Overall Rating: 🟡 Acceptable

Avatar is well-done. AvatarGroup needs the overflow badge role fix (accessibility), key correction, and CSS module migration.
