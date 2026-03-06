// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Meter as SpectrumMeter, SpectrumMeterProps } from '@adobe/react-spectrum';

/**
 * Props for the Meter component.
 * Extends Spectrum's SpectrumMeterProps.
 */
export interface MeterProps extends SpectrumMeterProps {}

/**
 * A meter component that wraps Adobe React Spectrum's Meter.
 * Meters are visual representations of a quantity or achievement.
 * The meter's status is set by applying a threshold indicator.
 */
export const Meter = (props: MeterProps) => <SpectrumMeter {...props} />;
