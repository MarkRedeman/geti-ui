// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { useState } from 'react';

import { Text } from '@adobe/react-spectrum';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import UploadToCloud from '@spectrum-icons/workflow/UploadToCloud';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';
import ViewList from '@spectrum-icons/workflow/ViewList';
import type { Meta, StoryObj } from '@storybook/react';

import { ActionButton, Avatar, AvatarGroup, Button, CornerIndicator, Divider, Flex, Image, PhotoPlaceholder, PressableElement, ToggleButton, ToggleButtons, View } from '@geti/ui';

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
// ToggleButtons demo (needs state)
// ---------------------------------------------------------------------------

const ToggleButtonsDemo = () => {
    const [selected, setSelected] = useState<string>('grid');
    return (
        <ToggleButtons
            options={['grid', 'list']}
            selectedOption={selected}
            onOptionChange={setSelected}
            getLabel={(option) => {
                if (option === 'grid') return <ViewGrid aria-label="Grid view" />;
                return <ViewList aria-label="List view" />;
            }}
        />
    );
};

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

const AVATAR_DATA = [
    { src: 'https://i.pravatar.cc/40?img=1', alt: 'Alice Nguyen' },
    { src: 'https://i.pravatar.cc/40?img=2', alt: 'Bob Müller' },
    { src: 'https://i.pravatar.cc/40?img=3', alt: 'Carol Smith' },
    { src: 'https://i.pravatar.cc/40?img=4', alt: 'David Park' },
    { src: 'https://i.pravatar.cc/40?img=5', alt: 'Eva Torres' },
];

