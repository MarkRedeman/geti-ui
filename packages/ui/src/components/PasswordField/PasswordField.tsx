// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

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
export const PasswordField = ({ isNewPassword, error, ...rest }: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
        <div>
            <div className={styles.fieldWrapper}>
                <SpectrumTextField {...rest} type={showPassword ? 'text' : 'password'} />
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
                <span role="alert" className={styles.errorMessage}>
                    {error}
                </span>
            )}
            {isNewPassword && <p className={styles.hint}>Password must be at least 8 characters</p>}
        </div>
    );
};
