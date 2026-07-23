import { Key, ReactNode } from 'react';
import { Item, Menu, MenuTrigger, ActionButton } from '@adobe/react-spectrum';
import List from '@spectrum-icons/workflow/ViewList';
import { GridSmall, GridMedium, Grid as GridLarge } from '../../../assets/icons';
import { ViewModes } from './utils';

const ITEMS = [ViewModes.LARGE, ViewModes.MEDIUM, ViewModes.SMALL, ViewModes.DETAILS];

const ICON_PER_MODE: Record<ViewModes, ReactNode> = {
    [ViewModes.DETAILS]: <List fill={'#fff'} />,
    [ViewModes.SMALL]: <GridSmall fill={'#fff'} />,
    [ViewModes.MEDIUM]: <GridMedium fill={'#fff'} />,
    [ViewModes.LARGE]: <GridLarge fill={'#fff'} />,
};

export interface MediaViewModesProps {
    /** The view modes to display in the menu. Defaults to all available modes. */
    items?: ViewModes[];
    /** Whether the view mode switcher is disabled. */
    isDisabled?: boolean;
    /** The current view mode. */
    viewMode: ViewModes;
    /** Function called when the view mode is changed. */
    setViewMode: (viewMode: ViewModes) => void;
}

/**
 * MediaViewModes provides a menu to switch between different view modes (e.g., list, grid).
 * It is commonly used in media galleries or file browsers.
 */
export const MediaViewModes = ({ items = ITEMS, isDisabled = false, viewMode, setViewMode }: MediaViewModesProps) => {
    const handleAction = (key: Key): void => {
        const selectedMode = items.find((item) => item === key);

        if (selectedMode && selectedMode !== viewMode) {
            setViewMode(selectedMode);
        }
    };

    return (
        <MenuTrigger>
            <ActionButton isQuiet isDisabled={isDisabled} aria-label="View mode">
                {ICON_PER_MODE[viewMode]}
            </ActionButton>
            <Menu selectionMode="single" onAction={handleAction} selectedKeys={[viewMode]}>
                {items.map((item: ViewModes) => (
                    <Item key={item} textValue={item}>
                        {item}
                    </Item>
                ))}
            </Menu>
        </MenuTrigger>
    );
};
