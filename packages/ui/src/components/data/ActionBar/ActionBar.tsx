import {
    ActionBar as SpectrumActionBar,
    SpectrumActionBarProps,
    ActionBarContainer as SpectrumActionBarContainer,
    SpectrumActionBarContainerProps,
} from '@adobe/react-spectrum';

/**
 * ActionBars are used for single and bulk selection patterns when a user needs to perform actions on one or more items at the same time.
 */
export const ActionBar = <T extends object>(props: SpectrumActionBarProps<T>) => {
    return <SpectrumActionBar {...props} />;
};

/**
 * ActionBarContainers wrap a component that supports selection (like ListView or TableView) and an ActionBar.
 */
export const ActionBarContainer = (props: SpectrumActionBarContainerProps) => {
    return <SpectrumActionBarContainer {...props} />;
};

export type { SpectrumActionBarProps as ActionBarProps, SpectrumActionBarContainerProps as ActionBarContainerProps };
