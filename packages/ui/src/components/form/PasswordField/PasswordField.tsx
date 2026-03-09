import { useState } from 'react';

import { TextField as SpectrumTextField, SpectrumTextFieldProps } from '@adobe/react-spectrum';

import styles from './PasswordField.module.css';

/** Props for the PasswordField component. Extends Spectrum's TextFieldProps, excluding `type`. */
export interface PasswordFieldProps extends Omit<SpectrumTextFieldProps, 'type'> {
    /** When true, shows a hint that the password must be at least 8 characters. */
    isNewPassword?: boolean;
    /** Custom error message displayed below the field. */
    error?: string;
}

/**
 * A password input field with a show/hide toggle.
 * Wraps Adobe React Spectrum's TextField with `type="password"` by default.
 * Optionally shows a password-rules hint (isNewPassword) or a custom error message (error).
 */
export const PasswordField = ({ isNewPassword, error, id, ...rest }: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const errorId = id ? `${id}-error` : undefined;
    const hintId = id ? `${id}-hint` : undefined;
    const describedBy = [error ? errorId : undefined, isNewPassword ? hintId : undefined].filter(Boolean).join(' ');

    return (
        <div>
            <div className={styles.fieldWrapper}>
                <SpectrumTextField
                    {...rest}
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    validationState={error ? 'invalid' : undefined}
                    aria-describedby={describedBy || undefined}
                />
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={togglePassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
            {error && (
                <span role="alert" id={errorId} className={styles.errorMessage}>
                    {error}
                </span>
            )}
            {isNewPassword && (
                <p id={hintId} className={styles.hint}>
                    Password must be at least 8 characters
                </p>
            )}
        </div>
    );
};
