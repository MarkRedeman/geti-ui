# Link — Peer Review

**Reviewed:** 2026-03-06  
**Reviewer:** Oracle  
**Files reviewed:**

- `packages/ui/src/components/Link/Link.tsx`
- `packages/ui/src/components/Link/Link.stories.tsx`
- `packages/ui/src/components/Link/Link.test.tsx`

---

## Summary

Like ToggleButton, this is a zero-customisation pass-through wrapper. It is correct and functional. The key architectural concerns are the same: the empty interface, no CSS module, and no override behaviour. Additionally, the stories expose `overBackground` as a variant option — but this is a Spectrum legacy variant that the `Button` component explicitly excluded. This inconsistency in policy across the component group needs resolution. The tests are the weakest in the group: variant tests don't assert anything meaningful, and keyboard navigation and `target`/`rel` security are not tested.

**Rating: 🟡 Acceptable — inconsistency with Button policy and weak tests**

---

## Implementation Audit

### ✅ What's correct

| Area        | Finding                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| Type safety | Props fully typed via `SpectrumLinkProps`.                                    |
| Prop spread | Clean pass-through with `{...props}`.                                         |
| ARIA        | `SpectrumLink` renders as `role="link"` natively; wrapper does not interfere. |
| JSDoc       | Present and accurate.                                                         |

### ❌ Issues

**1. `overBackground` variant inconsistency with Button (medium severity)**

`Button` explicitly excludes legacy variants `cta` and `overBackground` via the `VariantWithoutLegacy` type. `Link` re-exposes `overBackground` without comment. This creates an inconsistent API contract: consumers may reasonably ask whether `overBackground` is intentionally supported on `Link` or was an oversight.

`SpectrumLink` variant type is: `'primary' | 'secondary' | 'overBackground'`. Unlike `Button`, there is no `cta` on Link — but `overBackground` is still a legacy-feeling variant. A decision should be made and documented: either exclude `overBackground` consistently, or document that `Link` intentionally preserves it.

**2. Empty interface extends (low severity)**

Same issue as `ToggleButton`:

```tsx
export interface LinkProps extends SpectrumLinkProps {}
```

A type alias or a justifying comment would be cleaner.

**3. No CSS module (low severity)**

No `Link.module.css` exists. Acceptable if no overrides are needed, but the absence is notable given that links are often custom-styled in application UIs (underline removal, custom colour).

**4. No router integration (medium severity — undocumented)**

`SpectrumLink` accepts an `elementType` prop and passes arbitrary props through to the underlying element, which is how React Spectrum enables router integration. This is the canonical Spectrum pattern for using `<Link href="...">` with React Router. This component provides no guidance on this pattern, and there is no story demonstrating it. Consumers new to Spectrum will not know how to use this for in-app navigation.

---

## Documentation & Stories

### Stories (`Link.stories.tsx`)

| Check                                  | Status                             |
| -------------------------------------- | ---------------------------------- |
| CSF3 format                            | ✅                                 |
| Default story                          | ✅                                 |
| All variants covered                   | ✅                                 |
| `isQuiet` story                        | ✅                                 |
| `overBackground` with dark background  | ✅ (uses `parameters.backgrounds`) |
| Missing: `target="_blank"` with `rel`  | ❌                                 |
| Missing: router/SPA navigation example | ❌                                 |
| Missing: disabled/inactive link        | ❌                                 |

The `OverBackground` story correctly sets a dark background via `parameters.backgrounds` — this is the right approach and worth noting as a positive pattern.

### Tests (`Link.test.tsx`)

| Test                                          | Status                                                  |
| --------------------------------------------- | ------------------------------------------------------- |
| Renders without crash                         | ✅                                                      |
| Displays children text                        | ✅                                                      |
| `href` attribute forwarded                    | ✅                                                      |
| Renders `primary` variant                     | ⚠️ Only checks element exists — no meaningful assertion |
| Renders `secondary` variant                   | ⚠️ Only checks element exists — no meaningful assertion |
| Renders `isQuiet`                             | ⚠️ Only checks element exists — no meaningful assertion |
| `target` / `rel` forwarding                   | ❌ Missing                                              |
| Keyboard navigation (Enter activates)         | ❌ Missing                                              |
| `target="_blank"` includes `rel="noreferrer"` | ❌ Missing security check                               |

The three variant/quiet tests are effectively smoke tests — they verify the component doesn't throw with those props, but assert nothing about the rendered output. Since class-name assertions are prohibited, these should at least be converted to checking rendered text or ARIA attributes.

---

## TODO List

- [ ] **Resolve `overBackground` policy** — either exclude it (matching `Button`'s pattern) or explicitly document that `Link` preserves it. If kept, add a note to the JSDoc.
- [ ] **Strengthen variant tests** — the three variant render tests currently assert only `toBeInTheDocument()`. Either remove them (they duplicate the smoke test) or add meaningful assertions (e.g. verify accessible name is still present).
- [ ] **Add `target`/`rel` forwarding test** — assert `target="_blank"` and `rel="noopener noreferrer"` are applied to the anchor element.
- [ ] **Add keyboard navigation test** — press `Enter` on the link element; assert it is activated (e.g. focus-event or click handler fires).
- [ ] **Add a story for external links** — demonstrate `target="_blank"` with proper `rel` for security.
- [ ] **Add a router navigation story** — demonstrate `elementType` with a React Router `<Link>` component.
- [ ] **Justify or convert empty interface** — same recommendation as ToggleButton.
- [ ] **Consider `Link.module.css`** — even a placeholder with a comment noting "no overrides currently" clarifies intent.

---

## Documentation Section

### Usage

```tsx
import { Link } from '@geti/ui';

// Basic external link
<Link href="https://example.com">Learn more</Link>

// Variants
<Link variant="primary" href="/docs">Primary</Link>
<Link variant="secondary" href="/docs">Secondary</Link>

// Quiet (underline hidden until hover)
<Link isQuiet href="/docs">Quiet link</Link>

// External link (always include rel for security)
<Link href="https://external.com" target="_blank" rel="noopener noreferrer">
  Open in new tab
</Link>

// Router integration (React Router example)
import { Link as RouterLink } from 'react-router-dom';
<Link elementType={RouterLink} href="/dashboard">Go to Dashboard</Link>
```

### API

| Prop          | Type                                           | Default     | Description                                                            |
| ------------- | ---------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `href`        | `string`                                       | —           | URL the link navigates to.                                             |
| `variant`     | `'primary' \| 'secondary' \| 'overBackground'` | `'primary'` | Visual style.                                                          |
| `isQuiet`     | `boolean`                                      | `false`     | Removes underline until hover.                                         |
| `target`      | `string`                                       | —           | `_blank`, `_self`, etc.                                                |
| `rel`         | `string`                                       | —           | Link relationship. Use `'noopener noreferrer'` with `target="_blank"`. |
| `elementType` | `ElementType`                                  | `'a'`       | Override the rendered element (e.g. React Router `Link`).              |

> All other `SpectrumLinkProps` are accepted and forwarded.

### Accessibility

- Renders as `role="link"` by default.
- Keyboard: `Enter` activates the link.
- Always provide visible link text (not just "click here").
- For `target="_blank"` links, include `rel="noopener noreferrer"` to prevent tab-nabbing attacks.

### Notes on `overBackground` variant

The `overBackground` variant is present in `SpectrumLinkProps` and is exposed by this component. It is intended for links rendered over a coloured/image background. Note that `Button` explicitly excludes this variant — if your team's policy is to deprecate `overBackground`, this component should be updated to match.
