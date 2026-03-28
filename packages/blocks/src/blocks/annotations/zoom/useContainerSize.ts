import { useState, type RefObject } from 'react';

import { useResizeObserver } from '@react-aria/utils';

import type { Size } from './types';

export function useContainerSize(ref: RefObject<HTMLElement | null>): Size {
    const [size, setSize] = useState<Size>({ width: 100, height: 100 });

    useResizeObserver({
        ref,
        box: 'border-box',
        onResize: () => {
            if (!ref.current) {
                return;
            }

            const { clientWidth, clientHeight } = ref.current;

            setSize((previousSize) => {
                if (previousSize.width === clientWidth && previousSize.height === clientHeight) {
                    return previousSize;
                }

                return { width: clientWidth, height: clientHeight };
            });
        },
    });

    return size;
}
