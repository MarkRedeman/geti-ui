#!/usr/bin/env bash
set -euo pipefail

OPENCV_VERSION="${OPENCV_VERSION:-4.9.0}"
EMSCRIPTEN_IMAGE="${EMSCRIPTEN_IMAGE:-emscripten/emsdk:3.1.25}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_DIR="${PACKAGE_ROOT}/src/opencv/${OPENCV_VERSION}"
OUTPUT_FILE="${OUTPUT_DIR}/opencv.js"
DOCKERFILE_PATH="${SCRIPT_DIR}/opencv-build.Dockerfile"
IMAGE_TAG="geti-smart-tools-opencv-build:${OPENCV_VERSION}"
CONTAINER_NAME=""

while [[ $# -gt 0 ]]; do
	case "$1" in
	--opencv-version)
		OPENCV_VERSION="$2"
		OUTPUT_DIR="${PACKAGE_ROOT}/src/opencv/${OPENCV_VERSION}"
		OUTPUT_FILE="${OUTPUT_DIR}/opencv.js"
		shift 2
		;;
	--skip-cleanup)
		# kept for backward compatibility; no-op with Dockerfile flow
		shift
		;;
	-h | --help)
		echo "Usage: ./scripts/compile-opencv-wasm.sh [--opencv-version <version>] [--skip-cleanup]"
		exit 0
		;;
	*)
		echo "Unknown argument: $1" >&2
		exit 1
		;;
	esac
done

cleanup() {
	if [[ -n "${CONTAINER_NAME}" ]]; then
		docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
	fi
}
trap cleanup EXIT INT TERM

build_image() {
	echo "[opencv-build] Building Docker image from ${DOCKERFILE_PATH} ..."
	docker build \
		--file "${DOCKERFILE_PATH}" \
		--build-arg "OPENCV_VERSION=${OPENCV_VERSION}" \
		--build-arg "EMSCRIPTEN_IMAGE=${EMSCRIPTEN_IMAGE}" \
		--target artifact \
		--tag "${IMAGE_TAG}" \
		"${SCRIPT_DIR}"
	echo "[opencv-build] Docker build complete."
}

copy_output() {
	CONTAINER_NAME="opencv-artifact-${OPENCV_VERSION}-$$"
	docker create --name "${CONTAINER_NAME}" --entrypoint /bin/sh "${IMAGE_TAG}" >/dev/null

	mkdir -p "${OUTPUT_DIR}"
	docker cp "${CONTAINER_NAME}:/artifacts/opencv.js" "${OUTPUT_FILE}"

	if docker cp "${CONTAINER_NAME}:/artifacts/opencv.wasm" "${OUTPUT_DIR}/opencv.wasm" >/dev/null 2>&1; then
		echo "[opencv-build] Copied opencv.wasm -> ${OUTPUT_DIR}/opencv.wasm"
	else
		rm -f "${OUTPUT_DIR}/opencv.wasm"
	fi

	docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
	CONTAINER_NAME=""

	echo "[opencv-build] Copied opencv.js -> ${OUTPUT_FILE}"
}

main() {
	echo "[opencv-build] === OpenCV WASM Build ==="
	echo "[opencv-build] Version:          ${OPENCV_VERSION}"
	echo "[opencv-build] Emscripten image: ${EMSCRIPTEN_IMAGE}"
	echo "[opencv-build] Output:           ${OUTPUT_FILE}"
	echo ""

	build_image
	copy_output

	echo ""
	echo "[opencv-build] === Build SUCCESS ==="
	echo "[opencv-build] Artifact: ${OUTPUT_FILE}"
}

main "$@"
