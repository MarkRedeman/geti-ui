# ToggleButton — Peer Review

**Reviewed:** 2026-03-06  
**Reviewer:** Oracle  
**Files reviewed:**

- `packages/ui/src/components/ToggleButton/ToggleButton.tsx`
- `packages/ui/src/components/ToggleButton/ToggleButton.stories.tsx`
- `packages/ui/src/components/ToggleButton/ToggleButton.test.tsx`

---

## Summary

ToggleButton is the most minimal of the five components — a thin pass-through wrapper with no custom behaviour. It is clean and correct, but raises a legitimate architectural question: if no customisation is added, is this wrapper worth maintaining? The immediate issues are: no CSS module (unlike ActionButton), `React` is not imported in the test file (relying on ambient JSX transform — fine but inconsistent with other tests), the `aria-pressed` test assertion is too weak, and the component's empty `interface extends` pattern is a no-op that could use a comment justifying its existence.

**Rating: 🟢 Good — minor issues and open architectural question**

---

## Implementation Audit

### ✅ What's correct

| Area        | Finding                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------- |
| Type safety | Props fully typed via `SpectrumToggleButtonProps` with no narrowing.                          |
| Prop spread | `{...props}` forwards everything cleanly.                                                     |
| ARIA        | `ToggleButton` from Spectrum natively manages `aria-pressed`; the wrapper does not interfere. |
| JSDoc       | Present and accurate.                                                                         |

### ❌ Issues

**1. Empty interface extends (low severity / architecture concern)**

```tsx
export interface ToggleButtonProps extends SpectrumToggleButtonProps {}
```

An empty extending interface is a common "future extension" placeholder, but creates a subtle friction point: if no props are ever added, the re-alias provides no value and makes consumers wonder what was changed. Two acceptable alternatives:

```tsx
// Option A: type alias (signals "this is just a re-export")
export type ToggleButtonProps = SpectrumToggleButtonProps;

// Option B: keep interface but add a JSDoc comment explaining intent
/** @see SpectrumToggleButtonProps — extended here for future Geti-specific props */
export interface ToggleButtonProps extends SpectrumToggleButtonProps {}
```

**2. No CSS module (low severity)**

Unlike `ActionButton`, there is no `ToggleButton.module.css`. This is fine if no overrides are needed, but combined with the empty interface it signals a component that may not need to exist independently at all — or may be awaiting a planned customisation that should be documented.

**3. `aria-pressed` test is too weak (low severity)**

```tsx
// Current — only checks the attribute exists, not its value
expect(screen.getByRole('button')).toHaveAttribute('aria-pressed');
```

The Spectrum `ToggleButton` should render `aria-pressed="false"` when `defaultSelected={false}`. The test should verify the specific value and the toggle transition:

```tsx
expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
// After click:
expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
```

**4. Missing `React` import in test file (very low severity)**

Other test files (`Button.test.tsx`, `ActionButton.test.tsx`) import `React` explicitly. `ToggleButton.test.tsx` does not. This works with the modern JSX transform but is inconsistent with the project's style established in the other files.

---

## Documentation & Stories

### Stories (`ToggleButton.stories.tsx`)

| Check                                                       | Status |
| ----------------------------------------------------------- | ------ |
| CSF3 format                                                 | ✅     |
| Default story                                               | ✅     |
| Selected state story                                        | ✅     |
| Emphasized story                                            | ✅     |
| Quiet story                                                 | ✅     |
| Disabled story                                              | ✅     |
| Missing: controlled vs uncontrolled example                 | ❌     |
| Missing: `onChange` callback example                        | ❌     |
| Missing: icon-only toggle (e.g. bold/italic toolbar button) | ❌     |

The `Selected` story uses `isSelected={true}` but provides no `onChange`, making it a controlled component without a handler — this will cause a React warning in development. Should either use `defaultSelected={true}` for the uncontrolled variant, or supply a `onChange` handler.

### Tests (`ToggleButton.test.tsx`)

| Test                                        | Status                       |
| ------------------------------------------- | ---------------------------- |
| Renders without crash                       | ✅                           |
| Displays children text                      | ✅                           |
| `aria-pressed` attribute present            | ⚠️ Weak — see issue #3 above |
| `onChange` fires on click                   | ✅                           |
| `onChange` blocked when disabled            | ✅                           |
| Toggle state transition (false → true)      | ❌ Missing                   |
| Toggle state `aria-pressed` value assertion | ❌ Missing                   |
| Keyboard activation                         | ❌ Missing                   |

---

## TODO List

- [ ] **Strengthen `aria-pressed` test** — assert specific value `'false'` at mount and `'true'` after click.
- [ ] **Add toggle-state transition test** — click → assert `aria-pressed="true"`, click again → assert `aria-pressed="false"`.
- [ ] **Add keyboard interaction test** — `Space` key activates toggle.
- [ ] **Fix `Selected` story** — replace `isSelected={true}` with `defaultSelected={true}`, or add `onChange: () => {}` to prevent React controlled-component warning.
- [ ] **Add `onChange` callback story** — demonstrates logging or state management.
- [ ] **Add icon-only toggle story** with `aria-label`.
- [ ] **Justify or convert empty interface** — add a JSDoc comment on `ToggleButtonProps` explaining why it exists as an empty extension, or convert to a `type` alias.
- [ ] **Add `React` import to test file** for consistency with sibling test files.
- [ ] **Consider creating `ToggleButton.module.css`** as a placeholder with a comment if Geti-specific toggle styles are anticipated.

---

## Documentation Section

### Usage

```tsx
import { ToggleButton } from '@geti/ui';

// Uncontrolled (self-manages selected state)
<ToggleButton defaultSelected={false} onChange={(selected) => console.log(selected)}>
  Bold
</ToggleButton>

// Controlled
const [isBold, setIsBold] = useState(false);
<ToggleButton isSelected={isBold} onChange={setIsBold}>Bold</ToggleButton>

// Emphasized (fills with accent colour when selected)
<ToggleButton isEmphasized defaultSelected={false}>Emphasize</ToggleButton>

// Quiet (minimal visual weight)
<ToggleButton isQuiet>Quiet Toggle</ToggleButton>

// Icon-only (must supply aria-label)
<ToggleButton aria-label="Bold" isQuiet>
  <Bold />
</ToggleButton>
```

### API

| Prop              | Type                            | Default | Description                                     |
| ----------------- | ------------------------------- | ------- | ----------------------------------------------- |
| `isSelected`      | `boolean`                       | —       | Controlled selected state. Requires `onChange`. |
| `defaultSelected` | `boolean`                       | `false` | Uncontrolled initial selected state.            |
| `onChange`        | `(isSelected: boolean) => void` | —       | Fires when selected state changes.              |
| `isEmphasized`    | `boolean`                       | `false` | Fills button with accent colour when selected.  |
| `isQuiet`         | `boolean`                       | `false` | Reduces visual weight.                          |
| `isDisabled`      | `boolean`                       | `false` | Disables interaction.                           |

> All other `SpectrumToggleButtonProps` are accepted and forwarded.

### Accessibility

- Renders as `role="button"` with `aria-pressed` managed by React Spectrum.
- Keyboard: `Space` and `Enter` both toggle the state.
- For icon-only buttons, always supply an `aria-label`.
