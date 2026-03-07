# InlineAlert — Peer Review

**File:** `packages/ui/src/components/InlineAlert/InlineAlert.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

A clean passthrough wrapper over `SpectrumInlineAlert`. Good story and test coverage for all five variants. The primary issue is that `Heading` and `Content` are imported from `@adobe/react-spectrum` in the stories but are not re-exported from `@geti/ui` — consumers using only `@geti/ui` will be forced to reach into Spectrum directly.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟡 Low    | Empty interface extension (same pattern as other wrappers).                                                                                                                                                                                                                                                                                                                                         |
| 2   | 🔴 Medium | **`Heading` and `Content` components not exported from `@geti/ui`.** The stories (and expected consumer usage) require `import { Content, Heading } from '@adobe/react-spectrum'`. These companion components should be re-exported from `@geti/ui` to avoid leaking the upstream dependency into consumers. Precedent: `TableView` re-exports `TableHeader`, `TableBody`, `Column`, `Row`, `Cell`. |
| 3   | ✅ —      | Props passthrough correct. No `any`.                                                                                                                                                                                                                                                                                                                                                                |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                       |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `SpectrumInlineAlert` renders `role="alert"` or `role="alertdialog"` — tested correctly.                                                                                                                      |
| 2   | ✅ —     | All stories provide `<Heading>` and `<Content>` children, satisfying Spectrum's required structure.                                                                                                           |
| 3   | 🟡 Low   | The `Neutral` variant does not communicate urgency — Spectrum does not apply `role="alert"` for neutral. This behavioral difference (neutral renders as a generic container, not an alert) is not documented. |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                                                     |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc on component is accurate.                                                                                                                                             |
| 2   | ✅ —     | All five variants (neutral, info, positive, notice, negative) have dedicated stories with realistic content.                                                                |
| 3   | 🟡 Low   | No usage guidance in JSDoc about the required `Heading` + `Content` child structure. Spectrum enforces this; without re-exporting those components, consumers will be lost. |

---

## 4. Tests

| #   | Severity | Finding                                                                                                                                                                                                |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —     | Tests cover: render, `role="alert"`, title, description, and four variants. Best test file in this group.                                                                                              |
| 2   | 🟡 Low   | Tests use `Provider` + `Heading`/`Content` from `@adobe/react-spectrum` — this is correct but note the same coupling issue as the stories.                                                             |
| 3   | 🟡 Low   | No test for the `neutral` variant potentially **not** having `role="alert"`. If Spectrum renders neutral as a different role, existing tests might incorrectly assume `role="alert"` for all variants. |

---

## Specific Fixes Required

### 1. Re-export companion components from `index.ts`

```ts
// In packages/ui/src/index.ts (near InlineAlert exports):
export { Heading, Content } from '@adobe/react-spectrum';
```

> **Note:** `Heading` and `Content` are generic Spectrum layout primitives used across multiple components. Check if they are already exported before adding — they may already exist under a different alias.

### 2. Add neutral role assertion clarification

```tsx
it('renders neutral variant without alert semantics', () => {
    renderInlineAlert({ variant: 'neutral' });
    // Spectrum InlineAlert neutral does not use role=alert
    // Verify the component still renders
    expect(screen.getByText('Title')).toBeInTheDocument();
});
```

### 3. Document required children in JSDoc

```tsx
/**
 * ...
 * @example
 * import { InlineAlert, Heading, Content } from '@geti/ui';
 *
 * <InlineAlert variant="negative">
 *   <Heading>Error</Heading>
 *   <Content>Something went wrong.</Content>
 * </InlineAlert>
 */
```

---

## Overall Rating: 🟢 Good

Solid test coverage. Key fix: re-export `Heading` and `Content` so consumers don't need direct Spectrum imports.
