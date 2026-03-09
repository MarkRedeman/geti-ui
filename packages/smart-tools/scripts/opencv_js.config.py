# opencv_js.config.py
# ---------------------------------------------------------------------------
# OpenCV.js whitelist configuration for @geti/smart-tools.
#
# This file is passed to the OpenCV emscripten build via:
#   emcmake python3 platforms/js/build_js.py --config <this-file>
#
# Only the modules and functions listed here will be compiled into the
# output opencv.js bundle, keeping the binary size minimal.
#
# OpenCV version target: 4.9.0
# Emscripten version target: 3.1.25
#
# Reference: https://docs.opencv.org/4.x/d4/da1/tutorial_js_setup.html
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Core modules to include
# Modules not listed here are excluded from the build entirely.
# ---------------------------------------------------------------------------
white_list = {
    # --- Core ---
    "core": [
        "Mat",
        "MatVector",
        "Range",
        "Scalar",
        "Size",
        "Point",
        "Point2f",
        "Rect",
        "RotatedRect",
        "TermCriteria",
        # Memory helpers
        "matFromArray",
        "matFromImageData",
        "imread",
        "imshow",
        "imencode",
    ],
    # --- Image processing ---
    "imgproc": [
        # Color conversion
        "cvtColor",
        # Thresholding
        "threshold",
        "adaptiveThreshold",
        # Morphological ops
        "erode",
        "dilate",
        "morphologyEx",
        "getStructuringElement",
        # Contours
        "findContours",
        "drawContours",
        "contourArea",
        "arcLength",
        "approxPolyDP",
        "boundingRect",
        "convexHull",
        "moments",
        # Filtering
        "GaussianBlur",
        "medianBlur",
        "bilateralFilter",
        "blur",
        "Laplacian",
        "Sobel",
        "Canny",
        # Watershed
        "watershed",
        # GrabCut
        "grabCut",
        # Resize / geometric
        "resize",
        "warpAffine",
        "warpPerspective",
        "getPerspectiveTransform",
        "getRotationMatrix2D",
        # Histograms
        "calcHist",
        "equalizeHist",
        # Drawing
        "line",
        "circle",
        "rectangle",
        "fillPoly",
        "polylines",
        "putText",
        # Distance transform
        "distanceTransform",
        "connectedComponents",
        "connectedComponentsWithStats",
        # Intelligent scissors (live-wire) — graph segmentation
        "segmentation_IntelligentScissorsMB",
    ],
    # --- Segmentation ---
    "ximgproc": [
        # Superpixels
        "createSuperpixelSEEDS",
        "createSuperpixelSLIC",
    ],
    # --- Photo module (inpainting) ---
    "photo": [
        "inpaint",
        "fastNlMeansDenoising",
        "fastNlMeansDenoisingColored",
    ],
    # --- Image quality (SSIM) ---
    "quality": [
        "QualitySSIM",
        "QualitySSIM_compute",
    ],
}

# ---------------------------------------------------------------------------
# Additional configuration flags passed to the build system
# ---------------------------------------------------------------------------
# Disable OpenCL (not available in browser environment)
cmake_option_HAVE_OPENCL = False

# Disable video capture / GUI (no-op in browser)
cmake_option_WITH_FFMPEG = False
cmake_option_WITH_GSTREAMER = False
cmake_option_WITH_1394 = False
cmake_option_WITH_V4L = False
cmake_option_WITH_LIBV4L = False
cmake_option_WITH_DSHOW = False
cmake_option_WITH_MSMF = False
