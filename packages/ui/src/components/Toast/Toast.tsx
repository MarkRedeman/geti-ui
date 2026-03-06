// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import {
    ToastContainer as SpectrumToastContainer,
    ToastQueue as SpectrumToastQueue,
    SpectrumToastContainerProps,
    SpectrumToastOptions,
} from '@adobe/react-spectrum';

/**
 * Props for the ToastContainer component.
 * Extends Spectrum's SpectrumToastContainerProps.
 */
export interface ToastContainerProps extends SpectrumToastContainerProps {}

/**
 * Options for displaying a toast notification.
 * Extends Spectrum's SpectrumToastOptions.
 */
export interface ToastOptions extends SpectrumToastOptions {}

/**
 * Renders the queued toasts in the application.
 * Place this once at the root of the app (e.g. inside ThemeProvider).
 *
 * @example
 * <ToastContainer placement="bottom" />
 */
export const ToastContainer = (props: ToastContainerProps) => <SpectrumToastContainer {...props} />;

type CloseFunction = () => void;

type ToastAPI = {
    /** Shows a positive (success) toast. */
    positive: (message: string, options?: ToastOptions) => CloseFunction;
    /** Shows a negative (error) toast. */
    negative: (message: string, options?: ToastOptions) => CloseFunction;
    /** Shows an informational toast. */
    info: (message: string, options?: ToastOptions) => CloseFunction;
    /** Shows a neutral toast. */
    neutral: (message: string, options?: ToastOptions) => CloseFunction;
};

/**
 * Programmatic API for showing toast notifications.
 * Call these methods anywhere in your app without needing a component reference.
 *
 * @example
 * toast.positive('File saved successfully');
 * toast.negative('Upload failed', { timeout: 5000 });
 * toast.info('Processing your request…');
 * toast.neutral('No changes detected');
 */
// eslint-disable-next-line react-refresh/only-export-components
export const toast: ToastAPI = {
    positive: (message: string, options?: ToastOptions) => SpectrumToastQueue.positive(message, options),
    negative: (message: string, options?: ToastOptions) => SpectrumToastQueue.negative(message, options),
    info: (message: string, options?: ToastOptions) => SpectrumToastQueue.info(message, options),
    neutral: (message: string, options?: ToastOptions) => SpectrumToastQueue.neutral(message, options),
};
