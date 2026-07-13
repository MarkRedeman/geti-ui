import type { OpenCVTypes } from '../opencv/interfaces';

import { SegmentAnythingResult } from './interfaces';
import { OpenCVPreprocessorConfig } from './pre-processing';
import { SegmentAnythingDecoder, SegmentAnythingPrompt } from './segment-anything-decoder';
import { EncodingOutput, SegmentAnythingEncoder } from './segment-anything-encoder';
import { Session } from './session';

type cv = typeof OpenCVTypes;
type SessionKey = 'encoder' | 'decoder';

const isWebGpuFailure = (err: unknown): boolean => {
    // Errors whose message points at the WebGPU / JSEP backend. When we see one
    // the right recovery is to drop `webgpu` from the EP list and retry on CPU.
    const WEBGPU_ERROR_PATTERN = /webgpu|jsep|no available backend|initwasm|pthread_create/i;
    const message = err instanceof Error ? err.message : String(err ?? '');

    return WEBGPU_ERROR_PATTERN.test(message);
};

/**
    On a WebGPU/JSEP failure, create a fresh CPU-only session instead of trying
    to reuse the broken one.
 */
const createCpuSession = async (modelPath: string): Promise<Session> => {
    const session = new Session();
    await session.init(modelPath, { executionProviders: ['cpu'] });

    return session;
};

const createSession = async (modelPath: string): Promise<Session> => {
    const session = new Session();

    try {
        await session.init(modelPath);

        return session;
    } catch (err) {
        if (!isWebGpuFailure(err)) throw err;

        return await createCpuSession(modelPath);
    }
};

export class SegmentAnythingModel {
    private sessions = new Map<SessionKey, Session>();
    private initializations = new Map<SessionKey, Promise<void>>();
    private recoveries = new Map<SessionKey, Promise<Session>>();
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
        const sessionKey: SessionKey = algorithm === 'SEGMENT_ANYTHING_ENCODER' ? 'encoder' : 'decoder';
        if (this.sessions.has(sessionKey)) return;

        const pending = this.initializations.get(sessionKey);
        if (pending) {
            return await pending;
        }

        const initialization = (async () => {
            const modelPath = this.modelPaths.get(sessionKey);
            if (!modelPath) {
                throw new Error(`Segment Anything ${sessionKey} model path is not configured`);
            }

            this.sessions.set(sessionKey, await createSession(modelPath));
        })();
        this.initializations.set(sessionKey, initialization);

        try {
            await initialization;
        } finally {
            if (this.initializations.get(sessionKey) === initialization) {
                this.initializations.delete(sessionKey);
            }
        }
    }

    /**
        Recover from a failed call and retry once:
        - WebGPU/JSEP initialization/runtime issues: downgrade to a fresh
          CPU-only session.
        - Any other failure that left the session unhealthy (poisoned by a raw
          ORT error, a run timeout, or a queued SessionPoisonedError): reset()
          the same session in place, keeping its current execution providers.

        We key the second branch off `session.isHealthy` rather than the error
        type because the *first* failing `run()` rethrows the raw ORT error
        (not a SessionPoisonedError) while still poisoning the session — so an
        error-type check would let that first failure escape unrecovered and
        only self-heal on the following call. Checking health recovers every
        poisoning cause within the same call, so a single unrecoverable run
        never wedges SAM behind SessionPoisonedError and callers of the public
        API don't need direct access to `Session.reset()`.
    */
    private async runWithRecovery<T>(sessionKey: SessionKey, op: (session: Session) => Promise<T>): Promise<T> {
        const session = this.sessions.get(sessionKey);
        if (!session) {
            throw Error(`the ${sessionKey} is absent in the sessions map`);
        }

        try {
            return await op(session);
        } catch (err) {
            const recovered = await this.recoverSession(sessionKey, session, err);

            return await op(recovered);
        }
    }

    private async recoverSession(sessionKey: SessionKey, failedSession: Session, err: unknown): Promise<Session> {
        const current = this.sessions.get(sessionKey);
        if (current && current !== failedSession) {
            return current;
        }

        const pending = this.recoveries.get(sessionKey);
        if (pending) {
            return await pending;
        }

        const recovery = (async () => {
            const latest = this.sessions.get(sessionKey);
            if (latest && latest !== failedSession) {
                return latest;
            }

            if (isWebGpuFailure(err)) {
                const modelPath = this.modelPaths.get(sessionKey);
                if (!modelPath) {
                    throw new Error(`Segment Anything ${sessionKey} model path is not configured`);
                }

                const replacement = await createCpuSession(modelPath);
                this.sessions.set(sessionKey, replacement);

                return replacement;
            }

            // Only retry when the failure actually corrupted the session; an
            // unrelated error (e.g. OpenCV pre-processing) leaves it healthy
            // and must propagate unchanged.
            if (!failedSession.isHealthy) {
                await failedSession.reset();
                this.sessions.set(sessionKey, failedSession);

                return failedSession;
            }

            throw err;
        })();
        this.recoveries.set(sessionKey, recovery);

        try {
            return await recovery;
        } finally {
            if (this.recoveries.get(sessionKey) === recovery) {
                this.recoveries.delete(sessionKey);
            }
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
