# IllustratedMessage — Peer Review

**File:** `packages/ui/src/components/IllustratedMessage/IllustratedMessage.tsx`  
**Group:** 6 — Data Display  
**Reviewer:** Oracle

---

## Summary

A minimal passthrough wrapper over `SpectrumIllustratedMessage`. Well-documented, correct implementation. The primary issues are: stories use the `Alert` workflow icon as the illustration (wrong intent — meant for error state, not empty state), `Heading`/`Content` companion components aren't exported from `@geti/ui`, and tests are very thin (3 tests, render-only).

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                               |
| --- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟡 Low    | Empty interface extension (same as other wrappers).                                                                                                                                                                   |
| 2   | 🔴 Medium | **`Heading` and `Content` are not exported from `@geti/ui`.** Consumers must import them from `@adobe/react-spectrum`. Same issue as `InlineAlert`. Should be fixed at the `index.ts` level once (not per-component). |
| 3   | ✅ —      | Full prop passthrough, no `any`, correct pattern.                                                                                                                                                                     |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                  |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `SpectrumIllustratedMessage` renders as a `<section>` with `role="presentation"` on the illustration wrapper. The `Heading` and `Content` children provide the accessible names.         |
| 2   | 🟡 Low   | The illustration (icon) should be `aria-hidden` — Spectrum handles this for `@spectrum-icons` workflow icons automatically. However, the stories don't call this out. Worth documenting. |
| 3   | 🟡 Low   | No test verifies that the heading has an appropriate heading level (`<h2>`, `<h3>`, etc.). Spectrum renders it as a heading role — this is untested.                                     |

---

## 3. Documentation

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                   |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —      | JSDoc on component is accurate and clear about use cases (empty states, errors).                                                                                                                                                                                                                                                                                          |
| 2   | 🟠 Medium | **Both stories use `Alert` (a warning icon) as the illustration.** `IllustratedMessage` is designed for empty states, errors, and informational displays — using `Alert` for both `Default` (no results) and `EmptyFolder` is semantically odd. Should use appropriate icons: `NoSearchResults` or `Star` for empty state, `Alert` only for genuine error/warning states. |
| 3   | 🟡 Low    | Only two stories — `Default` and `EmptyFolder`. Consider adding: `Error` state (404/server error), `NoPermission`, `UploadEmpty`.                                                                                                                                                                                                                                         |
| 4   | 🟡 Low    | No story showing `IllustratedMessage` with an action button (CTA), which is a primary use case (e.g., "No items — Add one" with a button).                                                                                                                                                                                                                                |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                 |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟠 Medium | Only **3 tests**, all essentially testing that text is in the DOM. Tests are near-identical (render = heading visible). |
| 2   | 🟡 Low    | No test for the illustration slot (the icon/SVG rendering).                                                             |
| 3   | 🟡 Low    | No test for `IllustratedMessage` with a CTA/action button child.                                                        |
| 4   | 🟡 Low    | `'renders without crash'` and `'renders the heading'` are duplicate tests.                                              |

---

## Specific Fixes Required

### 1. Fix story illustrations

```tsx
import Search from '@spectrum-icons/workflow/Search';
import Error from '@spectrum-icons/workflow/Error';

export const NoResults: Story = {
    render: () => (
        <IllustratedMessage>
            <Search size="XXL" />
            <Heading>No results</Heading>
            <Content>Try adjusting your filters or search terms.</Content>
        </IllustratedMessage>
    ),
};

export const ErrorState: Story = {
    render: () => (
        <IllustratedMessage>
            <Alert size="XXL" />
            <Heading>Something went wrong</Heading>
            <Content>Refresh the page or contact support.</Content>
        </IllustratedMessage>
    ),
};
```

### 2. Add CTA story

```tsx
export const WithAction: Story = {
    render: () => (
        <IllustratedMessage>
            <Star size="XXL" />
            <Heading>No models yet</Heading>
            <Content>Create your first model to get started.</Content>
            <Button variant="accent">Create model</Button>
        </IllustratedMessage>
    ),
};
```

### 3. Strengthen tests

```tsx
it('renders with heading role', () => {
    renderIllustratedMessage();
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
});

it('renders with a CTA button', () => {
    render(
        <Provider theme={defaultTheme}>
            <IllustratedMessage>
                <Heading>Empty</Heading>
                <Content>Add items.</Content>
                <Button variant="accent">Add item</Button>
            </IllustratedMessage>
        </Provider>
    );
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
});
```

---

## Overall Rating: 🟡 Acceptable

Correct implementation. Fix story illustrations, add CTA story, export companion components from `index.ts`.
