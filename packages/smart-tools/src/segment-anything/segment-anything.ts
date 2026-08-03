import type { OpenCVTypes } from '../opencv/interfaces';

import { SegmentAnythingResult } from './interfaces';
import { OpenCVPreprocessorConfig } from './pre-processing';
import { RecoveringSessionHandle } from './recovering-session-handle';
import { SegmentAnythingDecoder, SegmentAnythingPrompt } from './segment-anything-decoder';
import { EncodingOutput, SegmentAnythingEncoder } from './segment-anything-encoder';
import type { SessionInitOptions } from './session';

type cv = typeof OpenCVTypes;
type SessionKey = 'encoder' | 'decoder';

export type SegmentAnythingInitOptions = Pick<SessionInitOptions, 'executionProviders' | 'runTimeoutMs'>;

export class SegmentAnythingModel {
    private handles = new Map<SessionKey, RecoveringSessionHandle>();
    private modelPaths: Map<string, string>;
    private preProcessorConfig: OpenCVPreprocessorConfig;

    public constructor(
        private cv: cv,
        modelPaths: Map<string, string>,
        preProcessorConfig: OpenCVPreprocessorConfig
    ) {
        this.modelPaths = modelPaths;
        this.preProcessorConfig = preProcessorConfig;
    }

    public async init(
        algorithm: 'SEGMENT_ANYTHING_DECODER' | 'SEGMENT_ANYTHING_ENCODER',
        options?: SegmentAnythingInitOptions
    ): Promise<void> {
        const sessionKey: SessionKey = algorithm === 'SEGMENT_ANYTHING_ENCODER' ? 'encoder' : 'decoder';
        let handle = this.handles.get(sessionKey);
        if (!handle) {
            const modelPath = this.modelPaths.get(sessionKey);
            if (!modelPath) {
                throw new Error(`Segment Anything ${sessionKey} model path is not configured`);
            }

            handle = new RecoveringSessionHandle(modelPath);
            this.handles.set(sessionKey, handle);
        }

        await handle.init(options);
    }

    public async processEncoder(initialImageData: ImageData): Promise<EncodingOutput> {
        return this.getHandle('encoder').execute((session) =>
            new SegmentAnythingEncoder(this.cv, this.preProcessorConfig, session).processEncoder(initialImageData)
        );
    }

    public async processDecoder(
        encodingOutput: EncodingOutput,
        input: SegmentAnythingPrompt
    ): Promise<SegmentAnythingResult> {
        const output = await this.getHandle('decoder').execute((session) =>
            new SegmentAnythingDecoder(this.cv, session).process(encodingOutput, input)
        );

        if (output.shapes.length === 0) {
            return {
                areas: [],
                maxContourIdx: 0,
                shapes: [],
            };
        }

        return {
            areas: [output.areas[output.maxContourIdx]],
            maxContourIdx: output.maxContourIdx,
            shapes: [output.shapes[output.maxContourIdx]],
        };
    }

    private getHandle(sessionKey: SessionKey): RecoveringSessionHandle {
        const handle = this.handles.get(sessionKey);
        if (!handle) {
            throw Error(`the ${sessionKey} session handle is not initialized`);
        }

        return handle;
    }
}
