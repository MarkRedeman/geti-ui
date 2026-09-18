# syntax=docker/dockerfile:1.27@sha256:bde3983e9c939224420ddaf6b784cc30e09b035a4dea01f581230c50809f372e

ARG EMSCRIPTEN_IMAGE=emscripten/emsdk:6.0.9@sha256:96617f27fe16421588241def73908fd348a7f9d260440ed0d00b36dcf7a063cc
FROM ${EMSCRIPTEN_IMAGE} AS builder

ARG OPENCV_VERSION=4.9.0
WORKDIR /work

# Clone OpenCV source at pinned version.
RUN git clone --depth 1 --branch "${OPENCV_VERSION}" https://github.com/opencv/opencv.git /work/opencv

# Copy custom OpenCV JS whitelist config into OpenCV JS build location.
COPY opencv_js.config.py /work/opencv/platforms/js/opencv_js.config.py

# Build OpenCV JS/WASM bundle.
# Note: build_js.py orchestrates its own CMake invocation; wrapping it with
# `emcmake` causes incompatible argument injection.
RUN EM_CONFIG=/emsdk/.emscripten \
    EM_CACHE=/emsdk/upstream/emscripten/cache \
    python3 /work/opencv/platforms/js/build_js.py \
    /work/build \
    --build_wasm \
    --emscripten_dir /emsdk/upstream/emscripten \
    --config /work/opencv/platforms/js/opencv_js.config.py

# Collect deterministic output payload under /artifacts.
RUN mkdir -p /artifacts && \
    cp /work/build/bin/opencv.js /artifacts/opencv.js && \
    if [ -f /work/build/bin/opencv.wasm ]; then cp /work/build/bin/opencv.wasm /artifacts/opencv.wasm; fi

FROM scratch AS artifact
COPY --from=builder /artifacts/ /artifacts/
