# Form Controls — Peer Review Summary

**Reviewed:** 2026-03-06  
**Components:** TextField, TextArea, NumberField, SearchField, PasswordField, Checkbox, CheckboxGroup, RadioGroup, Radio, Switch, Slider, RangeSlider, Picker, ComboBox, Form  
**Individual reports:** `reviewed/{ComponentName}.md`

---

## Overall Assessment

The group is **functionally correct and well-structured** — all components are properly typed, JSDoc is consistently present, Storybook stories use CSF3 format, and every component has a test file. The Spectrum delegation pattern is sound: accessibility fundamentals (labels, roles, keyboard) are correctly inherited from the upstream library.

There are **two recurring architectural problems** across the entire group, **one critical bug** in PasswordField, and **systematic gaps** in test coverage that need to be addressed before these components can be considered production-quality.

---

## Critical Issues (Must Fix)

### 🔴 C1 — PasswordField: Error prop does not set `aria-invalid` or `aria-describedby`

**File:** `PasswordField/PasswordField.tsx`

When the `error` prop is set, the underlying Spectrum TextField receives neither `validationState="invalid"` nor `errorMessage`. This means:

- The input border does not turn red
- `aria-invalid` is not set on the `<input>` — screen readers have no signal that the field is in error
- `aria-describedby` does not point to the custom error `<span>` — the relationship is structurally broken

**Fix:** Route `error` through Spectrum's own `errorMessage` + `validationState="invalid"`, removing the manual `<span role="alert">`.

---

### 🔴 C2 — Switch / Slider: `UNSAFE_style` used for token injection (violates AGENTS.md)

**Files:** `Switch/Switch.tsx`, `Slider/Slider.tsx`

Both components inject CSS custom properties via `UNSAFE_style`. AGENTS.md explicitly mandates `UNSAFE_className` for overrides. The correct fix is a CSS module:

```css
/* Switch.module.css */
.emphasized {
    --spectrum-switch-emphasized-track-color-selected: var(--energy-blue);
    /* ... */
}
```

```tsx
<SpectrumSwitch {...props} UNSAFE_className={props.isEmphasized ? styles.emphasized : undefined} />
```

---

### 🔴 C3 — CheckboxGroup stories import Geti `Checkbox` from wrong source

**File:** `CheckboxGroup/CheckboxGroup.stories.tsx` line 5

```ts
// Wrong — bypasses Geti wrapper
import { Checkbox } from '@adobe/react-spectrum';

// Correct
import { Checkbox } from '../Checkbox/Checkbox';
```

If `Checkbox` ever gains custom behaviour, stories won't reflect it.

---

## Recurring Low-Priority Issues (Affects All Components)

### 🟡 R1 — Empty `interface` extension pattern

All thin-wrapper components follow this pattern:

```ts
export interface TextFieldProps extends SpectrumTextFieldProps {}
```

An empty `interface` extension adds no value. Either:

- Use a `type` alias: `export type TextFieldProps = SpectrumTextFieldProps;`
- Or add at least one Geti-specific prop (or a comment placeholder for future additions)

**Components affected:** TextField, TextArea, NumberField, Checkbox, CheckboxGroup, RadioGroup, Radio, RangeSlider, Form, and others.

---

### 🟡 R2 — `onChange` tests assert invocation but not payload

Across TextField, TextArea, NumberField, and SearchField, the `onChange` tests only call `expect(onChange).toHaveBeenCalled()`. The component contract includes the _type_ of the callback argument:

| Component     | `onChange` signature        |
| ------------- | --------------------------- |
| TextField     | `(value: string) => void`   |
| NumberField   | `(value: number) => void`   |
| Picker        | `(key: Key) => void`        |
| RadioGroup    | `(value: string) => void`   |
| CheckboxGroup | `(value: string[]) => void` |

Tests should assert `toHaveBeenCalledWith(expectedValue)`.

---

### 🟡 R3 — Keyboard interaction tests are missing for interactive controls

The following components have **zero keyboard tests** despite keyboard being the primary WCAG 2.1 SC 2.1.1 interaction method:

| Component   | Missing keyboard test                          |
| ----------- | ---------------------------------------------- |
| Slider      | ArrowRight increments value                    |
| RangeSlider | ArrowRight/Left on each thumb                  |
| Picker      | Enter opens, Arrow navigates, Enter selects    |
| ComboBox    | Type to filter, Arrow navigates, Enter selects |
| RadioGroup  | ArrowDown/Up moves selection                   |
| Checkbox    | Space toggles                                  |

This is the **highest-priority test gap** across the group.

---

### 🟡 R4 — Storybook `parameters.a11y: {}` is empty

All stories set `parameters: { a11y: {} }` — this enables Storybook's axe-core integration but without any explicit rule configuration. Recommended baseline:

```ts
parameters: {
    a11y: {
        config: {
            rules: [{ id: 'label', enabled: true }];
        }
    }
}
```

---

## Per-Component Priority Matrix

| Component         | Critical          | High                                  | Medium                     | Low                 |
| ----------------- | ----------------- | ------------------------------------- | -------------------------- | ------------------- |
| **PasswordField** | C1 (aria-invalid) | aria-describedby test, layout div     | hint association           | i18n, px tokens     |
| **Switch**        | C2 (UNSAFE_style) | isReadOnly test                       | EmphasizedSelected story   | style assertion     |
| **Slider**        | C2 (UNSAFE_style) | onChange test, keyboard test          | focus-visible token        | orientation story   |
| **CheckboxGroup** | C3 (wrong import) | defaultValue test                     | multi-select onChange test | WithError story     |
| **ComboBox**      | —                 | onInputChange test, keyboard test     | duplicate test removal     | Section re-export   |
| **RadioGroup**    | —                 | arrow-key test, mutual-exclusion test | WithError story            | controlled story    |
| **Picker**        | —                 | keyboard test, onSelectionChange test | fragile label test         | Section re-export   |
| **Form**          | —                 | onSubmit test, WithValidation story   | aria-label guidance        | isDisabled breadth  |
| **NumberField**   | —                 | onChange test                         | min/max test               | getByRole fragility |
| **RangeSlider**   | —                 | onChange test, keyboard test          | boundary test              | token parity        |
| **TextField**     | —                 | aria-required test                    | description test           | type story          |
| **TextArea**      | —                 | WithError story, error test           | aria-required test         | parity              |
| **SearchField**   | —                 | onClear test                          | clear disappears test      | alert() in story    |
| **Checkbox**      | —                 | isIndeterminate test                  | Space key test             | controlled story    |

---

## Recommended Fix Order

1. **PasswordField C1** — accessibility correctness bug, affects all users of assistive tech
2. **Switch + Slider C2** — convention violation, creates tech debt against future CSS-module migration
3. **CheckboxGroup C3** — library consistency, low-effort fix
4. **Keyboard tests across the board** — biggest test coverage gap, batch-addressable
5. **Empty interface cleanup** — mechanical, do in a single sweep commit
6. **onChange payload assertions** — one-line fix per test, batch-addressable
7. **Storybook story gaps** — can be addressed incrementally alongside feature work
