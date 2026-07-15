import { Session, SessionInitOptions } from './session';

type SessionFactory = (options?: SessionInitOptions) => Promise<Session>;

const isWebGpuFailure = (error: unknown): boolean => {
    const message = error instanceof Error ? error.message : String(error ?? '');

    return /webgpu|jsep|no available backend|initwasm|pthread_create/i.test(message);
};

const isCpuOnly = (options: SessionInitOptions | undefined): boolean =>
    options?.executionProviders?.length === 1 && options.executionProviders[0] === 'cpu';

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
        const webGpuFailure = isWebGpuFailure(error);
        if (!webGpuFailure && failedSession.isHealthy) {
            throw error;
        }

        if (this.session && this.session !== failedSession) {
            return this.session;
        }
        if (this.recovery) {
            return await this.recovery;
        }

        const recovery = this.recoverOnce(failedSession, webGpuFailure);
        this.recovery = recovery;

        try {
            return await recovery;
        } finally {
            if (this.recovery === recovery) {
                this.recovery = undefined;
            }
        }
    }

    private async recoverOnce(failedSession: Session, webGpuFailure: boolean): Promise<Session> {
        if (this.session && this.session !== failedSession) {
            return this.session;
        }

        if (webGpuFailure) {
            await failedSession.reset({ executionProviders: ['cpu'] });
            this.session = failedSession;
            return failedSession;
        }

        await failedSession.reset();
        this.session = failedSession;
        return failedSession;
    }
}
