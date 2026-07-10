# @geti-ui/smart-tools

Computer-vision tooling package for Intel Geti products.

`@geti-ui/smart-tools` provides browser-oriented OpenCV and ONNX-based tool integrations used by annotation and segmentation workflows.

> **Status:** Initial migration - package scaffold in progress.
> See [`plans/migrate-smart-tools.md`](../../plans/migrate-smart-tools.md) for the full migration plan.

---

## Install

```bash
npm install @geti-ui/smart-tools
```

## What this package includes

- OpenCV-backed tooling utilities and interfaces (`/opencv`, `/utils`, `/types`)
- ONNX Runtime Web model wrappers for:
    - RITM (`@geti-ui/smart-tools/ritm`)
    - Segment Anything (`@geti-ui/smart-tools/segment-anything`)
- Shared geometry and domain helpers for annotation-style toolchains

## Quick start

```ts
import { buildGrabcutInstance } from '@geti-ui/smart-tools';
import { buildRITMInstance, RITMModels } from '@geti-ui/smart-tools/ritm';
import { buildSegmentAnythingInstance, SegmentAnythingModels } from '@geti-ui/smart-tools/segment-anything';
```

## Configuring ONNX Runtime WASM binaries

`@geti-ui/smart-tools` uses `onnxruntime-web` for RITM and Segment Anything. This package doesn't
bundle or serve the ORT `.wasm`/`.mjs` artifacts itself — where they're hosted is an app build
concern, so it's delegated to the consuming application:

