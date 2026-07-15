type QueuedTask<T> = {
    reject: (reason: unknown) => void;
    resolve: (value: T) => void;
    task: () => Promise<T>;
};

export class SerialTaskQueue<T> {
    private closedError: unknown;
    private closed = false;
    private queue: QueuedTask<T>[] = [];
    private running = false;

    public enqueue(task: () => Promise<T>): Promise<T> {
        if (this.closed) {
            return Promise.reject(this.closedError);
        }

        const result = new Promise<T>((resolve, reject) => {
            this.queue.push({ reject, resolve, task });
        });
        void this.drain();

        return result;
    }

    public close(error: unknown): void {
        if (this.closed) return;

        this.closed = true;
        this.closedError = error;
        const queuedTasks = this.queue.splice(0);
        for (const queuedTask of queuedTasks) {
            queuedTask.reject(error);
        }
    }

    private async drain(): Promise<void> {
        if (this.running || this.closed) return;

        const queuedTask = this.queue.shift();
        if (!queuedTask) return;

        this.running = true;
        try {
            queuedTask.resolve(await queuedTask.task());
        } catch (error) {
            queuedTask.reject(error);
        } finally {
            this.running = false;
            void this.drain();
        }
    }
}
