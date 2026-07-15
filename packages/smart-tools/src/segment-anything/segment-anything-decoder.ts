import { Tensor } from 'onnxruntime-web';

import type { OpenCVTypes } from '../opencv/interfaces';
import { Point, ShapeType } from '../shared/interfaces';
import { isPointInShape } from '../utils/math';
import { SegmentAnythingOutputError, SegmentAnythingValidationError, SessionRunTimeoutError } from './errors';
import type { SegmentAnythingResult } from './interfaces';
import { PostProcessor } from './post-processing';
import { EncodingOutput } from './segment-anything-encoder';
import { type ModelSession } from './session';

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
        private session: ModelSession
    ) {}

    public async process(encodingOutput: EncodingOutput, input: SegmentAnythingPrompt): Promise<SegmentAnythingResult> {
        const feeds = this.createFeeds({ boxes: input.boxes ?? [], points: input.points ?? [] }, encodingOutput);
        let timeout: SessionRunTimeoutError | undefined;

        try {
            const { maskHeight, maskWidth, pixels } = await this.session.run(feeds, async (outputData) => {
                try {
                    return await this.materializeMask(outputData);
                } finally {
                    this.disposeTensors(outputData);
                }
            });

            const positivePoints = input.points?.filter(({ positive }) => positive) ?? [];
            return new PostProcessor(this.cv).maskToAnnotationShape(
                pixels,
                {
                    height: maskHeight,
                    width: maskWidth,
                    originalWidth: encodingOutput.originalWidth + 1,
                    originalHeight: encodingOutput.originalHeight + 1,
                },
                {
                    ...(input.outputConfig ?? { type: 'polygon' }),
                    shapeFilter: (shape) => positivePoints.some((point) => isPointInShape(shape, point)),
                }
            );
        } catch (error) {
            if (error instanceof SessionRunTimeoutError) timeout = error;
            throw error;
        } finally {
            if (timeout) {
                void timeout.waitUntilSafe.then(
                    () => this.disposeTensors(feeds),
                    () => this.disposeTensors(feeds)
                );
            } else {
                this.disposeTensors(feeds);
            }
        }
    }

    private async materializeMask(outputData: Parameters<Parameters<ModelSession['run']>[1]>[0]): Promise<{
        maskHeight: number;
        maskWidth: number;
        pixels: Uint8ClampedArray;
    }> {
        const masks = outputData['masks'];
        const iouPredictions = outputData['iou_predictions'];

        if (!masks) throw new SegmentAnythingOutputError("Segment Anything decoder missing 'masks' output");
        if (!iouPredictions) {
            throw new SegmentAnythingOutputError("Segment Anything decoder missing 'iou_predictions' output");
        }
        if (masks.type !== 'float32' || iouPredictions.type !== 'float32') {
            throw new SegmentAnythingOutputError('Segment Anything decoder outputs must contain float32 data');
        }
        if (masks.dims.length !== 4 || iouPredictions.dims.length !== 2) {
            throw new SegmentAnythingOutputError('Segment Anything decoder returned invalid output ranks');
        }

        const maskCount = masks.dims[1];
        const maskHeight = masks.dims[2];
        const maskWidth = masks.dims[3];
        const predictionCount = iouPredictions.dims[1];
        if (
            masks.dims[0] !== 1 ||
            iouPredictions.dims[0] !== 1 ||
            !this.isPositiveInteger(maskCount) ||
            maskCount !== predictionCount ||
            !this.isPositiveInteger(maskHeight) ||
            !this.isPositiveInteger(maskWidth)
        ) {
            throw new SegmentAnythingOutputError('Segment Anything decoder returned incompatible output dimensions');
        }

        const iouData = await iouPredictions.getData();
        const maskData = await masks.getData();
        if (Array.isArray(iouData) || Array.isArray(maskData)) {
            throw new SegmentAnythingOutputError('Segment Anything decoder outputs must contain numeric data');
        }
        if (iouData.length !== predictionCount) {
            throw new SegmentAnythingOutputError('Segment Anything decoder returned incomplete confidence data');
        }

        const maskIdx = this.getIndexOfMaskWithHighestConfidence(iouData as ArrayLike<number>, iouPredictions.dims);
        const size = maskHeight * maskWidth;
        if (maskData.length !== maskCount * size) {
            throw new SegmentAnythingOutputError('Segment Anything decoder returned incomplete mask data');
        }

        const maskOffset = maskIdx * size;
        const pixels = new Uint8ClampedArray(size);
        for (let y = 0; y < maskHeight; y++) {
            for (let x = 0; x < maskWidth; x++) {
                pixels[y * maskWidth + x] = Number(maskData[maskOffset + y * maskWidth + x]) > 0 ? 255 : 0;
            }
        }

        return { maskHeight, maskWidth, pixels };
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

    private createFeeds(
        prompt: {
            points: InteractiveAnnotationPoint[];
            boxes: Point[][];
        },
        { encoderResult, originalWidth, originalHeight, newWidth, newHeight }: EncodingOutput
    ): Record<string, Tensor> {
        this.validateEncodingOutput(encoderResult, originalWidth, originalHeight, newWidth, newHeight);
        const pointCoords: number[] = [];
        const pointLabels: number[] = [];

        const xRatio = newWidth / originalWidth;
        const yRatio = newHeight / originalHeight;

        for (const point of prompt.points) {
            this.validatePoint(point);
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
            if (box.length < 2) throw new SegmentAnythingValidationError('Segment Anything boxes require two points');
            this.validatePoint(box[0]);
            this.validatePoint(box[1]);
            pointCoords.push(box[0].x * xRatio);
            pointCoords.push(box[0].y * yRatio);
            pointLabels.push(2);
            pointCoords.push(box[1].x * xRatio);
            pointCoords.push(box[1].y * yRatio);
            pointLabels.push(3);
        }

        const ratio = 1024 / Math.max(originalHeight, originalWidth);
        const feeds: Record<string, Tensor> = {};
        try {
            // Reconstruct the structured-cloned encoder result as a real ORT tensor.
            feeds.image_embeddings = new Tensor(encoderResult.type, encoderResult.data, encoderResult.dims);
            feeds.mask_input = new Tensor(new Float32Array(256 * 256).fill(1), [1, 1, 256, 256]);
            feeds.has_mask_input = new Tensor(new Float32Array(1).fill(0), [1]);
            feeds.orig_im_size = new Tensor(
                new Float32Array([
                    Math.max(1, Math.round(originalHeight * ratio)),
                    Math.max(1, Math.round(originalWidth * ratio)),
                ]),
                [2]
            );
            feeds.point_coords = new Tensor(new Float32Array(pointCoords), [1, pointCoords.length / 2, 2]);
            feeds.point_labels = new Tensor(new Float32Array(pointLabels), [1, pointLabels.length]);
            return feeds;
        } catch (error) {
            this.disposeTensors(feeds);
            throw error;
        }
    }

    private validateEncodingOutput(encoderResult: EncodingOutput['encoderResult'], ...dimensions: number[]): void {
        if (dimensions.some((dimension) => !Number.isFinite(dimension) || dimension <= 0)) {
            throw new SegmentAnythingValidationError(
                'Segment Anything encoding dimensions must be positive and finite'
            );
        }
        if (!(encoderResult.data instanceof Float32Array) || encoderResult.type !== 'float32') {
            throw new SegmentAnythingValidationError('Segment Anything encoder result must contain float32 data');
        }
        if (
            encoderResult.dims.length === 0 ||
            encoderResult.dims.some((dimension) => !this.isPositiveInteger(dimension)) ||
            encoderResult.dims.reduce((size, dimension) => size * dimension, 1) !== encoderResult.data.length
        ) {
            throw new SegmentAnythingValidationError('Segment Anything encoder result shape does not match its data');
        }
    }

    private validatePoint(point: Point): void {
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
            throw new SegmentAnythingValidationError('Segment Anything prompt coordinates must be finite');
        }
    }

    private isPositiveInteger(value: number | undefined): value is number {
        return value !== undefined && Number.isInteger(value) && value > 0;
    }

    private disposeTensors(tensors: Record<string, Tensor> | undefined): void {
        if (!tensors) return;
        for (const tensor of new Set(Object.values(tensors))) tensor.dispose();
    }
}
