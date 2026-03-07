# FileTrigger — Peer Review

**Reviewed:** 2026-03-06  
**Reviewer:** Oracle  
**Files reviewed:**

- `packages/ui/src/components/FileTrigger/FileTrigger.tsx`
- `packages/ui/src/components/FileTrigger/FileTrigger.stories.tsx`
- `packages/ui/src/components/FileTrigger/FileTrigger.test.tsx`

---

## Summary

FileTrigger is the only component in this group that wraps `react-aria-components` rather than `@adobe/react-spectrum`. This is architecturally correct — `FileTrigger` is a headless primitive that was never in Spectrum v3. The implementation is clean and the tests are the most thorough in the group, including a real file-upload interaction test. Primary issues: `console.log` left in a Storybook story, the story uses `@adobe/react-spectrum`'s `Button` instead of the Geti `Button`, the `onSelect` callback type is not tested for its argument value (only call count), and there is no coverage for the `defaultCamera` or drag-and-drop integration.

**Rating: 🟢 Good — a few polish items**

---

## Implementation Audit

### ✅ What's correct

| Area            | Finding                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Source library  | Correctly uses `react-aria-components` (not Spectrum v3) — appropriate for this headless primitive.              |
| Type import     | Uses `import type` for `FileTriggerProps` — good practice.                                                       |
| Prop spread     | Full pass-through via `{...props}`.                                                                              |
| JSDoc           | Accurate description of the component's role.                                                                    |
| Empty interface | Empty `interface extends` — same structural issue as ToggleButton/Link, but lower impact for a headless wrapper. |

### ❌ Issues

**1. Stories import `@adobe/react-spectrum` Button instead of `@geti/ui` Button (medium severity)**

```tsx
// Current
import { Button } from '@adobe/react-spectrum';
```

The stories should demonstrate `FileTrigger` being used with the design system's own `Button`:

```tsx
import { Button } from '../button/Button';
// or, if running in Storybook context with full library available:
import { Button } from '@geti/ui';
```

This is a documentation problem: it teaches consumers to combine raw Spectrum components with Geti wrappers, which defeats the purpose of the design system.

**2. `console.log` in the `WithOnSelect` story (medium severity)**

```tsx
onSelect={(files) => {
    if (files) {
        console.log('Selected files:', Array.from(files).map((f) => f.name));
    }
}}
```

`console.log` in production Storybook stories is unprofessional and will generate noise in the browser console during demos and automated a11y/visual tests. Replace with Storybook's `action()` helper:

```tsx
import { action } from '@storybook/addon-actions';
// or with Storybook 8+ globals:
onSelect={action('onSelect')}
```

**3. `onSelect` test only verifies call count, not argument (low severity)**

```tsx
// Current
expect(onSelect).toHaveBeenCalledOnce();
```

The `onSelect` callback receives a `FileList | null`. The test doesn't verify that the callback receives a `FileList` with the correct file. This is important because the adapter from `userEvent.upload` to `react-aria-components`' `onSelect` callback involves a translation that could be broken silently.

```tsx
expect(onSelect).toHaveBeenCalledWith(expect.any(FileList));
// or more specifically:
const [fileList] = onSelect.mock.calls[0];
expect(fileList[0].name).toBe('test.png');
```

**4. No test for `null` callback argument (low severity)**

The `onSelect` callback receives `null` when no files are selected (e.g. user cancels the dialog). This edge case is not tested.

**5. No `Spectrum Provider` wrapper in tests (low severity)**

Unlike `Button`, `ActionButton`, and `ToggleButton` tests, `FileTrigger.test.tsx` does not wrap in a `Provider`. This is correct — `FileTrigger` is a `react-aria-components` headless primitive and does not require the Spectrum `Provider`. This is fine but worth noting as intentional (a JSDoc comment in the test file would clarify this for future contributors).

**6. Missing `acceptDirectory` story and test (low severity)**

`AriaFileTriggerProps` supports `acceptDirectory` for folder uploads. This is not demonstrated in stories or covered in tests.

---

## Documentation & Stories

### Stories (`FileTrigger.stories.tsx`)

| Check                       | Status                           |
| --------------------------- | -------------------------------- |
| CSF3 format                 | ✅                               |
| Default story               | ✅                               |
| `acceptedFileTypes` story   | ✅                               |
| `allowsMultiple` story      | ✅                               |
| `onSelect` callback story   | ✅ (but has `console.log` issue) |
| Uses Geti `Button` as child | ❌ Uses raw Spectrum `Button`    |
| `acceptDirectory` story     | ❌ Missing                       |
| `action()` for callback     | ❌ Using `console.log` instead   |
| `defaultCamera` story       | ❌ Missing                       |

