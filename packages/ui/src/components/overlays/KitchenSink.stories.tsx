// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { ButtonGroup, Content, Divider as SpectrumDivider, Footer, Heading, Text } from '@adobe/react-spectrum';
import { Button as AriaButton } from 'react-aria-components';
import type { Meta, StoryObj } from '@storybook/react';

import { AlertDialog } from './AlertDialog/AlertDialog';
import { ContextualHelp } from './ContextualHelp/ContextualHelp';
import { CustomPopover } from './CustomPopover/CustomPopover';
import { Dialog } from './Dialog/Dialog';
import { DialogTrigger } from './Dialog/DialogTrigger';
import { FullscreenAction } from './FullscreenAction/FullscreenAction';
import { Popover } from './Popover/Popover';
import { Tooltip } from './Tooltip/Tooltip';
import { TooltipTrigger } from './Tooltip/TooltipTrigger';
import { ActionButton } from '../ui/ActionButton/ActionButton';
import { Button } from '../ui/Button/Button';
import { Divider } from '../ui/Divider/Divider';
import { View } from '../ui/View/View';
import { Flex } from '../layouts/Flex/Flex';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
    <Flex direction="column" gap="size-50" marginBottom="size-200">
        <h2
            style={{
                margin: 0,
                fontSize: 'var(--spectrum-global-dimension-font-size-400)',
                fontWeight: 700,
                color: 'var(--spectrum-global-color-gray-800)',
                letterSpacing: '0.01em',
            }}
        >
            {title}
        </h2>
        {subtitle && (
            <p
                style={{
                    margin: 0,
                    fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                    color: 'var(--spectrum-global-color-gray-600)',
                }}
            >
                {subtitle}
            </p>
        )}
        <Divider size="S" marginTop="size-100" />
    </Flex>
);

const SubLabel = ({ children }: { children: string }) => (
    <p
        style={{
            margin: '0 0 4px 0',
            fontSize: 'var(--spectrum-global-dimension-font-size-50)',
            fontWeight: 600,
            color: 'var(--spectrum-global-color-gray-500)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
        }}
    >
        {children}
    </p>
);

// ---------------------------------------------------------------------------
// Kitchen Sink component
// ---------------------------------------------------------------------------

