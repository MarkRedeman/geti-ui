import { ToggleButtons } from '@geti-ai/ui';
import { useEffect } from 'react';
import { DEFAULT_MEDIA_GRID_VIEW_MODES } from './types';
import type { MediaGridModeToggleButtonsProps } from './types';

/**
 * Optional helper to control MediaGrid itemSize externally.
 * Keeps mode controls out of MediaGrid core component.
 */
export function MediaGridModeToggleButtons({
    options = DEFAULT_MEDIA_GRID_VIEW_MODES,
    value,
    onChange,
    isDisabled,
}: MediaGridModeToggleButtonsProps) {
    const keys = Object.keys(options);
    const selected = keys.includes(value) ? value : keys[0];

    useEffect(() => {
        if (!selected || selected === value) {
            return;
        }
        onChange(selected);
    }, [onChange, selected, value]);

    if (!selected) {
        return null;
    }

    return (
        <ToggleButtons
            options={keys}
            selectedOption={selected}
            onOptionChange={onChange}
            isDisabled={isDisabled}
            getLabel={(option: string) => options[option]?.label ?? option}
        />
    );
}
