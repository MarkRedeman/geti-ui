import { describe, expect, it, rstest } from '@rstest/core';

import { SerialTaskQueue } from './serial-task-queue';

const deferred = <T>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((promiseResolve) => {
        resolve = promiseResolve;
    });

    return { promise, resolve };
};

const flushPromises = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
};

describe('SerialTaskQueue', () => {
    it('runs tasks serially in FIFO order', async () => {
        const firstTask = deferred<number>();
        const order: number[] = [];
        const queue = new SerialTaskQueue<number>();

        const first = queue.enqueue(async () => {
            order.push(1);
            return await firstTask.promise;
        });
        const second = queue.enqueue(async () => {
            order.push(2);
            return 2;
        });
        await flushPromises();

        expect(order).toEqual([1]);
        firstTask.resolve(1);

        await expect(first).resolves.toBe(1);
        await expect(second).resolves.toBe(2);
        expect(order).toEqual([1, 2]);
    });

    it('continues after a task rejects', async () => {
        const queue = new SerialTaskQueue<number>();

        const failed = queue.enqueue(async () => {
            throw new Error('task failed');
        });
        const next = queue.enqueue(async () => 2);

        await expect(failed).rejects.toThrow('task failed');
        await expect(next).resolves.toBe(2);
    });

    it('rejects pending and future tasks when closed', async () => {
        const activeTask = deferred<number>();
        const queue = new SerialTaskQueue<number>();
        const queuedTask = rstest.fn(async () => 2);

        void queue.enqueue(() => activeTask.promise);
        const pending = queue.enqueue(queuedTask);
        await flushPromises();

        const closedError = new Error('queue closed');
        queue.close(closedError);

        await expect(pending).rejects.toBe(closedError);
        await expect(queue.enqueue(async () => 3)).rejects.toBe(closedError);
        expect(queuedTask).not.toHaveBeenCalled();
    });
});