const OverlaysKitchenSink = () => (
    <View padding="size-400">
        <Flex direction="column" gap="size-400">
            <View>
                <h1
                    style={{
                        margin: '0 0 4px 0',
                        fontSize: 'var(--spectrum-global-dimension-font-size-600)',
                        fontWeight: 800,
                        color: 'var(--spectrum-global-color-gray-900)',
                    }}
                >
                    Overlays — Kitchen Sink
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                        color: 'var(--spectrum-global-color-gray-600)',
                    }}
                >
                    Showcase of all overlay components: tooltips, popovers, dialogs, alert dialogs, contextual help, and
                    fullscreen actions.
                </p>
            </View>

            <Divider size="L" />

            {/* ── Tooltip ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Tooltip" subtitle="placement variants and disabled state" />
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <TooltipTrigger>
                        <Button variant="secondary">Hover (default)</Button>
                        <Tooltip>Default tooltip placement</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger placement="top">
                        <Button variant="secondary">Top</Button>
                        <Tooltip>Tooltip above the trigger</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger placement="bottom">
                        <Button variant="secondary">Bottom</Button>
                        <Tooltip>Tooltip below the trigger</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger placement="end">
                        <ActionButton>End</ActionButton>
                        <Tooltip>Tooltip at end</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger isDisabled>
                        <Button variant="secondary" isDisabled>
                            Disabled
                        </Button>
                        <Tooltip>You won&apos;t see this</Tooltip>
                    </TooltipTrigger>
                </Flex>
            </View>

            {/* ── Popover ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Popover" subtitle="anchored floating dialog with placement variants" />
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <Popover>
                        <ActionButton>Open popover</ActionButton>
                        <Dialog>
                            <Heading>Popover title</Heading>
                            <Content>
                                This is popover content anchored to the trigger button. Click outside to dismiss.
                            </Content>
                        </Dialog>
                    </Popover>
                    <Popover placement="bottom">
                        <Button variant="secondary">Bottom popover</Button>
                        <Dialog>
                            <Heading>Bottom placement</Heading>
                            <Content>Popover placed below the trigger.</Content>
                        </Dialog>
                    </Popover>
                    <Popover placement="end">
                        <Button variant="secondary">End popover</Button>
                        <Dialog>
                            <Heading>End placement</Heading>
                            <Content>Popover placed to the end of the trigger.</Content>
                        </Dialog>
                    </Popover>
                </Flex>
            </View>

            {/* ── CustomPopover ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="CustomPopover" subtitle="react-aria-components variant with optional arrow" />
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <CustomPopover triggerElement={<AriaButton>Open custom popover</AriaButton>} width={280}>
                        <Flex direction="column" gap="size-100" UNSAFE_style={{ padding: '12px 16px' }}>
                            <strong>Popover header</strong>
                            <p style={{ margin: 0, fontSize: '0.875rem' }}>
                                Custom popover with a fixed 280 px width and structured content.
                            </p>
                        </Flex>
                    </CustomPopover>
                    <CustomPopover
                        triggerElement={<AriaButton>With arrow</AriaButton>}
                        showArrow
                        placement="bottom"
                        width={240}
                    >
                        <Flex direction="column" gap="size-75" UNSAFE_style={{ padding: '10px 14px' }}>
                            <strong>Arrow popover</strong>
                            <p style={{ margin: 0, fontSize: '0.875rem' }}>Directional arrow points to the trigger.</p>
                        </Flex>
                    </CustomPopover>
                </Flex>
            </View>

            {/* ── Dialog ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Dialog" subtitle="modal, dismissable, and popover-type variants" />
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <DialogTrigger>
                        <Button variant="accent">Open modal</Button>
                        {(close) => (
                            <Dialog>
                                <Heading>Modal dialog</Heading>
                                <SpectrumDivider />
                                <Content>
                                    This is a full modal dialog. It blocks interaction with the rest of the page until
                                    dismissed.
                                </Content>
                                <Footer>
                                    <ButtonGroup>
                                        <Button variant="secondary" onPress={close}>
                                            Cancel
                                        </Button>
                                        <Button variant="accent" onPress={close}>
                                            Confirm
                                        </Button>
                                    </ButtonGroup>
                                </Footer>
                            </Dialog>
                        )}
                    </DialogTrigger>

                    <DialogTrigger isDismissable>
                        <Button variant="secondary">Dismissable dialog</Button>
                        <Dialog>
                            <Heading>Dismissable</Heading>
                            <SpectrumDivider />
                            <Content>Click outside or press Escape to dismiss this dialog.</Content>
                        </Dialog>
                    </DialogTrigger>

                    <DialogTrigger type="popover">
                        <ActionButton>Popover dialog</ActionButton>
                        <Dialog>
                            <Heading>Popover dialog</Heading>
                            <Content>A dialog rendered as a popover overlay.</Content>
                        </Dialog>
                    </DialogTrigger>
                </Flex>
            </View>

            {/* ── AlertDialog ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="AlertDialog" subtitle="confirmation, destructive, and warning variants" />
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <DialogTrigger>
                        <Button variant="accent">Confirm action</Button>
                        <AlertDialog
                            variant="confirmation"
                            title="Save changes?"
                            primaryActionLabel="Save"
                            cancelLabel="Cancel"
                            onPrimaryAction={() => {}}
                            onCancel={() => {}}
                        >
                            Are you sure you want to save these changes? This action cannot be undone.
                        </AlertDialog>
                    </DialogTrigger>

                    <DialogTrigger>
                        <Button variant="negative">Delete model</Button>
                        <AlertDialog
                            variant="destructive"
                            title="Delete model?"
                            primaryActionLabel="Delete"
                            cancelLabel="Cancel"
                            onPrimaryAction={() => {}}
                            onCancel={() => {}}
                        >
                            This will permanently delete the selected model and all associated data.
                        </AlertDialog>
                    </DialogTrigger>

                    <DialogTrigger>
                        <Button variant="primary">Warning</Button>
                        <AlertDialog
                            variant="warning"
                            title="Proceed with caution"
                            primaryActionLabel="Proceed"
                            cancelLabel="Go back"
                            onPrimaryAction={() => {}}
                        >
                            This action may have unintended side effects. Are you sure you want to proceed?
                        </AlertDialog>
                    </DialogTrigger>
                </Flex>
            </View>

            {/* ── ContextualHelp ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="ContextualHelp" subtitle="help and info variants for form labels" />
                <Flex direction="row" gap="size-400" wrap alignItems="center">
                    <Flex direction="row" gap="size-100" alignItems="center">
                        <Text>Model name</Text>
                        <ContextualHelp variant="help">
                            <Heading>Model name</Heading>
                            <Content>
                                <Text>Use a descriptive name to help identify this model. Maximum 64 characters.</Text>
                            </Content>
                        </ContextualHelp>
                    </Flex>
                    <Flex direction="row" gap="size-100" alignItems="center">
                        <Text>Confidence threshold</Text>
                        <ContextualHelp variant="info">
                            <Heading>About confidence threshold</Heading>
                            <Content>
                                <Text>
                                    This value controls the minimum confidence score required before a detection is
                                    accepted.
                                </Text>
                            </Content>
                        </ContextualHelp>
                    </Flex>
                </Flex>
            </View>

            {/* ── FullscreenAction ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="FullscreenAction" subtitle="fullscreen takeover dialog for immersive editing" />
                <Flex direction="row" gap="size-100" alignItems="center">
                    <FullscreenAction title="Model Viewer" id="overlays-ks-fullscreen">
                        <Flex
                            direction="column"
                            gap="size-200"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                            UNSAFE_style={{ padding: '40px' }}
                        >
                            <Text>
                                This is the fullscreen content area. Use this for immersive editing, annotation, or
                                viewing experiences where the full viewport is needed.
                            </Text>
                            <View
                                backgroundColor="gray-200"
                                borderRadius="medium"
                                width="100%"
                                height="size-3600"
                                UNSAFE_style={{ maxWidth: '600px' }}
                            />
                        </Flex>
                    </FullscreenAction>
                    <Text>Click the expand icon to open fullscreen</Text>
                </Flex>
            </View>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Storybook meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof OverlaysKitchenSink> = {
    tags: ['!dev'],
    component: OverlaysKitchenSink,
    title: 'Kitchen sink/Overlays',
    parameters: {
        a11y: {},
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof OverlaysKitchenSink>;

export const Default: Story = {};
