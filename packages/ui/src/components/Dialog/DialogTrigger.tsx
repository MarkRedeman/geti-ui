// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { DialogTrigger as SpectrumDialogTrigger, SpectrumDialogTriggerProps } from '@adobe/react-spectrum';

/**
 * Props for the DialogTrigger component.
 * Extends Spectrum's SpectrumDialogTriggerProps.
 */
export interface DialogTriggerProps extends SpectrumDialogTriggerProps {}

/**
 * A dialog trigger component that wraps Adobe React Spectrum's DialogTrigger.
 * Links the dialog's open state with the trigger element's press state.
 */
export const DialogTrigger = (props: DialogTriggerProps) => <SpectrumDialogTrigger {...props} />;
