// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { ActionMenu as SpectrumActionMenu, SpectrumActionMenuProps } from '@adobe/react-spectrum';

/**
 * Props for the ActionMenu component.
 * Extends Spectrum's SpectrumActionMenuProps without modification.
 */
export interface ActionMenuProps<T extends object> extends SpectrumActionMenuProps<T> {}

/**
 * An action menu component that wraps Adobe React Spectrum's ActionMenu.
 * Combines an ActionButton trigger with a Menu in a single convenient component.
 * Use Item children to define menu actions.
 */
export const ActionMenu = <T extends object>(props: ActionMenuProps<T>) => <SpectrumActionMenu {...props} />;
