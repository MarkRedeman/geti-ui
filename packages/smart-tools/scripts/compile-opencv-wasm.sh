#!/usr/bin/env bash
# compile-opencv-wasm.sh
# ---------------------------------------------------------------------------
# Deterministic OpenCV WASM/JS build for @geti/smart-tools.
#
# Usage:
#   ./scripts/compile-opencv-wasm.sh [--opencv-version <version>] [--skip-cleanup]
#
# Prerequisites:
#   - docker (with buildx / emscripten/emsdk image)
#   - git
#
# Output:
#   packages/smart-tools/src/opencv/<OPENCV_VERSION>/opencv.js
# ---------------------------------------------------------------------------
set -euo pipefail

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
OPENCV_VERSION="${OPENCV_VERSION:-4.9.0}"
EMSCRIPTEN_IMAGE="${EMSCRIPTEN_IMAGE:-emscripten/emsdk:3.1.25}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_DIR="${PACKAGE_ROOT}/src/opencv/${OPENCV_VERSION}"
OUTPUT_FILE="${OUTPUT_DIR}/opencv.js"
CONFIG_FILE="${SCRIPT_DIR}/opencv_js.config.py"
WORK_DIR=""
SKIP_CLEANUP=false

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case "$1" in
    --opencv-version)
        OPENCV_VERSION="$2"
        OUTPUT_DIR="${PACKAGE_ROOT}/src/opencv/${OPENCV_VERSION}"
        OUTPUT_FILE="${OUTPUT_DIR}/opencv.js"
        shift 2
        ;;
    --skip-cleanup)
        SKIP_CLEANUP=true
        shift
        ;;
    -h | --help)
        sed -n '/^# Usage/,/^$/p' "$0"
        exit 0
        ;;
    *)
        echo "Unknown argument: $1" >&2
        exit 1
        ;;
    esac
done

# ---------------------------------------------------------------------------
# Cleanup trap
# ---------------------------------------------------------------------------
cleanup() {
    if [[ "${SKIP_CLEANUP}" == "false" && -n "${WORK_DIR}" && -d "${WORK_DIR}" ]]; then
        echo "[opencv-build] Cleaning up temp dir: ${WORK_DIR}"
        rm -rf "${WORK_DIR}"
    fi
}
trap cleanup EXIT INT TERM

# ---------------------------------------------------------------------------
# Prerequisite checks
# ---------------------------------------------------------------------------
check_prerequisites() {
    local missing=()

    if ! command -v docker &>/dev/null; then
        missing+=("docker")
    fi

    if ! command -v git &>/dev/null; then
        missing+=("git")
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "[opencv-build] ERROR: Missing required tools: ${missing[*]}" >&2
        echo "[opencv-build] Please install the missing prerequisites and try again." >&2
        exit 1
    fi

    if ! docker info &>/dev/null; then
        echo "[opencv-build] ERROR: Docker daemon is not running or not accessible." >&2
        exit 1
    fi

    if [[ ! -f "${CONFIG_FILE}" ]]; then
        echo "[opencv-build] ERROR: OpenCV JS config not found at: ${CONFIG_FILE}" >&2
        echo "[opencv-build] Expected: packages/smart-tools/scripts/opencv_js.config.py" >&2
        exit 1
    fi
}

# ---------------------------------------------------------------------------
# Clone OpenCV
# ---------------------------------------------------------------------------
clone_opencv() {
    WORK_DIR="$(mktemp -d)"
    echo "[opencv-build] Cloning OpenCV ${OPENCV_VERSION} into ${WORK_DIR} ..."
    git clone \
        --depth 1 \
        --branch "${OPENCV_VERSION}" \
        https://github.com/opencv/opencv.git \
        "${WORK_DIR}/opencv"
    echo "[opencv-build] Clone complete."
}

# ---------------------------------------------------------------------------
# Prepare config
# ---------------------------------------------------------------------------
prepare_config() {
    echo "[opencv-build] Copying opencv_js.config.py into build context ..."
    cp "${CONFIG_FILE}" "${WORK_DIR}/opencv/platforms/js/opencv_js.config.py"
}

# ---------------------------------------------------------------------------
# Run Docker emscripten build
# ---------------------------------------------------------------------------
run_build() {
    echo "[opencv-build] Starting Docker emscripten build (image: ${EMSCRIPTEN_IMAGE}) ..."
    docker run --rm \
        -v "${WORK_DIR}/opencv:/src" \
        "${EMSCRIPTEN_IMAGE}" \
        emcmake python3 /src/platforms/js/build_js.py \
        --build_wasm \
        --config /src/platforms/js/opencv_js.config.py \
        /build
    echo "[opencv-build] Docker build complete."
}

# ---------------------------------------------------------------------------
# Copy output artifact
# ---------------------------------------------------------------------------
copy_output() {
    local built_js="${WORK_DIR}/opencv/build_wasm/bin/opencv.js"

    # Some emscripten builds place output in /build — check both locations
    if [[ ! -f "${built_js}" ]]; then
        built_js="${WORK_DIR}/opencv/build/bin/opencv.js"
    fi

    if [[ ! -f "${built_js}" ]]; then
        echo "[opencv-build] ERROR: Built opencv.js not found in expected locations." >&2
        echo "[opencv-build] Searched:" >&2
        echo "[opencv-build]   ${WORK_DIR}/opencv/build_wasm/bin/opencv.js" >&2
        echo "[opencv-build]   ${WORK_DIR}/opencv/build/bin/opencv.js" >&2
        exit 1
    fi

    mkdir -p "${OUTPUT_DIR}"
    cp "${built_js}" "${OUTPUT_FILE}"

    # Also copy the accompanying .wasm file if present
    local built_wasm="${built_js%.js}.wasm"
    if [[ -f "${built_wasm}" ]]; then
        cp "${built_wasm}" "${OUTPUT_DIR}/opencv.wasm"
        echo "[opencv-build] Copied opencv.wasm -> ${OUTPUT_DIR}/opencv.wasm"
    fi

    echo "[opencv-build] Copied opencv.js -> ${OUTPUT_FILE}"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
main() {
    echo "[opencv-build] === OpenCV WASM Build ==="
    echo "[opencv-build] Version:          ${OPENCV_VERSION}"
    echo "[opencv-build] Emscripten image: ${EMSCRIPTEN_IMAGE}"
    echo "[opencv-build] Output:           ${OUTPUT_FILE}"
    echo ""

    check_prerequisites
    clone_opencv
    prepare_config
    run_build
    copy_output

    echo ""
    echo "[opencv-build] === Build SUCCESS ==="
    echo "[opencv-build] Artifact: ${OUTPUT_FILE}"
}

main "$@"
