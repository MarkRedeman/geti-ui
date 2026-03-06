# Image — Peer Review

**File:** `packages/ui/src/components/Image/Image.tsx`  
**Group:** 6 — Data Display  
**Reviewer:** Oracle

---

## Summary

`Image` is the simplest component in this review — a minimal Spectrum passthrough with no custom logic. Implementation is correct. The primary issues are in test quality (the `src` assertion test is hollow) and missing error/loading state coverage in both tests and stories.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                                                                      |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟡 Low   | Empty interface extension (same as other wrappers).                                                                                                                                          |
| 2   | ✅ —     | Full passthrough. No `any`. Correct.                                                                                                                                                         |
| 3   | 🟡 Low   | `SpectrumImage` wraps a native `<img>` tag. The `objectFit` prop is passed via Spectrum's UNSAFE_style internally — this is handled by Spectrum and doesn't require any Geti-level override. |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                          |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `SpectrumImage` renders `<img>` with the provided `alt`. Empty `alt=""` for decorative images is correctly handled by Spectrum (removes from a11y tree).                                                                                                                                                         |
| 2   | ✅ —     | `Decorative` story uses `alt=""` correctly.                                                                                                                                                                                                                                                                      |
| 3   | 🟡 Low   | No test verifies that `alt=""` actually hides the image from the accessibility tree. The test `'renders with empty alt for decorative images'` uses `document.querySelector('img')` instead of a role-based query — this is intentional (empty alt removes it from the tree) but lacks a comment explaining why. |
| 4   | 🟡 Low   | No story or test for images with `aria-hidden="true"` as an alternative decorative pattern.                                                                                                                                                                                                                      |
| 5   | 🟡 Low   | No test or story for **image loading failure** — when `src` fails, the `alt` text becomes visible and critical for UX/a11y.                                                                                                                                                                                      |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                               |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc is accurate and mentions alt text and decorative image handling.                                                                                |
| 2   | ✅ —     | Stories: Default, Cover, Contain, Decorative. Good coverage of `objectFit` variants.                                                                  |
| 3   | 🟡 Low   | No story for `objectFit: 'none'` or `'scale-down'` (both are in `argTypes` options).                                                                  |
| 4   | 🟡 Low   | All stories use an external URL (`picsum.photos`) — this will fail in offline environments or CI. Consider using a data URI or a local fixture image. |
| 5   | 🟡 Low   | No story for broken image with visible `alt` text fallback.                                                                                           |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                 |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 Medium | **`'applies correct src attribute'` test is hollow** — it only checks `expect(img).toBeInTheDocument()`. It doesn't actually assert the `src` attribute value. Should be: `expect(img).toHaveAttribute('src', SAMPLE_IMAGE)` (or a partial match given Spectrum may transform the URL). |
| 2   | 🟡 Low    | `'renders with empty alt for decorative images'` uses `document.querySelector('img')` — acceptable for this case, but should include a comment explaining that decorative images are intentionally absent from the a11y tree.                                                           |
| 3   | 🟡 Low    | No test for `objectFit` prop being applied (inline style on the `<img>`).                                                                                                                                                                                                               |
| 4   | 🟡 Low    | No test for broken `src` — Spectrum's Image fires `onError`; this is untested.                                                                                                                                                                                                          |
| 5   | 🟡 Low    | Tests depend on external URLs. If the URL fails (network error), tests may behave unexpectedly. Use a mock or data URI for the test fixture.                                                                                                                                            |

---

## Specific Fixes Required

### 1. Fix hollow src test

```tsx
it('applies correct src attribute', () => {
    renderImage({ src: SAMPLE_IMAGE });
    expect(screen.getByRole('img')).toHaveAttribute('src', SAMPLE_IMAGE);
});
```

### 2. Add comment to decorative image test

```tsx
it('renders decorative image without accessible role (empty alt)', () => {
    renderImage({ alt: '' });
    // Images with alt="" are intentionally hidden from the a11y tree.
    // We query by raw DOM element since getByRole('img') would fail.
    const img = document.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', '');
});
```

### 3. Use local/stable fixture in tests

```tsx
// Replace:
const SAMPLE_IMAGE = 'https://picsum.photos/seed/geti/400/300';

// With a stable data URI or local path:
const SAMPLE_IMAGE =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
```

### 4. Add error state story

```tsx
export const BrokenImage: Story = {
    args: {
        src: 'https://broken-url.example.com/notfound.jpg',
        alt: 'Image failed to load — this text is the fallback',
        width: 'size-3000',
        height: 'size-2000',
    },
};
```

---

## Overall Rating: 🟢 Good

Simplest component in the set. Fix the hollow `src` test; add `onError` coverage and swap external URLs for stable fixtures.
