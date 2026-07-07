import type { OpenCVTypes } from '../opencv/interfaces';

import { SegmentAnythingResult } from './interfaces';
import { OpenCVPreprocessorConfig } from './pre-processing';
import { SegmentAnythingDecoder, SegmentAnythingPrompt } from './segment-anything-decoder';
import { EncodingOutput, SegmentAnythingEncoder } from './segment-anything-encoder';
import { Session } from './session';

type cv = typeof OpenCVTypes;

const isWebGpuFailure = (err: unknown): boolean => {
    // Errors whose message points at the WebGPU / JSEP backend. When we see one
    // the right recovery is to drop `webgpu` from the EP list and retry on CPU.
    const WEBGPU_ERROR_PATTERN = /webgpu|jsep|no available backend/i;
    const message = err instanceof Error ? err.message : String(err ?? '');

    return WEBGPU_ERROR_PATTERN.test(message);
};

/**
    In case of session failure, we create a new fresh session instead
    of attempting recovery.
 */
const createCpuSession = async (modelPath: string): Promise<Session> => {
    const session = new Session();
    await session.init(modelPath, { executionProviders: ['cpu'] });

    return session;
};

const createSession = async (modelPath: string): Promise<Session> => {
    const session = new Session();
    await session.init(modelPath);

    return session;
};

export class SegmentAnythingModel {
    private sessions = new Map<string, Session>();
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

    public async init(algorithm: 'SEGMENT_ANYTHING_DECODER' | 'SEGMENT_ANYTHING_ENCODER'): Promise<void> {
        if (!this.sessions.has('encoder') && algorithm === 'SEGMENT_ANYTHING_ENCODER') {
            const encoderPath = this.modelPaths.get('encoder') ?? '';
            this.sessions.set('encoder', await createSession(encoderPath));
        }

        if (!this.sessions.has('decoder') && algorithm === 'SEGMENT_ANYTHING_DECODER') {
            const decoderPath = this.modelPaths.get('decoder') ?? '';
            this.sessions.set('decoder', await createSession(decoderPath));
        }
    }

    /**
        In case of webgpu failure or absence, we fallback to creating a new
        cpu session.
     */
    private async runWithRecovery<T>(
        sessionKey: 'encoder' | 'decoder',
        op: (session: Session) => Promise<T>
    ): Promise<T> {
        const session = this.sessions.get(sessionKey);
        if (!session) {
            throw Error(`the ${sessionKey} is absent in the sessions map`);
        }

        try {
            return await op(session);
        } catch (err) {
            if (!isWebGpuFailure(err)) throw err;

            const modelPath = this.modelPaths.get(sessionKey);
            if (!modelPath) {
                throw new Error(`Segment Anything ${sessionKey} model path is not configured`);
            }

            const replacement = await createCpuSession(modelPath);
            this.sessions.set(sessionKey, replacement);

            return await op(replacement);
        }
    }

    public async processEncoder(initialImageData: ImageData): Promise<EncodingOutput> {
        return this.runWithRecovery('encoder', (session) =>
            new SegmentAnythingEncoder(this.cv, this.preProcessorConfig, session).processEncoder(initialImageData)
        );
    }

    public async processDecoder(
        encodingOutput: EncodingOutput,
        input: SegmentAnythingPrompt
    ): Promise<SegmentAnythingResult> {
        const output = await this.runWithRecovery('decoder', (session) =>
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
}
