import { Dispatch, Key, ReactNode, SetStateAction } from 'react';
import { Item, Menu, MenuTrigger, Tooltip, TooltipTrigger, ActionButton } from '@adobe/react-spectrum';
import List from '@spectrum-icons/workflow/ViewList';
import GridSmall from '@spectrum-icons/workflow/ViewGrid';
import GridMedium from '@spectrum-icons/workflow/ModernGridView';
import GridLarge from '@spectrum-icons/workflow/ClassicGridView';
import { VIEW_MODE_LABEL, ViewModes } from './utils';

const ITEMS = [ViewModes.LARGE, ViewModes.MEDIUM, ViewModes.SMALL, ViewModes.DETAILS];

const ICON_PER_MODE: Record<ViewModes, ReactNode> = {
    [ViewModes.DETAILS]: <List />,
    [ViewModes.SMALL]: <GridSmall />,
    [ViewModes.MEDIUM]: <GridMedium />,
    [ViewModes.LARGE]: <GridLarge />,
};

export interface MediaViewModesProps {
    /** The view modes to display in the menu. Defaults to all available modes. */
    items?: ViewModes[];
    /** Whether the view mode switcher is disabled. */
    isDisabled?: boolean;
    /** The current view mode. */
    viewMode: ViewModes;
    /** Function called when the view mode is changed. */
    setViewMode: Dispatch<SetStateAction<ViewModes>> | ((viewMode: ViewModes) => void);
}

/**
 * MediaViewModes provides a menu to switch between different view modes (e.g., list, grid).
 * It is commonly used in media galleries or file browsers.
 */
export const MediaViewModes = ({ items = ITEMS, isDisabled = false, viewMode, setViewMode }: MediaViewModesProps) => {
    const handleAction = (key: Key): void => {
        // Find the view mode that matches the key (case-insensitive for safety)
        const selectedMode = items.find((item) => item.toLocaleLowerCase() === String(key).toLocaleLowerCase());

        if (selectedMode && selectedMode !== viewMode) {
            setViewMode(selectedMode as ViewModes);
        }
    };

    return (
        <MenuTrigger>
            <TooltipTrigger placement="bottom">
                <ActionButton isQuiet isDisabled={isDisabled} aria-label="View mode">
                    {ICON_PER_MODE[viewMode]}
                </ActionButton>
                <Tooltip>{VIEW_MODE_LABEL}</Tooltip>
            </TooltipTrigger>
            <Menu selectionMode="single" onAction={handleAction} selectedKeys={[viewMode.toLocaleLowerCase()]}>
                {items.map((item: ViewModes) => (
                    <Item key={item.toLocaleLowerCase()} textValue={item}>
                        {item}
                    </Item>
                ))}
            </Menu>
        </MenuTrigger>
    );
};
