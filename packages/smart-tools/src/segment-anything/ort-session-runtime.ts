import { InferenceSession } from 'onnxruntime-web';

import { SerialTaskQueue } from './serial-task-queue';
import { SessionRunTimeoutError } from './session-errors';

export class OrtSessionRuntime {
    private activeRun: Promise<InferenceSession.OnnxValueMapType> | undefined;
    private closed = false;
    private queue = new SerialTaskQueue<InferenceSession.OnnxValueMapType>();

    constructor(
        public readonly ortSession: InferenceSession,
        private onFailure: () => void
    ) {}

    public run(
        input: InferenceSession.OnnxValueMapType,
        timeoutMs: number | undefined
    ): Promise<InferenceSession.OnnxValueMapType> {
        return this.queue.enqueue(() => this.runOnce(input, timeoutMs));
    }

    public close(error: unknown): void {
        if (this.closed) return;

        this.closed = true;
        this.queue.close(error);

        const release = () => this.ortSession.release();
        const releasePromise = this.activeRun ? this.activeRun.then(release, release) : Promise.resolve().then(release);

        void releasePromise.catch(() => undefined);
    }

    public inputNames(): readonly string[] {
        return this.ortSession.inputNames;
    }

    public outputNames(): readonly string[] {
        return this.ortSession.outputNames;
    }

    private runOnce(
        input: InferenceSession.OnnxValueMapType,
        timeoutMs: number | undefined
    ): Promise<InferenceSession.OnnxValueMapType> {
        let runPromise: Promise<InferenceSession.OnnxValueMapType>;

        try {
            runPromise = this.ortSession.run(input);
        } catch (error) {
            this.onFailure();
            throw error;
        }

        this.activeRun = runPromise;
        void runPromise.then(
            () => this.clearActiveRun(runPromise),
            () => this.clearActiveRun(runPromise)
        );

        if (!timeoutMs || timeoutMs <= 0) {
            return runPromise.catch((error) => {
                this.onFailure();
                throw error;
            });
        }

        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
                reject(new SessionRunTimeoutError(timeoutMs));
            }, timeoutMs);
        });

        return Promise.race([runPromise, timeoutPromise]).then(
            (result) => {
                if (timer !== undefined) clearTimeout(timer);
                return result;
            },
            (error) => {
                if (timer !== undefined) clearTimeout(timer);
                this.onFailure();
                throw error;
            }
        );
    }

    private clearActiveRun(runPromise: Promise<InferenceSession.OnnxValueMapType>): void {
        if (this.activeRun === runPromise) {
            this.activeRun = undefined;
        }
    }
}