const UIKitchenSink = () => (
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
                    UI — Kitchen Sink
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                        color: 'var(--spectrum-global-color-gray-600)',
                    }}
                >
                    Showcase of all primitive UI components: buttons, avatars, dividers, images, and more.
                </p>
            </View>

            <Divider size="L" />

            {/* ── Buttons ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Button" subtitle="accent, primary, secondary, negative variants; disabled and pending states" />
                <Flex direction="column" gap="size-200">
                    <div>
                        <SubLabel>Variants</SubLabel>
                        <Flex direction="row" gap="size-150" wrap>
                            <Button variant="accent">Accent</Button>
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="negative">Negative</Button>
                        </Flex>
                    </div>
                    <Divider size="S" />
                    <div>
                        <SubLabel>States</SubLabel>
                        <Flex direction="row" gap="size-150" wrap>
                            <Button variant="accent" isDisabled>Disabled</Button>
                            <Button variant="accent" isPending>Pending</Button>
                        </Flex>
                    </div>
                </Flex>
            </View>

            {/* ── ActionButton ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="ActionButton" subtitle="default, dark, light, blue color variants; quiet, disabled states" />
                <Flex direction="column" gap="size-200">
                    <div>
                        <SubLabel>Color variants</SubLabel>
                        <Flex direction="row" gap="size-150" wrap>
                            <ActionButton>Default</ActionButton>
                            <ActionButton colorVariant="dark">Dark</ActionButton>
                            <ActionButton colorVariant="light">Light</ActionButton>
                            <ActionButton colorVariant="blue">Blue</ActionButton>
                        </Flex>
                    </div>
                    <Divider size="S" />
                    <div>
                        <SubLabel>States</SubLabel>
                        <Flex direction="row" gap="size-150" wrap>
                            <ActionButton isQuiet>Quiet</ActionButton>
                            <ActionButton isDisabled>Disabled</ActionButton>
                            <ActionButton isQuiet isDisabled>Quiet + Disabled</ActionButton>
                        </Flex>
                    </div>
                </Flex>
            </View>

            {/* ── ToggleButton ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="ToggleButton" subtitle="unselected, pre-selected, emphasized, quiet, disabled" />
                <Flex direction="row" gap="size-150" wrap>
                    <ToggleButton>Unselected</ToggleButton>
                    <ToggleButton defaultSelected>Pre-selected</ToggleButton>
                    <ToggleButton isEmphasized defaultSelected>Emphasized</ToggleButton>
                    <ToggleButton isQuiet>Quiet</ToggleButton>
                    <ToggleButton isDisabled>Disabled</ToggleButton>
                </Flex>
            </View>

            {/* ── ToggleButtons ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="ToggleButtons" subtitle="segmented control with icons and text options" />
                <Flex direction="column" gap="size-150">
                    <div>
                        <SubLabel>Icon options (interactive)</SubLabel>
                        <ToggleButtonsDemo />
                    </div>
                    <Divider size="S" />
                    <div>
                        <SubLabel>Text options</SubLabel>
                        <ToggleButtons options={['Day', 'Week', 'Month']} selectedOption="Week" onOptionChange={() => {}} />
                    </div>
                    <Divider size="S" />
                    <div>
                        <SubLabel>Disabled</SubLabel>
                        <ToggleButtons options={['A', 'B', 'C']} selectedOption="B" onOptionChange={() => {}} isDisabled />
                    </div>
                </Flex>
            </View>

            {/* ── Avatar & AvatarGroup ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Avatar & AvatarGroup" subtitle="individual avatars and stacked groups with overflow badge" />
                <Flex direction="column" gap="size-250">
                    <div>
                        <SubLabel>Individual avatars — sizes</SubLabel>
                        <Flex direction="row" gap="size-200" alignItems="center" wrap>
                            <Flex direction="column" gap="size-75" alignItems="center">
                                <Avatar src="https://i.pravatar.cc/40?img=1" alt="Alice" size="avatar-size-100" />
                                <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>100</span>
                            </Flex>
                            <Flex direction="column" gap="size-75" alignItems="center">
                                <Avatar src="https://i.pravatar.cc/40?img=2" alt="Bob" size="avatar-size-300" />
                                <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>300</span>
                            </Flex>
                            <Flex direction="column" gap="size-75" alignItems="center">
                                <Avatar src="https://i.pravatar.cc/40?img=3" alt="Carol" size="avatar-size-500" />
                                <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>500</span>
                            </Flex>
                            <Flex direction="column" gap="size-75" alignItems="center">
                                <Avatar src="https://i.pravatar.cc/40?img=4" alt="David" size="avatar-size-700" />
                                <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>700</span>
                            </Flex>
                        </Flex>
                    </div>
                    <Divider size="S" />
                    <div>
                        <SubLabel>AvatarGroup — stacked with overflow</SubLabel>
                        <Flex direction="column" gap="size-150">
                            <AvatarGroup avatars={AVATAR_DATA} max={3} />
                            <AvatarGroup avatars={AVATAR_DATA} max={4} size="avatar-size-400" />
                        </Flex>
                    </div>
                </Flex>
            </View>

            {/* ── Divider ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Divider" subtitle="horizontal S/M/L and vertical orientations" />
                <Flex direction="column" gap="size-200">
                    <div>
                        <SubLabel>Horizontal — S / M / L</SubLabel>
                        <Flex direction="column" gap="size-100">
                            <Divider size="S" />
                            <Divider size="M" />
                            <Divider size="L" />
                        </Flex>
                    </div>
                    <div>
                        <SubLabel>Vertical</SubLabel>
                        <Flex direction="row" gap="size-200" alignItems="center" height="size-600">
                            <Text>Left</Text>
                            <Divider orientation="vertical" size="S" />
                            <Text>Center</Text>
                            <Divider orientation="vertical" size="M" />
                            <Text>Right</Text>
                        </Flex>
                    </div>
                </Flex>
            </View>

            {/* ── Image ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Image" subtitle="cover, contain, and fill object-fit modes" />
                <Flex direction="row" gap="size-300" wrap>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <Image
                            src="https://picsum.photos/seed/geti-cover/320/160"
                            alt="Cover fit"
                            width="size-3600"
                            height="size-1600"
                            objectFit="cover"
                            UNSAFE_style={{ borderRadius: 'var(--spectrum-alias-border-radius-medium)' }}
                        />
                        <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>cover</span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <Image
                            src="https://picsum.photos/seed/geti-contain/320/160"
                            alt="Contain fit"
                            width="size-3600"
                            height="size-1600"
                            objectFit="contain"
                            UNSAFE_style={{ borderRadius: 'var(--spectrum-alias-border-radius-medium)', background: 'var(--spectrum-global-color-gray-200)' }}
                        />
                        <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>contain</span>
                    </Flex>
                </Flex>
            </View>

            {/* ── View ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="View" subtitle="layout container with background colors, borders, and border radius" />
                <Flex direction="row" gap="size-200" wrap>
                    <View padding="size-200" backgroundColor="blue-100" borderRadius="medium">
                        <Text>blue-100</Text>
                    </View>
                    <View padding="size-200" backgroundColor="gray-200" borderRadius="large">
                        <Text>gray-200 + large radius</Text>
                    </View>
                    <View padding="size-200" borderWidth="thin" borderColor="gray-400" borderRadius="medium">
                        <Text>bordered</Text>
                    </View>
                </Flex>
            </View>

            {/* ── PhotoPlaceholder ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="PhotoPlaceholder" subtitle="initials avatar with deterministic color hash" />
                <Flex direction="row" gap="size-300" alignItems="center" wrap>
                    {['Alice Nguyen', 'Bob Müller', 'Carol Smith', 'David Park'].map((name, i) => (
                        <Flex key={name} direction="column" gap="size-75" alignItems="center">
                            <PhotoPlaceholder name={name} indicator={`user${i}@geti.intel.com`} />
                            <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>{name.split(' ')[0]}</span>
                        </Flex>
                    ))}
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <PhotoPlaceholder name="Eva Torres" indicator="eva@geti.intel.com" width="size-2400" height="size-2400" />
                        <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>Large</span>
                    </Flex>
                </Flex>
            </View>

            {/* ── CornerIndicator ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="CornerIndicator" subtitle="notification dot applied to any child element" />
                <Flex direction="row" gap="size-400" alignItems="center" wrap>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <CornerIndicator isActive>
                            <View width="size-1200" height="size-1200" backgroundColor="gray-300" borderRadius="medium" UNSAFE_style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FolderOpen aria-label="Folder" />
                            </View>
                        </CornerIndicator>
                        <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>Active</span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <CornerIndicator isActive={false}>
                            <View width="size-1200" height="size-1200" backgroundColor="gray-300" borderRadius="medium" UNSAFE_style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FolderOpen aria-label="Folder" />
                            </View>
                        </CornerIndicator>
                        <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>Inactive</span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <CornerIndicator isActive>
                            <ActionButton aria-label="Notifications">
                                <UploadToCloud />
                            </ActionButton>
                        </CornerIndicator>
                        <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>On ActionButton</span>
                    </Flex>
                </Flex>
            </View>

            {/* ── PressableElement ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="PressableElement" subtitle="generic pressable wrapper for any non-interactive content" />
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <PressableElement onPress={() => {}}>
                        <View padding="size-150" backgroundColor="gray-200" borderRadius="medium">
                            <Text>Press me (text)</Text>
                        </View>
                    </PressableElement>
                    <PressableElement onPress={() => {}}>
                        <View padding="size-150" backgroundColor="blue-100" borderRadius="medium" UNSAFE_style={{ cursor: 'pointer' }}>
                            <Flex direction="row" gap="size-75" alignItems="center">
                                <UploadToCloud aria-label="Upload" />
                                <Text>Upload asset</Text>
                            </Flex>
                        </View>
                    </PressableElement>
                    <PressableElement isTruncated width="size-2000">
                        <View padding="size-100" backgroundColor="gray-200" borderRadius="medium">
                            <Text>Very long label text that should be truncated when it overflows the container</Text>
                        </View>
                    </PressableElement>
                </Flex>
            </View>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Storybook meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof UIKitchenSink> = {
    tags: ["!dev"],
    component: UIKitchenSink,
    title: 'Kitchen sink/UI',
    parameters: {
        a11y: {},
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof UIKitchenSink>;

export const Default: Story = {};
