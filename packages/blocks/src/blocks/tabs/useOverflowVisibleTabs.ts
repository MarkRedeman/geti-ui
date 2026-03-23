import { useEffect, useState, type RefObject } from 'react';

type UseOverflowVisibleTabsArgs = {
    containerRef: RefObject<HTMLDivElement | null>;
    tabsSectionRef: RefObject<HTMLDivElement | null>;
    collapseSectionRef: RefObject<HTMLDivElement | null>;
    trailingSectionRef: RefObject<HTMLDivElement | null>;
    itemCount: number;
    minVisibleTabs: number;
    recalcDeps?: unknown[];
};

export function useOverflowVisibleTabs({
    containerRef,
    tabsSectionRef,
    collapseSectionRef,
    trailingSectionRef,
    itemCount,
    minVisibleTabs,
    recalcDeps = [],
}: UseOverflowVisibleTabsArgs) {
    const [maxVisibleTabs, setMaxVisibleTabs] = useState(8);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof ResizeObserver === 'undefined') {
            return;
        }

        const recomputeVisibleTabs = () => {
            const tabsSection = tabsSectionRef.current;

            if (!tabsSection) {
                return;
            }

            const containerWidth = container.getBoundingClientRect().width;
            if (containerWidth <= 0) {
                return;
            }

            const tabElements = Array.from(tabsSection.querySelectorAll('[role="tab"]')) as HTMLElement[];
            if (tabElements.length === 0) {
                return;
            }

            const trailingWidth = trailingSectionRef.current?.getBoundingClientRect().width ?? 0;
            const collapseWidth = collapseSectionRef.current?.getBoundingClientRect().width ?? 0;

            const availableWithoutCollapse = Math.max(0, containerWidth - trailingWidth);
            const availableWithCollapse = Math.max(0, containerWidth - trailingWidth - collapseWidth);

            let accumulatedWidth = 0;
            let nextVisible = 0;

            for (const tabElement of tabElements) {
                const tabWidth = tabElement.getBoundingClientRect().width;
                if (tabWidth <= 0) {
                    continue;
                }

                const hasHiddenTabsAfterThis = nextVisible < tabElements.length - 1;
                const maxWidthForThisStep = hasHiddenTabsAfterThis ? availableWithCollapse : availableWithoutCollapse;

                if (accumulatedWidth + tabWidth > maxWidthForThisStep && nextVisible >= minVisibleTabs) {
                    break;
                }

                accumulatedWidth += tabWidth;
                nextVisible += 1;
            }

            const boundedVisible = Math.max(minVisibleTabs, Math.min(itemCount, nextVisible));
            setMaxVisibleTabs((previous) => (previous === boundedVisible ? previous : boundedVisible));
        };

        recomputeVisibleTabs();

        const observer = new ResizeObserver(() => recomputeVisibleTabs());
        observer.observe(container);
        if (tabsSectionRef.current) {
            observer.observe(tabsSectionRef.current);
        }
        if (collapseSectionRef.current) {
            observer.observe(collapseSectionRef.current);
        }
        if (trailingSectionRef.current) {
            observer.observe(trailingSectionRef.current);
        }

        return () => observer.disconnect();
    }, [
        containerRef,
        tabsSectionRef,
        collapseSectionRef,
        trailingSectionRef,
        itemCount,
        minVisibleTabs,
        ...recalcDeps,
    ]);

    return maxVisibleTabs;
}
