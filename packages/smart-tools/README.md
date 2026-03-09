# @geti/smart-tools

Computer-vision runtime library for Intel Geti products.

Provides OpenCV WASM-backed segmentation tools and ONNX AI models for use in browser and Node.js environments.

> **Status:** Initial migration — package scaffold in progress.
> See [`plans/migrate-smart-tools.md`](../../plans/migrate-smart-tools.md) for the full migration plan.

---

## Install

```bash
npm install @geti/smart-tools
```

---

## Compiling the OpenCV WASM binary (manual)

The OpenCV JS binary (`src/opencv/4.9.0/opencv.js`) is **not** checked into the repository.
It must be compiled locally or obtained from the release artifacts.

### Prerequisites

- **Docker** — used to run the emscripten build in an isolated container
- **git** — used to clone the OpenCV source at the pinned version

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

# Keep the cloned source tree after the build (for debugging)
./scripts/compile-opencv-wasm.sh --skip-cleanup
```

The script will:
1. Clone `https://github.com/opencv/opencv.git` at the pinned tag into a temp directory.
2. Copy `scripts/opencv_js.config.py` (the allow-list config) into the build context.
3. Run the emscripten Docker image to build `opencv.js` with WASM support.
4. Copy the output to `src/opencv/<version>/opencv.js` (and `opencv.wasm` if present).

### Allow-list configuration

`scripts/opencv_js.config.py` controls which OpenCV modules and functions are compiled into the binary.
Edit this file to add or remove functions — only include what the smart-tools package actually uses to keep the output size small.

### CI / release

An on-demand GitHub Actions workflow (planned) will build the artifact and attach it to releases with a versioned name:

```
opencv-<version>-<configSha>.js
```

This makes config changes traceable through artifact identity.

---

## Sub-packages

| Subpath | Contents |
|---|---|
| `@geti/smart-tools` | Main entry |
| `@geti/smart-tools/opencv` | OpenCV type interfaces |
| `@geti/smart-tools/utils` | Geometry and tool utilities |
| `@geti/smart-tools/types` | Shared domain types |
| `@geti/smart-tools/ritm` | RITM interactive segmentation model |
| `@geti/smart-tools/segment-anything` | Segment Anything Model (SAM) |

---

## Development

```bash
# Build
npm run build --workspace=@geti/smart-tools

# Tests
npm run test --workspace=@geti/smart-tools

# Type check
npm run type-check --workspace=@geti/smart-tools

# Lint
npm run lint --workspace=@geti/smart-tools
```
