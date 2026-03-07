# Toast — Peer Review

**File:** `packages/ui/src/components/Toast/Toast.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

`Toast` exposes both a `ToastContainer` component and a programmatic `toast` API object. The implementation is well-designed and idiomatic. The `CloseFunction` return type alias is clean. Key issues: very thin test coverage (only tests `positive` variant), the `warning` variant is absent from `ToastAPI` (Spectrum doesn't have it, but the naming gap should be documented), and the `eslint-disable` comment merits attention.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                            |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —      | `CloseFunction = () => void` type alias is clear, though `SpectrumToastQueue.positive` actually returns `() => void` — this is accurately typed.                                                                                                                                                                   |
| 2   | 🟡 Low    | `ToastAPI` type is declared separately from the `toast` object — the object's type is inferred. This is fine, but the `ToastAPI` type is not exported from `index.ts`, which means consumers cannot type their own toast wrappers. Consider exporting it.                                                          |
| 3   | 🟡 Low    | The `eslint-disable-next-line react-refresh/only-export-components` comment is needed because `toast` is a non-component export in a `.tsx` file. This is intentional and acceptable, but the comment should explain _why_ rather than just suppress.                                                              |
| 4   | 🔴 Medium | **`toast.warning` is absent.** Spectrum's `ToastQueue` also does not have `warning`, so this is expected — but `StatusLight` and `InlineAlert` both have `notice` semantics. The `ToastAPI` should have a `notice` variant (aliased to `info` or documented as absent) for API consistency across Geti components. |
| 5   | ✅ —      | All four methods correctly delegate to `SpectrumToastQueue`.                                                                                                                                                                                                                                                       |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                      |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `ToastContainer` renders `role="region"` with `aria-label` for the toast region. `ToastQueue` manages `role="alert"` / `aria-live` regions automatically.                                                                    |
| 2   | 🟡 Low   | The `placement` prop defaults are not documented. Spectrum supports `'top'`, `'top left'`, `'top right'`, `'bottom'`, `'bottom left'`, `'bottom right'`, `'center bottom'`. Consumers need to know which to use.             |
| 3   | 🟡 Low   | `shouldCloseOnAction: true` is only shown in the `WithAction` story, which calls `alert()` — this is acceptable for a demo but `alert()` is inaccessible. Replace with a `console.log` or state-based approach in the story. |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                               |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc on `ToastContainer` (placement usage), `ToastAPI` methods, and individual method comments are clear and include `@example`.                     |
| 2   | ✅ —     | All four variants have stories triggered via button press. `WithAction` demonstrates the action callback pattern.                                     |
| 3   | 🟡 Low   | No story for **auto-dismiss** (`timeout` option). The `Error` story uses `timeout: 10000` but there is no story showing the default timeout behavior. |
| 4   | 🟡 Low   | `ToastContainerProps` and `ToastOptions` type re-exports are useful — well done. `ToastAPI` type should also be exported.                             |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                                                        |
| --- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 High   | **Only `positive` variant is tested.** `toast.negative`, `toast.info`, and `toast.neutral` are completely untested.                                                                            |
| 2   | 🟠 Medium | No test for toast **auto-dismiss** (timeout).                                                                                                                                                  |
| 3   | 🟠 Medium | No test for the **action button** (`actionLabel` + `onAction`).                                                                                                                                |
| 4   | 🟡 Low    | `'renders ToastContainer without crash'` asserts `document.body` — this is a meaningless assertion (body is always present). Should instead verify the container's DOM element or aria region. |
| 5   | 🟡 Low    | No test for `toast.negative` showing error message text.                                                                                                                                       |

---

## Specific Fixes Required

```tsx
// 1. Export ToastAPI type from index.ts:
export type { ToastContainerProps, ToastOptions, ToastAPI } from './components/Toast/Toast';

// 2. Add comment to eslint-disable:
// eslint-disable-next-line react-refresh/only-export-components -- toast is a programmatic API object, not a component
export const toast: ToastAPI = { ... };

// 3. Add missing variant tests:
it('shows a negative toast', async () => {
    render(
        <Provider theme={defaultTheme}>
            <ToastContainer />
            <button onClick={() => toast.negative('Upload failed!')}>Trigger</button>
        </Provider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(await screen.findByText('Upload failed!')).toBeInTheDocument();
});

it('shows an info toast', async () => { /* similar */ });
it('shows a neutral toast', async () => { /* similar */ });

// 4. Fix meaningless assertion:
it('renders ToastContainer', () => {
    render(
        <Provider theme={defaultTheme}>
            <ToastContainer placement="bottom" />
        </Provider>
    );
    // Container renders but is empty without queued toasts
    expect(document.body).not.toBeNull(); // <- replace this
    // Better:
    toast.info('Test');
    // ... or just verify no crash and container is a live region
});
```

---

## Overall Rating: 🟡 Acceptable

API design is excellent. Test coverage is the main gap — only one of four variants is covered.
