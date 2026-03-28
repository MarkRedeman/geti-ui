import { ActionButton, Icon } from '@geti-ai/ui';
import { Filter } from '@geti-ai/ui/icons';
import type { FilterTriggerButtonProps } from './types';

export function FilterTriggerButton({
    isSelected,
    isDisabled,
    onPress,
    ariaLabel = 'Filter media',
    id,
}: FilterTriggerButtonProps) {
    return (
        <ActionButton id={id} isQuiet isDisabled={isDisabled} aria-label={ariaLabel} onPress={onPress}>
            <Icon>
                <Filter data-selected={isSelected ? 'true' : 'false'} />
            </Icon>
        </ActionButton>
    );
}
