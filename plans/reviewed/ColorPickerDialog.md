# ColorPickerDialog — Peer Review

**File:** `packages/ui/src/components/ColorPickerDialog/ColorPickerDialog.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🔴 Needs significant fixes

---

## Summary

`ColorPickerDialog` is the most complex component in this review group — a fully custom composite component. It has three distinct categories of bugs: (1) **state sync bug** where `colorProp` updates after mount are silently ignored, (2) **architectural bypass** where it imports directly from `@adobe/react-spectrum` rather than from the library's own wrappers, and (3) **severely undertested** — only one test covers the trigger button, while the dialog's core colour-picking functionality is untested. Missing copyright header completes the list.

---

## 1. Code Quality & Type Safety

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1.1 | 🔴 High   | **Missing copyright header**. ✅ **Fixed:** copyright header added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 1.2 | 🔴 High   | **State sync bug**: `useState(() => colorProp ? parseColor(colorProp) : parseColor('#ff0000'))` uses `colorProp` only as the _initial_ state. If the parent re-renders with a different `color` prop, the internal `color` state is **not updated**. This is a controlled-input anti-pattern. Fix with `useEffect` or by restructuring as a fully controlled component. ✅ **Fixed:** `useEffect` added to sync `colorProp` changes into state.                                                                                                                      |
| 1.3 | 🔴 High   | **Architectural bypass**: The component imports `ColorArea`, `ColorField`, `ColorSlider`, `ColorSwatch`, `ColorSwatchPicker`, `ColorWheel`, `ActionButton`, `Button`, `Dialog`, `DialogTrigger`, `Heading`, `Content`, `ButtonGroup`, `Divider`, `Flex` **all directly from `@adobe/react-spectrum`** — bypassing every library wrapper. If any wrapper adds Geti-specific behaviour (theming, overrides), it is silently skipped. Import from the library's own components instead. ⏳ _Still open — all imports still come directly from `@adobe/react-spectrum`._ |
| 1.4 | 🟠 Medium | `isOpen` and `onOpenChange` are declared in `ColorPickerDialogProps` and spread via `...rest` onto `DialogTrigger`, but `label` and `color` are destructured out first. The remaining `rest` object type is too broad — it may contain props unrelated to `DialogTrigger`. Be explicit: type `rest` as `Partial<Pick<DialogTriggerProps, 'isOpen'                                                                                                                                                                                                                    | 'onOpenChange'>>`. |
| 1.5 | ✅        | `useState` lazy initialiser used correctly to avoid repeated `parseColor` on every render.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 1.6 | 🟡 Low    | `handleConfirm` is a closure over `color` — this is correct. But if `close()` is async or the dialog batches updates, there could be a stale closure edge case. Not urgent but worth noting.                                                                                                                                                                                                                                                                                                                                                                         |

**Fix (1.2):**

```ts
const [color, setColor] = useState(() => (colorProp ? parseColor(colorProp) : parseColor('#ff0000')));

// Sync when colorProp changes
useEffect(() => {
    if (colorProp) {
        setColor(parseColor(colorProp));
    }
}, [colorProp]);
```

**Fix (1.3) — example for importing from wrappers:**

```ts
// BEFORE (direct spectrum import):
import { ColorArea, ColorField, ColorSlider, ... } from '@adobe/react-spectrum';

