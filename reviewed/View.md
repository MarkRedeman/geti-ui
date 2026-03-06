# View — Peer Review

**File:** `packages/ui/src/components/View/View.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🟡 Approved with fixes recommended

---

## Summary

A correct, minimal Spectrum `View` wrapper with adequate stories and tests. One structural issue stands out: the component and its Props type are defined in an unconventional order, and the Props derivation strategy differs from every other component in the library.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟠 Medium | `ViewProps` is derived via `React.ComponentProps<typeof SpectrumView>` **after** the component is declared. All other components in the library declare Props _before_ the component (`interface FooProps extends SpectrumFooProps`). This breaks the established pattern and makes type derivation opaque — if Spectrum changes `View`'s internal signature the derived type silently changes. Prefer the explicit `extends` pattern. |
| 1.2 | ✅        | Copyright header present.                                                                                                                                                                                                                                                                                                                                                                                                              |
| 1.3 | ✅        | Props spread via `...props`.                                                                                                                                                                                                                                                                                                                                                                                                           |
| 1.4 | ✅        | No `any` types.                                                                                                                                                                                                                                                                                                                                                                                                                        |

**Suggested fix (1.1):**

```ts
import { View as SpectrumView, SpectrumViewProps } from '@adobe/react-spectrum';

export interface ViewProps extends SpectrumViewProps {}

export const View = (props: ViewProps) => <SpectrumView {...props} />;
```

> Note: Verify `SpectrumViewProps` is exported from `@adobe/react-spectrum` — if not, `React.ComponentProps` is the fallback but should be noted with a comment explaining why.

---

## 2. Accessibility

| #   | Severity | Finding                                                         |
| --- | -------- | --------------------------------------------------------------- |
| 2.1 | ✅       | `View` renders as a `div` — appropriate for a layout primitive. |
| 2.2 | ✅       | No keyboard nav responsibility.                                 |

No accessibility issues.

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity | Finding                                                                                                                                                                                                                           |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | ✅       | JSDoc on component and Props type.                                                                                                                                                                                                |
| 3.2 | 🟡 Low   | JSDoc on `ViewProps` says "Inferred from Spectrum's View component props" — acceptable documentation of the unconventional derivation approach, but the comment would be redundant if the explicit `extends` approach is adopted. |
| 3.3 | ✅       | Three stories: Default, WithBorder, CustomSize — covers primary use cases.                                                                                                                                                        |
| 3.4 | ✅       | `parameters.a11y: {}` present.                                                                                                                                                                                                    |

---

## 4. Tests

| #   | Severity | Finding                                                                                                                                                    |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅       | Renders without crash.                                                                                                                                     |
| 4.2 | ✅       | Children render test.                                                                                                                                      |
| 4.3 | ✅       | Border props smoke test.                                                                                                                                   |
| 4.4 | 🟡 Low   | No test verifying `elementType` prop (e.g. rendering as `<section>`) — `View` supports this and it's accessibility-relevant when mapping to semantic HTML. |

**Suggested test:**

```ts
it('renders with custom elementType', () => {
    renderView({ elementType: 'section' });
    expect(document.querySelector('section')).toBeInTheDocument();
});
```

---

## Action Items

- [ ] Switch `ViewProps` to explicit `extends SpectrumViewProps` before the component declaration (`Medium`). Add a code comment if `SpectrumViewProps` is not directly importable.
- [ ] Add `elementType` semantic rendering test (`Low`).
