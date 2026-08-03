import { Session, SessionInitOptions } from './session';

type SessionFactory = (options?: SessionInitOptions) => Promise<Session>;

const MAX_CAUSE_DEPTH = 10;

const WEB_GPU_FAILURE = /webgpu|jsep|no available backend|initwasm|pthread_create/i;

// A poisoned session rejects its queued calls with `SessionPoisonedError`, which
// carries the real failure as `cause`. Classifying only the outermost error would
// therefore misread every concurrent call as an unrelated failure.
const causeChain = (error: unknown): unknown[] => {
    const chain: unknown[] = [];
    let current: unknown = error;

    while (current !== undefined && current !== null && chain.length < MAX_CAUSE_DEPTH) {
        chain.push(current);
        current = current instanceof Error ? (current as { cause?: unknown }).cause : undefined;
    }

    return chain;
};

const describeError = (error: unknown): string =>
    error instanceof Error ? `${error.name} ${error.message}` : String(error);

const isWebGpuFailure = (error: unknown): boolean =>
    causeChain(error).some((entry) => WEB_GPU_FAILURE.test(describeError(entry)));

const isRunTimeout = (error: unknown): boolean =>
    causeChain(error).some((entry) => entry instanceof Error && entry.name === 'SessionRunTimeoutError');

const isCpuOnlyProviders = (executionProviders: readonly string[] | undefined): boolean =>
    executionProviders?.length === 1 && executionProviders[0] === 'cpu';

const isCpuOnly = (options: SessionInitOptions | undefined): boolean => isCpuOnlyProviders(options?.executionProviders);

export class RecoveringSessionHandle {
    private initialization: Promise<void> | undefined;
    private recovery: Promise<Session> | undefined;
    private session: Session | undefined;

    constructor(
        modelPath: string,
        private createSession: SessionFactory = async (options) => {
            const session = new Session();
            if (options) {
                await session.init(modelPath, options);
            } else {
                await session.init(modelPath);
            }
            return session;
        }
    ) {}

    public async init(options?: SessionInitOptions): Promise<void> {
        // Deliberately a no-op once initialized: callers that want different
        // execution providers must go through recovery, not re-init.
        if (this.session) return;
        if (this.initialization) return await this.initialization;

        const initialization = this.initialize(options);
        this.initialization = initialization;

        try {
            await initialization;
        } finally {
            if (this.initialization === initialization) {
                this.initialization = undefined;
            }
        }
    }

    public async execute<T>(operation: (session: Session) => Promise<T>): Promise<T> {
        const session = this.session;
        if (!session) {
            throw new Error('Session handle is not initialized');
        }

        try {
            return await operation(session);
        } catch (error) {
            const recovered = await this.recover(session, error);
            return await operation(recovered);
        }
    }

    private async initialize(options?: SessionInitOptions): Promise<void> {
        try {
            this.session = options ? await this.createSession(options) : await this.createSession();
        } catch (error) {
            if (isCpuOnly(options) || !isWebGpuFailure(error)) throw error;
            this.session = await this.createSession({ ...(options ?? {}), executionProviders: ['cpu'] });
        }
    }

    private async recover(failedSession: Session, error: unknown): Promise<Session> {
        // A run timeout means the execution provider is wedged, not that the
        // model is wrong — treat it like a WebGPU failure and downgrade, or the
        // retry hangs on the same stalled EP for another full timeout.
        const downgradeToCpu = isWebGpuFailure(error) || isRunTimeout(error);
        if (!downgradeToCpu && failedSession.isHealthy) {
            throw error;
        }

        if (this.session && this.session !== failedSession) {
            return this.session;
        }
        if (this.recovery) {
            return await this.recovery;
        }

        const recovery = this.recoverOnce(failedSession, downgradeToCpu);
        this.recovery = recovery;

        try {
            return await recovery;
        } finally {
            if (this.recovery === recovery) {
                this.recovery = undefined;
            }
        }
    }

    private async recoverOnce(failedSession: Session, downgradeToCpu: boolean): Promise<Session> {
        if (this.session && this.session !== failedSession) {
            return this.session;
        }

        if (downgradeToCpu && !isCpuOnlyProviders(failedSession.executionProviders)) {
            await failedSession.reset({ executionProviders: ['cpu'] });
        } else {
            await failedSession.reset();
        }

        this.session = failedSession;

        return failedSession;
    }
}
