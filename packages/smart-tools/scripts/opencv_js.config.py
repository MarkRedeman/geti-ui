#!/usr/bin/env python3
# OpenCV.js whitelist configuration for @geti/smart-tools.

# OpenCV's JS bindings generator expects `white_list` to be produced via
# `makeWhiteList([...])` and include root-level functions under the '' key.

web_gui = {
    "": [
        # Common image/pre/post-processing helpers
        "rectangle",
        "resize",
        "findContours",
        "contourArea",
        "approxPolyDP",
        "cvtColor",
        "polylines",
        "threshold",
        "watershed",
        "grabCut",
        "bitwise_or",
        "flip",
        "circle",
        "add",
        "subtract",
        "divide",
        "exp",
        "split",
        "boundingRect",
        "normalize",
        "matchTemplate",
        "pointPolygonTest",
        "applyColorMap",
        "copyMakeBorder",
        "blobFromImage",
        "minAreaRect",
    ],
    # Used by intelligent scissors (magic wand)
    "segmentation_IntelligentScissorsMB": [
        "IntelligentScissorsMB",
        "setGradientMagnitudeMaxLimit",
        "setEdgeFeatureCannyParameters",
        "applyImage",
        "buildMap",
        "getContour",
    ],
    "DescriptorMatcher": ["clone"],
}

white_list = makeWhiteList([web_gui])

# Additional CMake options supported by OpenCV's build script
cmake_option_HAVE_OPENCL = False
cmake_option_WITH_FFMPEG = False
cmake_option_WITH_GSTREAMER = False
cmake_option_WITH_1394 = False
cmake_option_WITH_V4L = False
cmake_option_WITH_LIBV4L = False
cmake_option_WITH_DSHOW = False
cmake_option_WITH_MSMF = False
