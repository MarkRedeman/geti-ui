import { describe, expect, it, rstest } from '@rstest/core';

import type { OpenCVTypes } from '../opencv/interfaces';
import { OpenCVPreprocessor, OpenCVPreprocessorConfig } from './pre-processing';

class Mat {
    data32F = new Float32Array();
    delete = rstest.fn();

    constructor(
        public rows: number,
        public cols: number
    ) {}

    clone() {
        return new Mat(this.rows, this.cols);
    }

    convertTo() {}
    setTo() {}
}

const config: OpenCVPreprocessorConfig = {
    normalize: { enabled: true },
    resize: true,
    size: 1024,
    squareImage: false,
    pad: true,
    padSize: 1024,
};

const createCv = (blobLength = 3 * 1024 * 1024) => {
    const sizes: Array<{ width: number; height: number }> = [];
    const cv = {
        BORDER_CONSTANT: 0,
        COLOR_RGBA2RGB: 0,
        CV_32F: 0,
        INTER_LANCZOS4: 0,
        Scalar: class {},
        Size: class {
            constructor(
                public width: number,
                public height: number
            ) {
                sizes.push({ width, height });
            }
        },
        blobFromImage: () => Object.assign(new Mat(1, 1), { data32F: new Float32Array(blobLength) }),
        copyMakeBorder: (
            _source: Mat,
            destination: Mat,
            _top: number,
            bottom: number,
            _left: number,
            right: number
        ) => {
            destination.rows += bottom;
            destination.cols += right;
        },
        cvtColor: () => undefined,
        matFromImageData: (image: ImageData) => new Mat(image.height, image.width),
        resize: (_source: Mat, destination: Mat, size: { width: number; height: number }) => {
            destination.cols = size.width;
            destination.rows = size.height;
        },
    };

    return { cv: cv as unknown as OpenCVTypes.cv, sizes };
};

describe('OpenCVPreprocessor', () => {
    it.each([
        [0, 10],
        [10, 0],
    ])('rejects an image with dimensions %sx%s before OpenCV', (width, height) => {
        const matFromImageData = rstest.fn();
        const preprocessor = new OpenCVPreprocessor({ matFromImageData } as unknown as OpenCVTypes.cv, config);

        expect(() => preprocessor.process({ width, height } as ImageData)).toThrow(
            'image dimensions must be positive and finite'
        );
        expect(matFromImageData).not.toHaveBeenCalled();
    });

    it('reports blob data that does not match the declared tensor shape', () => {
        const { cv } = createCv(3);
        const preprocessor = new OpenCVPreprocessor(cv, config);

        expect(() => preprocessor.process({ width: 10, height: 10 } as ImageData)).toThrow(
            'input shape requires 3145728 values, received 3'
        );
    });

    it('keeps extreme-aspect resize dimensions positive and emits the expected tensor shape', () => {
        const { cv, sizes } = createCv();
        const result = new OpenCVPreprocessor(cv, config).process({ width: 4000, height: 1 } as ImageData);

        expect(sizes[0]).toEqual({ width: 1024, height: 1 });
        expect(result.newWidth).toBe(1024);
        expect(result.newHeight).toBe(1);
        expect(result.tensor.dims).toEqual([1, 3, 1024, 1024]);
        result.tensor.dispose();
    });
});
