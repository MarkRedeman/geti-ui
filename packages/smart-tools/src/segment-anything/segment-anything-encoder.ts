import type { OpenCVTypes } from '../opencv/interfaces';
import type * as Comlink from 'comlink';
import { Tensor } from 'onnxruntime-web';

import { OpenCVPreprocessor, OpenCVPreprocessorConfig } from './pre-processing';
import { type Session } from './session';

type cv = OpenCVTypes.cv;

type ModelSession = Session | Comlink.Remote<Session>;

// A plain-object representation of ort.Tensor that survives structured-clone
// (Comlink transfers between workers). ort.Tensor instances lose their class
// identity and `location` property when cloned, causing onnxruntime >=1.20 to
// throw "invalid data location: undefined".
export type SerializableTensor = {
    data: Float32Array;
    dims: number[];
    type: Tensor.Type;
};

export type EncodingOutput = {
    encoderResult: SerializableTensor;
    originalWidth: number;
    originalHeight: number;
    newWidth: number;
    newHeight: number;
};

export class SegmentAnythingEncoder {
    private preprocessor: OpenCVPreprocessor;

    constructor(
        cv: cv,
        config: OpenCVPreprocessorConfig,
        private session: ModelSession
    ) {
        this.preprocessor = new OpenCVPreprocessor(cv, config);
    }

    public async processEncoder(initialImageData: ImageData): Promise<EncodingOutput> {
        const result = this.preprocessor.process(initialImageData);
        console.time('[SAM] Encoding');
        const outputData = await this.session.run({ x: result.tensor });
        console.timeEnd('[SAM] Encoding');

        const outputNames = await this.session.outputNames();
        const gpuTensor = outputData[outputNames[0]];

        const originalWidth = initialImageData.width;
        const originalHeight = initialImageData.height;
        const newWidth = result.newWidth;
        const newHeight = result.newHeight;

        return {
            encoderResult: {
                // `getData()` materializes GPU-backed tensor data (WebGPU EP) into a
                // JS-owned Float32Array; on the CPU EP it resolves the existing buffer.
                data: (await gpuTensor.getData()) as Float32Array,
                dims: [...gpuTensor.dims],
                type: gpuTensor.type as Tensor.Type,
            },
            originalWidth,
            originalHeight,
            newWidth,
            newHeight,
        };
    }
}