// AFTER (through library wrappers):
import { ColorArea } from '../ColorArea/ColorArea';
import { ColorField } from '../ColorField/ColorField';
import { ColorSlider } from '../ColorSlider/ColorSlider';
import { ColorWheel } from '../ColorWheel/ColorWheel';
import { ColorSwatch } from '../color-swatch/ColorSwatch';
import { ColorSwatchPicker } from '../color-swatch/ColorSwatchPicker';
import { Flex } from '../Flex/Flex';
import { Divider } from '../Divider/Divider';
// Spectrum components without local wrappers (acceptable to import directly):
import { ActionButton, Button, Dialog, DialogTrigger, Heading, Content, ButtonGroup } from '@adobe/react-spectrum';
```

---

## 2. Accessibility

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                      |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | ✅        | `ActionButton` has `aria-label={label}` — the trigger is accessible.                                                                                                                                                                                                                                                                         |
| 2.2 | 🟠 Medium | `<span aria-hidden="true">{label}</span>` inside the `ActionButton` is correct — the visible label is hidden from AT since `aria-label` on the button takes precedence.                                                                                                                                                                      |
| 2.3 | 🟠 Medium | The `ColorSwatch` inside the trigger button has no `aria-label` — it will be announced by some screen readers as an unlabelled image. Since it's decorative (the button's `aria-label` already describes the purpose), it should have `aria-hidden="true"`. ⏳ _Still open — `<ColorSwatch color={color} size="S" />` has no `aria-hidden`._ |
| 2.4 | 🟡 Low    | The "Presets" section uses `<Heading level={4}>` directly — verify this is correct heading hierarchy in context. If the dialog heading is `<Heading>` (level 2 by default), jumping to level 4 skips level 3.                                                                                                                                |
| 2.5 | 🟡 Low    | No `aria-label` on any of the preset `ColorSwatch` items in `ColorSwatchPicker`. Each should have an accessible name (e.g. "Red", "Green"). ⏳ _Still open — preset swatches have no `aria-label`._                                                                                                                                          |
| 2.6 | ✅        | Dialog itself uses Spectrum's `Dialog` + `Heading` which handles `aria-labelledby` correctly.                                                                                                                                                                                                                                                |

**Fix (2.3):**

```tsx
<ColorSwatch color={color} size="S" aria-hidden="true" />
```

**Fix (2.5):**

```tsx
<ColorSwatch color="#ff0000" aria-label="Red" />
<ColorSwatch color="#00ff00" aria-label="Green" />
// etc.
```

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity   | Finding                                                                                 |
| --- | ---------- | --------------------------------------------------------------------------------------- |
| 3.1 | ✅         | JSDoc on component and all props.                                                       |
| 3.2 | ✅         | Two stories: Default, CustomLabel.                                                      |
| 3.3 | 🔴 Missing | No story demonstrating `onColorChange` callback result (use `action('onColorChange')`). |
| 3.4 | 🔴 Missing | No story for controlled `isOpen`/`onOpenChange`.                                        |
| 3.5 | 🟡 Low     | `parameters.a11y: {}` **absent**.                                                       |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                          |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅         | Trigger button renders with correct accessible label.                                                                            |
| 4.2 | 🔴 Missing | No test for **opening the dialog** (click trigger → dialog appears).                                                             |
| 4.3 | 🔴 Missing | No test for **Confirm flow** (select a colour → click Confirm → `onColorChange` fires with correct hex).                         |
| 4.4 | 🔴 Missing | No test for **Cancel flow** (dialog closes without calling `onColorChange`).                                                     |
| 4.5 | 🔴 Missing | No test for `colorProp` initialising internal state.                                                                             |
| 4.6 | 🔴 Missing | No test for `colorProp` change syncing state (the bug from 1.2 — this test would have caught it).                                |
| 4.7 | 🟡 Low     | Unused `React` import.                                                                                                           |
| 4.8 | 🟡 Low     | Only 1 test for the most complex component in this group. This is the most critically undertested component in the review batch. |

**Suggested tests:**

```ts
it('opens the dialog when trigger is clicked', async () => {
  render(<ThemeProvider><ColorPickerDialog label="Pick" /></ThemeProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Pick' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('calls onColorChange with hex on Confirm', async () => {
  const onChange = rstest.fn();
  render(<ThemeProvider><ColorPickerDialog color="#ff0000" onColorChange={onChange} /></ThemeProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Pick Color' }));
  await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(onChange).toHaveBeenCalledWith('#FF0000');
});

it('does not call onColorChange on Cancel', async () => {
  const onChange = rstest.fn();
  render(<ThemeProvider><ColorPickerDialog color="#ff0000" onColorChange={onChange} /></ThemeProvider>);
  await userEvent.click(screen.getByRole('button', { name: 'Pick Color' }));
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onChange).not.toHaveBeenCalled();
});
```

---

## Action Items

- [x] **Fix Critical**: Add `useEffect` to sync `colorProp` → `color` state (`Critical`). ✅ **Fixed:** `useEffect` syncs `colorProp` changes.
- [x] **Fix High**: Add copyright header (`High`). ✅ **Fixed:** copyright header added.
- [ ] **Fix High**: Import from library wrappers not directly from `@adobe/react-spectrum` (`High`). ⏳ _Still open — all imports remain direct from `@adobe/react-spectrum`._
- [ ] **Fix Medium**: Add `aria-hidden="true"` to trigger's decorative `ColorSwatch` (`Medium`). ⏳ _Still open — no `aria-hidden` on trigger `<ColorSwatch>`._
- [ ] **Fix Medium**: Add `aria-label` to all preset `ColorSwatch` items (`Medium`). ⏳ _Still open — preset swatches have no `aria-label`._
- [ ] **Fix Medium**: Tighten `...rest` type to only `isOpen` + `onOpenChange` (`Medium`). ⏳ _Still open._
- [ ] Add open-dialog, Confirm, and Cancel tests (`Critical`). ⏳ _Still open — only 1 test exists._
- [ ] Add `onColorChange` + `isOpen` Storybook stories (`Medium`). ⏳ _Still open._
- [ ] Add `parameters.a11y: {}` to stories (`Medium`). ⏳ _Still open._
- [ ] Remove unused `React` import (`Low`). ⏳ _Still open._
