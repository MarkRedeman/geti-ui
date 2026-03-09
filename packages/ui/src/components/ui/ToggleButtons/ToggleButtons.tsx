import { ReactNode } from 'react';

import { Button } from '../Button/Button';
import styles from './ToggleButtons.module.css';

interface ToggleButtonProps<T extends string | number> {
    selectedOption: T;
    option: T;
    onOptionChange: (option: T) => void;
    isDisabled?: boolean;
    children?: ReactNode;
}

const ToggleButton = <T extends string | number>({
    selectedOption,
    option,
    onOptionChange,
    isDisabled,
    children,
}: ToggleButtonProps<T>) => {
    return (
        <Button
            aria-pressed={selectedOption === option}
            variant={selectedOption === option ? 'accent' : 'secondary'}
            UNSAFE_className={styles.toggleButton}
            onPress={() => {
                onOptionChange(option);
            }}
            isDisabled={isDisabled}
        >
            {children ?? option}
        </Button>
    );
};

export interface ToggleButtonsProps<T extends string | number> {
    /** The available options to display. */
    options: T[];
    /** The currently selected option. */
    selectedOption: T;
    /** Callback triggered when an option is selected. */
    onOptionChange: (option: T) => void;
    /** Whether the entire group is disabled. */
    isDisabled?: boolean;
    /** Optional mapping of options to custom labels/icons. */
    getLabel?: (option: T) => ReactNode;
}

/**
 * ToggleButtons displays a group of mutually exclusive buttons.
 * It is commonly used for view switching or simple mode selection.
 */
export const ToggleButtons = <T extends string | number>({
    options,
    selectedOption,
    onOptionChange,
    isDisabled,
    getLabel,
}: ToggleButtonsProps<T>) => {
    return (
        <div role="group" aria-label="Selection options" style={{ display: 'flex' }}>
            {options.map((option) => (
                <ToggleButton
                    key={option}
                    selectedOption={selectedOption}
                    option={option}
                    onOptionChange={onOptionChange}
                    isDisabled={isDisabled}
                >
                    {getLabel ? getLabel(option) : undefined}
                </ToggleButton>
            ))}
        </div>
    );
};
