# packages/ui/src/theme/

## Responsibility

The `theme/` module is the **single source of truth for Geti's visual identity**. It customises Adobe React Spectrum's design-token system to produce Geti's dark-first palette, typography, spacing, and component-level colour overrides. Every component in the library inherits these tokens automatically through the React context set by `ThemeProvider`.

Files in this folder:

| File                     | Purpose                                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `ThemeProvider.tsx`      | React component — wraps Spectrum's `Provider` with `getiTheme`, `colorScheme="dark"`, `scale="medium"`, `locale="en-US"`      |
| `theme.ts`               | Assembles the `getiTheme` object by merging Spectrum's `defaultTheme` layers with Geti overrides                              |
| `geti-global.module.css` | Global tokens applied to `.spectrum` — brand colours, animation durations, shimmer keyframe, typography overrides             |
| `geti-dark.module.css`   | Dark-mode tokens applied to `.spectrum--dark` — Geti's complete gray ramp, blues, semantic colours, component-level overrides |
| `geti-light.module.css`  | Light-mode token overrides (currently minimal; dark is the primary palette)                                                   |
| `geti-medium.module.css` | Medium-scale token overrides (touch/desktop breakpoint)                                                                       |
| `geti-large.module.css`  | Large-scale token overrides (accessibility/large-text scale)                                                                  |

---

## Design

### Spectrum's Theme model

Adobe React Spectrum's `Provider` accepts a `Theme` object with five CSS-module layers:

```ts
type Theme = {
    global: CSSModule; // always applied
    dark: CSSModule; // applied when colorScheme="dark"
    light: CSSModule; // applied when colorScheme="light"
    medium: CSSModule; // applied at medium scale
    large: CSSModule; // applied at large scale
};
```

Each `CSSModule` is a map of class names exported from a `.module.css` file. Spectrum adds those class names to the root DOM node when it renders, making all `var(--spectrum-*)` tokens inside those selectors available to every descendant.

### `mergeClasses` — additive override strategy

Geti does not replace Spectrum's default theme; it **extends** it. `theme.ts` exports a `mergeClasses` utility:

```ts
function mergeClasses(defaultObj: CSSModule = {}, customObj: CSSModule = {}): CSSModule {
    const merged = { ...defaultObj };
    for (const key in customObj) {
        if (merged[key]) {
            merged[key] = `${merged[key]} ${customObj[key]}`; // concatenate classes
        } else {
            merged[key] = customObj[key];
        }
    }
    return merged;
}
```

This concatenates Geti's class names onto Spectrum's for every matched key, so both sets of CSS variables are in scope simultaneously. Geti's declarations win via cascade order (Geti's classes come last in the string).

### Token hierarchy in `geti-global.module.css`

The global file applies to `.spectrum` (always) and defines:

- **Brand palette** — `--energy-blue`, `--energy-blue-shade`, `--brand-coral-cobalt`, `--brand-daisy`, `--brand-moss`, `--brand-rust` and their tints/shades.
- **Semantic overrides** — maps `--spectrum-global-color-positive/negative/informative/warning` to Geti brand colours.
- **Component-level overrides** — typography weights for action buttons and tabs, dialog title size, tooltip background, status light dot colours, treeview sizing.
- **Animation tokens** — full set of `--spectrum-global-animation-duration-*` and easing function variables.
- **`@keyframes shimmer`** — used by `Skeleton` for its background-position animation.
- **`.geti-card-button:focus-visible`** — energy-blue focus ring for `Card`'s interactive button.

### Token hierarchy in `geti-dark.module.css`

The dark file applies to `.spectrum--dark` and defines:

- **Gray ramp** — Geti's custom 12-stop gray ramp (`gray-50` → `gray-900`), darker and more blue-tinted than Spectrum's default.
- **Blue ramp** — shifted toward Geti's energy-blue hue.
- **Overlay/shadow aliases** — `--spectrum-alias-background-color-modal-overlay`, dropshadow, hover/active highlights.
- **Component colours** — tabs selection indicator (`--spectrum-tabs-*-selection-indicator-color`), tray background, well background/border.
- **Toast backgrounds** — each toast variant (`negative`, `neutral`, `info`, `warning`) mapped to Geti brand colours.
- **Date picker placeholder** — `--react-spectrum-datepicker-placeholder-color` adjusted for contrast.

### `ThemeProvider` — the single required wrapper

All Geti components **must be rendered inside `ThemeProvider`**. It provides:

- The Geti theme object (merged token sets)
- `colorScheme="dark"` — dark mode is the default and primary
- `scale="medium"` — desktop scale
- `locale="en-US"` — I18n baseline

```tsx
<ThemeProvider>
    <App />
</ThemeProvider>
```

Callers can override any `Provider` prop (e.g. `locale`, `colorScheme`) by spreading additional props, since `ThemeProviderProps` re-exports `ComponentProps<typeof Provider>`.

---

## Flow

1. `ThemeProvider` renders once at the application root.
2. Spectrum's `Provider` attaches the merged CSS class names to a root `div`.
3. All `var(--spectrum-*)` and `var(--energy-blue)` etc. tokens resolve for every descendant component.
4. Components reference tokens via Spectrum style props (translated internally) or directly in `UNSAFE_style`/CSS modules.

---

## Integration

- **Consumed by**: every component in the library — they all implicitly depend on `ThemeProvider` being in the tree.
- **Documentation examples**: rendered through the docs app, which wraps examples with `ThemeProvider` so components use Geti tokens consistently.
- **Application entry**: consuming applications must render `<ThemeProvider>` as their outermost component (or at least above any Geti UI components).
- **Token consumption pattern**:
    - Spectrum components: consume `--spectrum-*` tokens transparently via Spectrum's internal styling.
    - Custom components (`Tag`, `Skeleton`, `AvatarGroup`, etc.): reference `var(--spectrum-global-color-*)` and `var(--energy-blue)` directly in inline `CSSProperties` or CSS modules.
