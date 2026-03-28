import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from '@rstest/core';
import { useRef } from 'react';

import { useContainerSize } from './useContainerSize';

type ResizeCallback = (entries: ResizeObserverEntry[]) => void;

let resizeCallbacks: ResizeCallback[] = [];

class MockResizeObserver {
    private callback: ResizeCallback;

    constructor(callback: ResizeCallback) {
        this.callback = callback;
        resizeCallbacks.push(callback);
    }

    observe() {}
    disconnect() {}
    unobserve() {}
}

function triggerResize(target: Element) {
    act(() => {
        resizeCallbacks.forEach((callback) => {
            callback([{ target } as ResizeObserverEntry]);
        });
    });
}

function setElementSize(element: HTMLElement, width: number, height: number) {
    Object.defineProperty(element, 'clientWidth', {
        value: width,
        configurable: true,
    });

    Object.defineProperty(element, 'clientHeight', {
        value: height,
        configurable: true,
    });
}

function SizeProbe() {
    const ref = useRef<HTMLDivElement>(null);
    const size = useContainerSize(ref);

    return (
        <div>
            <div ref={ref} data-testid='container' />
            <div data-testid='size'>
                {size.width}x{size.height}
            </div>
        </div>
    );
}

describe('useContainerSize', () => {
    beforeEach(() => {
        resizeCallbacks = [];
        Object.defineProperty(globalThis, 'ResizeObserver', {
            value: MockResizeObserver,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        resizeCallbacks = [];
    });

    it('starts with the default JSDOM-safe size', () => {
        render(<SizeProbe />);

        expect(screen.getByTestId('size').textContent).toBe('100x100');
    });

    it('updates when ResizeObserver callback runs', () => {
        render(<SizeProbe />);

        const container = screen.getByTestId('container') as HTMLDivElement;
        setElementSize(container, 640, 360);

        triggerResize(container);

        expect(screen.getByTestId('size').textContent).toBe('640x360');
    });
});