### Tests (`FileTrigger.test.tsx`)

| Test                                              | Status                                              |
| ------------------------------------------------- | --------------------------------------------------- |
| Renders without crash                             | ✅                                                  |
| Hidden `input[type=file]` present                 | ✅                                                  |
| `acceptedFileTypes` → `accept` attribute          | ✅                                                  |
| `allowsMultiple` → `multiple` attribute           | ✅                                                  |
| `onSelect` fires on file upload                   | ✅                                                  |
| `onSelect` receives correct `FileList` argument   | ❌ Missing                                          |
| `onSelect` called with `null` when cancelled      | ❌ Missing                                          |
| Keyboard: `Enter`/`Space` on trigger opens picker | ❌ Missing (hard to test without JSDOM limitations) |

---

## TODO List

- [ ] **Replace raw Spectrum `Button` in stories with Geti `Button`** — import from `../button/Button` or the library entry point.
- [ ] **Remove `console.log` from `WithOnSelect` story** — replace with Storybook `action()` helper.
- [ ] **Strengthen `onSelect` test** — assert the callback receives a `FileList` containing the uploaded file by name.
- [ ] **Add `null` argument test** — simulate dialog cancellation (or pass `null` directly to `onSelect`) and assert graceful handling.
- [ ] **Add `acceptDirectory` story and test** — demonstrate folder selection via `acceptDirectory` prop.
- [ ] **Add explanatory comment in test file** — note that `Provider` is intentionally absent because `FileTrigger` is a `react-aria-components` primitive.
- [ ] **Justify or convert empty interface** — same recommendation as ToggleButton and Link.
- [ ] **Consider adding a `DropZone` integration story** — `FileTrigger` + `DropZone` is a canonical usage pattern documented by react-aria.

---

## Documentation Section

### Usage

```tsx
import { FileTrigger, Button } from '@geti/ui';

// Basic file upload
<FileTrigger onSelect={(files) => console.log(files)}>
    <Button variant="accent">Upload file</Button>
</FileTrigger>

// Restrict to images
<FileTrigger acceptedFileTypes={['image/*']} onSelect={handleFiles}>
    <Button variant="accent">Upload image</Button>
</FileTrigger>

// Multiple files
<FileTrigger allowsMultiple onSelect={handleFiles}>
    <Button variant="accent">Upload files</Button>
</FileTrigger>

// Folder upload
<FileTrigger acceptDirectory onSelect={handleFiles}>
    <Button variant="accent">Upload folder</Button>
</FileTrigger>

// Camera capture (mobile)
<FileTrigger defaultCamera="environment" onSelect={handleFiles}>
    <Button variant="accent">Take photo</Button>
</FileTrigger>
```

### API

| Prop                | Type                                | Default | Description                                                                  |
| ------------------- | ----------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `onSelect`          | `(files: FileList \| null) => void` | —       | Called when the user confirms file selection. `null` if cancelled.           |
| `acceptedFileTypes` | `string[]`                          | —       | MIME types to accept (e.g. `['image/*', '.pdf']`). Maps to `<input accept>`. |
| `allowsMultiple`    | `boolean`                           | `false` | Allows selecting multiple files. Maps to `<input multiple>`.                 |
| `acceptDirectory`   | `boolean`                           | `false` | Allows selecting a directory.                                                |
| `defaultCamera`     | `'user' \| 'environment'`           | —       | On mobile, opens the specified camera (front/back).                          |
| `children`          | `ReactNode`                         | —       | The trigger element (typically a `Button`).                                  |

> All `AriaFileTriggerProps` from `react-aria-components` are accepted and forwarded.

### Accessibility

- The visible trigger (e.g. `Button`) retains full keyboard and screen reader support.
- The hidden `<input type="file">` is programmatically activated when the trigger is pressed.
- Keyboard: `Enter` or `Space` on the trigger element opens the native file picker.
- No additional ARIA attributes are needed — the trigger's own role and label suffice.

### Notes

- **No Spectrum Provider required**: Unlike most Geti UI components, `FileTrigger` wraps `react-aria-components` directly and does not require `ThemeProvider` or Spectrum's `Provider`.
- **Child must be pressable**: The child element must handle `onPress` events (any Spectrum/Aria interactive element or a DOM element with an appropriate `onClick`).
- **`onSelect` receives `null` on cancel**: Always guard against `null` in your callback.
