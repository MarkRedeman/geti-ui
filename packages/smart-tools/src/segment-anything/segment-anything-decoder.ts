import { Tensor } from 'onnxruntime-web';

import type { OpenCVTypes } from '../opencv/interfaces';
import { Point, ShapeType } from '../shared/interfaces';
import { isPointInShape } from '../utils/math';
import type { SegmentAnythingResult } from './interfaces';
import { PostProcessor } from './post-processing';
import { EncodingOutput } from './segment-anything-encoder';
import { type Session } from './session';

type cv = OpenCVTypes.cv;

type InteractiveAnnotationPoint = Point & { positive: boolean };

export interface SegmentAnythingPrompt {
    image: string | ArrayBuffer | undefined;
    points: InteractiveAnnotationPoint[] | undefined;
    boxes: Point[][] | undefined;
    outputConfig?: { type: ShapeType };
}

export class SegmentAnythingDecoder {
    constructor(
        private cv: cv,
        private session: Session
    ) {}

    public async process(encodingOutput: EncodingOutput, input: SegmentAnythingPrompt): Promise<SegmentAnythingResult> {
        const { masks, iouPredictions } = await this.processDecoder(
            { boxes: input.boxes ?? [], points: input.points ?? [] },
            encodingOutput
        );

        // With the `webgpu` EP, ORT returns GPU-backed tensors whose `.data` is
        // unavailable until downloaded. Materialize CPU data via `getData()`
        // before reading; on the CPU EP this resolves to the existing buffer.
        const iouData = (await iouPredictions.getData()) as ArrayLike<number>;
        const maskData = (await masks.getData()) as ArrayLike<number>;

        const maskIdx = this.getIndexOfMaskWithHighestConfidence(iouData, iouPredictions.dims);

        const size = masks.dims[2] * masks.dims[3];
        const maskOffset = maskIdx * size;
        const pixels = new Uint8ClampedArray(new ArrayBuffer(size));

        for (let y = 0; y < masks.dims[2]; y++) {
            for (let x = 0; x < masks.dims[3]; x++) {
                const value = Number(maskData[maskOffset + y * masks.dims[3] + x]);

                const idx = y * masks.dims[3] + x;
                pixels[idx] = value > 0 ? 255 : 0;
            }
        }

        const postProcessor = new PostProcessor(this.cv);

        const positivePoints = input.points?.filter(({ positive }) => positive) ?? [];

        const sizes = {
            height: masks.dims[2],
            width: masks.dims[3],
            originalWidth: encodingOutput.originalWidth + 1,
            originalHeight: encodingOutput.originalHeight + 1,
        };

        const results = postProcessor.maskToAnnotationShape(pixels, sizes, {
            ...(input.outputConfig ?? { type: 'polygon' }),
            shapeFilter: (shape) => positivePoints.some((point) => isPointInShape(shape, point)),
        });
        return results;
    }

    private getIndexOfMaskWithHighestConfidence(iouData: ArrayLike<number>, dims: readonly number[]) {
        let predictionIdx = 0;

        for (let p = 0; p < dims[1]; p++) {
            if (iouData[p] > iouData[predictionIdx]) {
                predictionIdx = p;
            }
        }

        return predictionIdx;
    }

    private async processDecoder(
        prompt: {
            points: InteractiveAnnotationPoint[];
            boxes: Point[][];
        },
        { encoderResult, originalWidth, originalHeight, newWidth, newHeight }: EncodingOutput
    ): Promise<{
        masks: Tensor;
        iouPredictions: Tensor;
        lowResMasks: Tensor;
    }> {
        const pointCoords: number[] = [];
        const pointLabels: number[] = [];

        const xRatio = newWidth / originalWidth;
        const yRatio = newHeight / originalHeight;

        for (const point of prompt.points) {
            pointCoords.push(point.x * xRatio);
            pointCoords.push(point.y * yRatio);
            pointLabels.push(point.positive ? 1 : 0);
        }

        if (prompt.boxes.length === 0) {
            pointCoords.push(0);
            pointCoords.push(0);
            pointLabels.push(-1);
        }

        for (const box of prompt.boxes) {
            pointCoords.push(box[0].x * xRatio);
            pointCoords.push(box[0].y * yRatio);
            pointLabels.push(2);
            pointCoords.push(box[1].x * xRatio);
            pointCoords.push(box[1].y * yRatio);
            pointLabels.push(3);
        }

        const ratio = 1024 / Math.max(originalHeight, originalWidth);
        const feeds: Record<string, Tensor> = {
            // `encoderResult` is a `SerializableTensor` (plain object) rather than a real
            // `ort.Tensor` — it may have crossed a Comlink/worker boundary via structured
            // clone, which strips the Tensor's class identity. Reconstruct a real Tensor
            // before feeding it to `session.run()`.
            image_embeddings: new Tensor(encoderResult.type, encoderResult.data, encoderResult.dims),
            // TODO: reuse the low_res_masks output, also use existing polygons?
            mask_input: new Tensor(new Float32Array(256 * 256).fill(1), [1, 1, 256, 256]),
            has_mask_input: new Tensor(new Float32Array(1).fill(0), [1]),
            orig_im_size: new Tensor(
                new Float32Array([Math.round(originalHeight * ratio), Math.round(originalWidth * ratio)]),
                [2]
            ),
            point_coords: new Tensor(new Float32Array(pointCoords), [1, pointCoords.length / 2, 2]),
            point_labels: new Tensor(new Float32Array(pointLabels), [1, pointLabels.length]),
        };

        const outputData = await this.session.run(feeds);

        return {
            masks: outputData['masks'],
            iouPredictions: outputData['iou_predictions'],
            lowResMasks: outputData['low_res_masks'],
        };
    }
}
