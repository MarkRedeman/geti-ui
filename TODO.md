# TODO

- Color picker dialog is not working, when clicking the color it gives:

```
  at $25a25ac0d1624665$export$57bc203e1c9c6d44 (/static/js/async/vendors-node_modules_pnpm_react-aria_interactions_3_27_1_react-dom_18_3_1_react_18_3_1__react-b0a905.iframe.bundle.js:82252:18))
  at ColorSlider (/static/js/async/vendors-node_modules_pnpm_react-spectrum_checkbox_3_10_7__react-spectrum_provider_3_10_14_rea-9cff82.iframe.bundle.js:29870:79))
  at renderWithHooks (/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:16009:18))
  at updateForwardRef (/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:19763:20))
  at beginWork (/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:22193:16))
  at beginWork$1 (/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:27983:14))
  at performUnitOfWork (/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:27114:12))
  at workLoopSync (/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:27023:5))
  at renderRootSync (/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:26991:7))
```

- Color Thumb is not rendering:

```
string is not defined
The component failed to render properly, likely due to a configuration issue in Storybook. Here are some common causes and how you can address them:

Missing Context/Providers: You can use decorators to supply specific contexts or providers, which are sometimes necessary for components to render correctly. For detailed instructions on using decorators, please visit the Decorators documentation.
Misconfigured Webpack or Vite: Verify that Storybook picks up all necessary settings for loaders, plugins, and other relevant parameters. You can find step-by-step guides for configuring Webpack or Vite with Storybook.
Missing Environment Variables: Your Storybook may require specific environment variables to function as intended. You can set up custom environment variables as outlined in the Environment Variables documentation.
ReferenceError: string is not defined
    at _createMdxContent (http://localhost:6006/static/js/async/src_components_form_pickers_ColorThumb_ColorThumb_mdx-node_modules_pnpm_react-spectrum_layout-9b6bbd.iframe.bundle.js:106:18)
    at MDXContent (http://localhost:6006/static/js/async/src_components_form_pickers_ColorThumb_ColorThumb_mdx-node_modules_pnpm_react-spectrum_layout-9b6bbd.iframe.bundle.js:167:8)
    at renderWithHooks (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:16009:18)
    at mountIndeterminateComponent (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:20621:13)
    at beginWork (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:22144:16)
    at beginWork$1 (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:27983:14)
    at performUnitOfWork (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:27114:12)
    at workLoopSync (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:27023:5)
    at renderRootSync (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:26991:7)
    at recoverFromConcurrentError (http://localhost:6006/static/js/vendors-node_modules_pnpm_react_18_3_1_node_modules_react_jsx-dev-runtime_js-node_modules_pnp-3f26b3.iframe.bundle.js:26407:20)
```

- Calendar was not updated
- RangeCalendar was not updated
- ColorArea was not updated
- ColorField was not updated
- ColorPickerDialog was not updated
- ColorSlider was not updated
- ColorWheel was not updated
- ColorThumb was not updated
- Datefield was not updated
- DateField was not updated
- TimeField was not updated
- DatePicker was not updated
- DateRangePicker was not updated
- Picker was not updated
- ColorSwatch was not updated
- ColorSwatchPicker was not updated
- Tag was not updated
- VirtualizedHorizontalGrid was not updated
- VirtualizedListLayout was not updated
- CustomPopover was not updated
- DialogContainer was not updated
- FullscreenAction was not updated
- Badge was not updated
- InlineAlert was not updated
- IntelBrandedLoading was not updated
- Loading was not updated
- Meter was not updated
- ProgressBar was not updated
- ProgressCircle was not updated
- Skeleton was not updated
- StatusLight was not updated
- Toast was not updated
- Link was not updated
- Card was not updated