1. Copy the ORT wasm artifacts from `node_modules/onnxruntime-web/dist/` to wherever your app
   serves static assets from (e.g. via Rsbuild's `output.copy`).
2. Tell smart-tools where they live with `setOrtWasmPaths(...)`.

If you skip this, ORT will try to resolve the artifacts relative to its own bundle (or the default CDN). Configure `setOrtWasmPaths(...)` when your app copies/serves the ORT `.wasm`/`.mjs` artifacts from a different URL (otherwise ORT may fail to locate them at runtime).

Call `setOrtWasmPaths` before creating a `Session`, building a SAM instance, or loading RITM. The
argument is whatever ONNX Runtime's `env.wasm.wasmPaths` accepts: a string prefix/URL, a record
mapping each artifact filename to an explicit URL, or the `{ wasm }` shape used by
`onnxruntime-web` >= 1.24.

```ts
import { setOrtWasmPaths } from '@geti-ui/smart-tools';

// Files served at https://<your-app>/ort/<name>.wasm — note the trailing slash
setOrtWasmPaths('/ort/');
```

```ts
// Or point at explicit URLs per artifact (e.g. served from a CDN)
setOrtWasmPaths({
    'ort-wasm-simd-threaded.wasm': 'https://cdn.example.com/ort/ort-wasm-simd-threaded.wasm',
    'ort-wasm-simd-threaded.mjs': 'https://cdn.example.com/ort/ort-wasm-simd-threaded.mjs',
});
```

Pass `undefined` to clear the override and let ORT resolve the binaries relative to its own bundle
(or the default CDN).

Example Rsbuild copy config (`rsbuild.config.ts`):

```ts
export default defineConfig({
    output: {
        copy: [{ from: 'node_modules/onnxruntime-web/dist/*.{wasm,mjs}', to: 'ort/[name][ext]' }],
    },
});
```

## Configuring the OpenCV.js source

`@geti-ui/smart-tools` uses a custom-compiled `opencv.js` build for GrabCut, Intelligent Scissors,
Watershed, SSIM, RITM and Segment Anything. This package doesn't bundle or serve that binary itself — compile it
(see ["Compiling the OpenCV WASM binary"](#compiling-the-opencv-wasm-binary-manual) below) and copy
it into wherever your app serves static assets from, then tell smart-tools where it lives with
`setOpenCVSourceUrl(...)`.

Call `setOpenCVSourceUrl` once during startup, before using any OpenCV-backed tool. The argument can be

- a `URL` (recommended for cross-origin/CDN setups),
- an absolute URL string (`https://...`), an app-origin absolute path (`/opencv/opencv.js`),
  or a relative path string resolved against your app's origin (falling back to the smart-tools module URL when `location` is unavailable).

```ts
import { setOpenCVSourceUrl } from '@geti-ui/smart-tools';

// Served at https://<your-app>/opencv/opencv.js
setOpenCVSourceUrl('/opencv/opencv.js');
```

If you skip this, any OpenCV-backed tool throws a descriptive error the first time it tries to load
`opencv.js` — there is no default/CDN fallback, unlike ORT's wasm resolution.

Example Rsbuild copy config (`rsbuild.config.ts`):

```ts
export default defineConfig({
    output: {
        copy: [{ from: 'src/opencv/opencv.js', to: 'opencv/[name][ext]' }],
    },
});
```

## Execution providers (WebGPU vs CPU)

Segment Anything selects its ONNX Runtime execution providers automatically. WebGPU (via ORT's
threaded JSEP wasm) is dramatically faster for the SAM encoder, but that wasm requires
`SharedArrayBuffer`, which browsers only expose in **cross-origin-isolated** contexts.

smart-tools detects this at startup:

- In a cross-origin-isolated context, it requests `['webgpu', 'cpu']` with multi-threaded wasm.
- Otherwise (non-isolated tabs, embedded WebViews such as Tauri) it pins to a single-threaded
  `['cpu']` provider.

To enable the WebGPU path, the consuming app must:

1. Serve the app cross-origin isolated by sending these response headers on the document:
    - `Cross-Origin-Opener-Policy: same-origin`
    - `Cross-Origin-Embedder-Policy: require-corp`
2. Ship the threaded JSEP wasm artifact (`ort-wasm-simd-threaded.jsep.wasm` / `.mjs`). The
   `*.{wasm,mjs}` copy glob above already includes it.

If either is missing, smart-tools falls back to CPU automatically — no configuration needed. As a
final safety net, a runtime WebGPU/JSEP failure still triggers a one-time downgrade to a CPU-only
session, so a broken GPU driver can't wedge the tool.

## Examples and docs

- Installation: `documentation/docs/smart-tools/installation.mdx`
- OpenCV docs: `documentation/docs/smart-tools/opencv.mdx`
- GrabCut: `documentation/docs/smart-tools/grabcut.mdx`
- RITM: `documentation/docs/smart-tools/ritm.mdx`
- Segment Anything: `documentation/docs/smart-tools/segment-anything.mdx`

---

## Compiling the OpenCV WASM binary (manual)

The OpenCV JS binary is **not** checked into the repository and is not bundled/served by this
package. It must be compiled locally or obtained from the release artifacts, then copied into your
app and pointed at via `setOpenCVSourceUrl(...)` (see ["Configuring the OpenCV.js
source"](#configuring-the-opencvjs-source) above).

### Prerequisites

- **Docker**: used to run a deterministic Dockerfile-based build

### Steps

```bash
# From the repository root:
cd packages/smart-tools

# Run the build script (compiles OpenCV 4.9.0 with the configured allow list)
./scripts/compile-opencv-wasm.sh

# Override the target version (optional)
OPENCV_VERSION=4.9.0 ./scripts/compile-opencv-wasm.sh

# Override the emscripten Docker image (optional)
EMSCRIPTEN_IMAGE=emscripten/emsdk:3.1.25 ./scripts/compile-opencv-wasm.sh

# `--skip-cleanup` is accepted for backward compatibility (no-op now)
./scripts/compile-opencv-wasm.sh --skip-cleanup
```

The script will:

1. Build `scripts/opencv-build.Dockerfile` with pinned OpenCV + emscripten versions.
2. Use `scripts/opencv_js.config.py` (the whitelist config) in the image build.
3. Extract `/artifacts/opencv.js` (and optionally `opencv.wasm`) from the built image.
4. Copy outputs to `src/opencv/<version>/`.

### Dockerfile source of truth

`scripts/opencv-build.Dockerfile` is now the canonical OpenCV build definition used by local and CI automation.

### Whitelist configuration

`scripts/opencv_js.config.py` controls which OpenCV modules and functions are compiled into the binary.
Edit this file to add or remove functions - only include what the smart-tools package actually uses to keep the output size small.

### CI / release

An on-demand GitHub Actions workflow (planned) will build the artifact and attach it to releases with a versioned name:

```
opencv-<version>-<configSha>.js
```

This makes config changes traceable through artifact identity.

---

## Sub-packages

| Subpath                                 | Contents                            |
| --------------------------------------- | ----------------------------------- |
| `@geti-ui/smart-tools`                  | Main entry                          |
| `@geti-ui/smart-tools/opencv`           | OpenCV type interfaces              |
| `@geti-ui/smart-tools/utils`            | Geometry and tool utilities         |
| `@geti-ui/smart-tools/types`            | Shared domain types                 |
| `@geti-ui/smart-tools/ritm`             | RITM interactive segmentation model |
| `@geti-ui/smart-tools/segment-anything` | Segment Anything Model (SAM)        |

---

## Development

```bash
# Build
npm run build --workspace=@geti-ui/smart-tools

# Tests
npm run test --workspace=@geti-ui/smart-tools

# Type check
npm run type-check --workspace=@geti-ui/smart-tools

# Lint
npm run lint --workspace=@geti-ui/smart-tools

# Format check
npm run format:check --workspace=@geti-ui/smart-tools
```
