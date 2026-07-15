import type { OpenCVTypes } from '../opencv/interfaces';
import { Tensor } from 'onnxruntime-web';

import { OpenCVPreprocessor, OpenCVPreprocessorConfig } from './pre-processing';
import { SegmentAnythingOutputError, SessionRunTimeoutError } from './errors';
import { type ModelSession } from './session';

type cv = OpenCVTypes.cv;

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
        let timeout: SessionRunTimeoutError | undefined;

        try {
            return await this.session.run({ x: result.tensor }, async (outputData, outputNames) => {
                try {
                    const outputName = outputNames[0];
                    if (!outputName) {
                        throw new SegmentAnythingOutputError('Segment Anything encoder produced no output');
                    }

                    const outputTensor = outputData[outputName];
                    if (!outputTensor) {
                        throw new SegmentAnythingOutputError(`Segment Anything encoder missing '${outputName}' output`);
                    }

                    const data = await outputTensor.getData();
                    if (!(data instanceof Float32Array)) {
                        throw new SegmentAnythingOutputError(
                            'Segment Anything encoder output must contain float32 data'
                        );
                    }

                    return {
                        encoderResult: {
                            data: new Float32Array(data),
                            dims: [...outputTensor.dims],
                            type: outputTensor.type as Tensor.Type,
                        },
                        originalWidth: initialImageData.width,
                        originalHeight: initialImageData.height,
                        newWidth: result.newWidth,
                        newHeight: result.newHeight,
                    };
                } finally {
                    this.disposeTensors(outputData);
                }
            });
        } catch (error) {
            if (error instanceof SessionRunTimeoutError) timeout = error;
            throw error;
        } finally {
            if (timeout) {
                void timeout.waitUntilSafe.then(
                    () => result.tensor.dispose(),
                    () => result.tensor.dispose()
                );
            } else {
                result.tensor.dispose();
            }
        }
    }

    private disposeTensors(outputData: Parameters<Parameters<ModelSession['run']>[1]>[0]): void {
        for (const tensor of new Set(Object.values(outputData))) tensor.dispose();
    }
}
