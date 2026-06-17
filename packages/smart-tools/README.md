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

## Configuring ONNX Runtime WebAssembly paths (required for RITM & SAM)

RITM and Segment Anything run their models with [`onnxruntime-web`](https://www.npmjs.com/package/onnxruntime-web).
ONNX Runtime ships its WebAssembly binaries as **separate files** that it fetches at
runtime — they are **not** inlined into the JavaScript bundle. This package
**cannot** know how your app bundles or serves those files, so you must:

1. Copy the ORT artifacts into a folder your app serves, and
2. Tell smart-tools where they live with `setOrtWasmPaths(...)`.

If you skip this, model creation fails at runtime (ORT can't locate its `.wasm`
binaries) — there is no working default for a bundled application.

### Step 1 — Copy the ORT artifacts into a served folder

`onnxruntime-web` (>= 1.24) may request any of these four files, depending on the
execution provider it selects at runtime. **All four must be reachable** — you do
**not** choose JSEP vs CPU yourself; ORT picks the right one:

| File                               | Build               | Used when                                              |
| ---------------------------------- | ------------------- | ------------------------------------------------------ |
| `ort-wasm-simd-threaded.jsep.wasm` | WebGPU + CPU (JSEP) | `webgpu` EP active in a cross-origin-isolated context  |
| `ort-wasm-simd-threaded.jsep.mjs`  | WebGPU + CPU (JSEP) | loader for the JSEP build                              |
| `ort-wasm-simd-threaded.wasm`      | CPU-only            | CPU fallback (e.g. non-cross-origin-isolated contexts) |
| `ort-wasm-simd-threaded.mjs`       | CPU-only            | loader for the CPU build                               |

For **Rsbuild** (used by the Geti apps), copy them in `rsbuild.config.ts`:

```ts
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
    output: {
        copy: [
            // Serve all ORT artifacts under /ort/<name>
            { from: 'node_modules/onnxruntime-web/dist/*.wasm', to: 'ort/[name][ext]' },
            { from: 'node_modules/onnxruntime-web/dist/*.mjs', to: 'ort/[name][ext]' },
        ],
    },
});
```

### Step 2 — Point smart-tools at that folder (once, at startup)

Call `setOrtWasmPaths` before creating a `Session`, building a SAM instance, or
loading RITM. The argument is whatever ONNX Runtime's `env.wasm.wasmPaths`
accepts — typically a URL prefix the four files are served under:

```ts
import { setOrtWasmPaths } from '@geti-ui/smart-tools';

// Files served at https://<your-app>/ort/<name>.wasm — note the trailing slash
setOrtWasmPaths('/ort/');
```

You can also pass a per-file record if you need explicit URLs (e.g. a CDN):

```ts
setOrtWasmPaths({
    'ort-wasm-simd-threaded.jsep.wasm': 'https://cdn.example.com/ort/ort-wasm-simd-threaded.jsep.wasm',
    'ort-wasm-simd-threaded.jsep.mjs': 'https://cdn.example.com/ort/ort-wasm-simd-threaded.jsep.mjs',
    'ort-wasm-simd-threaded.wasm': 'https://cdn.example.com/ort/ort-wasm-simd-threaded.wasm',
    'ort-wasm-simd-threaded.mjs': 'https://cdn.example.com/ort/ort-wasm-simd-threaded.mjs',
});
```

Pass `undefined` to clear the override and let ORT resolve relative to its own
bundle (the default CDN) — convenient for a quick prototype, but not recommended
for production or offline/Tauri builds.

### Step 3 (optional) — Enable WebGPU + multithreading

The JSEP/WebGPU build and multithreaded CPU need `SharedArrayBuffer`, which
requires a **cross-origin-isolated** context. Serve your app with these headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Without them (or in Tauri's WebView), smart-tools automatically falls back to
single-threaded CPU — no extra configuration needed, just slower inference.

## Examples and docs

- Installation: `documentation/docs/smart-tools/installation.mdx`
- OpenCV docs: `documentation/docs/smart-tools/opencv.mdx`
- GrabCut: `documentation/docs/smart-tools/grabcut.mdx`
- RITM: `documentation/docs/smart-tools/ritm.mdx`
- Segment Anything: `documentation/docs/smart-tools/segment-anything.mdx`

---

## Compiling the OpenCV WASM binary (manual)

The OpenCV JS binary (`src/opencv/4.9.0/opencv.js`) is **not** checked into the repository.
It must be compiled locally or obtained from the release artifacts.

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
