// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Dialog as SpectrumDialog, SpectrumDialogProps } from '@adobe/react-spectrum';

/**
 * Props for the Dialog component.
 * Extends Spectrum's SpectrumDialogProps.
 */
export interface DialogProps extends SpectrumDialogProps {}

/**
 * A dialog component that wraps Adobe React Spectrum's Dialog.
 * Dialogs are windows containing contextual information or tasks that appear over the UI.
 */
export const Dialog = (props: DialogProps) => <SpectrumDialog {...props} />;
