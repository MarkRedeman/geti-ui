import type { OpenCVTypes } from '../opencv/interfaces';

import { SegmentAnythingResult } from './interfaces';
import { OpenCVPreprocessorConfig } from './pre-processing';
import { isFatalSessionError, SessionRunTimeoutError, shouldUseCpuFallback } from './errors';
import { SegmentAnythingDecoder, SegmentAnythingPrompt } from './segment-anything-decoder';
import { EncodingOutput, SegmentAnythingEncoder } from './segment-anything-encoder';
import { ModelSession, Session } from './session';

type cv = typeof OpenCVTypes;

const createSession = async (modelPath: string): Promise<Session> => {
    const session = new Session();

    try {
        await session.init(modelPath);
    } catch (err) {
        if (!shouldUseCpuFallback(err)) throw err;
        await session.reset({ executionProviders: ['cpu'] });
    }

    return session;
};

type SessionKey = 'encoder' | 'decoder';

export class SegmentAnythingModel {
    private sessions = new Map<string, Session>();
    private initializations = new Map<SessionKey, Promise<void>>();
    private recoveries = new Map<SessionKey, Promise<Session>>();
    private runTail: Promise<void> = Promise.resolve();
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
        const sessionKey = algorithm === 'SEGMENT_ANYTHING_ENCODER' ? 'encoder' : 'decoder';
        if (this.sessions.has(sessionKey)) return;

        const activeInitialization = this.initializations.get(sessionKey);
        if (activeInitialization) return activeInitialization;

        const initialization = this.initializeSession(sessionKey);
        this.initializations.set(sessionKey, initialization);

        try {
            await initialization;
        } finally {
            if (this.initializations.get(sessionKey) === initialization) this.initializations.delete(sessionKey);
        }
    }

    private async initializeSession(sessionKey: SessionKey): Promise<void> {
        const modelPath = this.modelPaths.get(sessionKey);
        if (!modelPath) throw new Error(`Segment Anything ${sessionKey} model path is not configured`);

        this.sessions.set(sessionKey, await createSession(modelPath));
    }

    private runExclusive<T>(operation: () => Promise<T>): Promise<T> {
        const result = this.runTail.then(operation, operation);
        this.runTail = result.then(
            () => undefined,
            async (error: unknown) => {
                if (error instanceof SessionRunTimeoutError) await error.waitUntilSafe;
            }
        );

        return result;
    }

    private async runSession<T>(
        sessionKey: SessionKey,
        input: Parameters<Session['run']>[0],
        consume: (output: Awaited<ReturnType<Session['run']>>, outputNames: readonly string[]) => Promise<T>
    ): Promise<T> {
        return this.runExclusive(async () => {
            const session = this.getSession(sessionKey);

            try {
                return await this.runAndConsume(session, input, consume);
            } catch (error) {
                if (!isFatalSessionError(error)) throw error;

                if (error instanceof SessionRunTimeoutError) {
                    error.waitUntilSafe = error.waitUntilSafe.then(async () => {
                        await this.recoverSession(sessionKey, session, false);
                    });
                    throw error;
                }

                const replacement = await this.recoverSession(sessionKey, session, shouldUseCpuFallback(error));
                return this.runAndConsume(replacement, input, consume);
            }
        });
    }

    private async runAndConsume<T>(
        session: Session,
        input: Parameters<Session['run']>[0],
        consume: (output: Awaited<ReturnType<Session['run']>>, outputNames: readonly string[]) => Promise<T>
    ): Promise<T> {
        const output = await session.run(input);
        return consume(output, session.outputNames());
    }

    private async recoverSession(sessionKey: SessionKey, failedSession: Session, useCpu: boolean): Promise<Session> {
        const current = this.getSession(sessionKey);
        if (current !== failedSession) return current;

        const activeRecovery = this.recoveries.get(sessionKey);
        if (activeRecovery) return activeRecovery;

        const recovery = (async () => {
            await failedSession.reset(useCpu ? { executionProviders: ['cpu'] } : undefined);
            return failedSession;
        })();
        this.recoveries.set(sessionKey, recovery);

        try {
            return await recovery;
        } finally {
            if (this.recoveries.get(sessionKey) === recovery) this.recoveries.delete(sessionKey);
        }
    }

    private getSession(sessionKey: SessionKey): Session {
        const session = this.sessions.get(sessionKey);
        if (!session) throw Error(`the ${sessionKey} is absent in the sessions map`);
        return session;
    }

    private modelSession(sessionKey: SessionKey): ModelSession {
        return {
            run: (input, consume) => this.runSession(sessionKey, input, consume),
        };
    }

    public async processEncoder(initialImageData: ImageData): Promise<EncodingOutput> {
        return new SegmentAnythingEncoder(
            this.cv,
            this.preProcessorConfig,
            this.modelSession('encoder')
        ).processEncoder(initialImageData);
    }

    public async processDecoder(
        encodingOutput: EncodingOutput,
        input: SegmentAnythingPrompt
    ): Promise<SegmentAnythingResult> {
        const output = await new SegmentAnythingDecoder(this.cv, this.modelSession('decoder')).process(
            encodingOutput,
            input
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
            maxContourIdx: 0,
            shapes: [output.shapes[output.maxContourIdx]],
        };
    }
}
