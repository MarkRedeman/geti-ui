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

| Subpath                              | Contents                            |
| ------------------------------------ | ----------------------------------- |
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
