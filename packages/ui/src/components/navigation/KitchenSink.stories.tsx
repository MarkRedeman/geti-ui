import { useState } from 'react';

import { Content, Item, Text } from '@adobe/react-spectrum';
import type { Meta, StoryObj } from '@storybook/react';

import {
    ActionButton,
    ActionMenu,
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Divider,
    Flex,
    Link,
    MenuItem,
    Menu,
    MenuSection,
    MenuTrigger,
    TabItem,
    TabList,
    TabPanels,
    Tabs,
    View,
} from '@geti-ai/ui';
import { MediaViewModes } from './MediaViewModes/MediaViewModes';
import { ViewModes } from './MediaViewModes/utils';

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
// MediaViewModes demo
// ---------------------------------------------------------------------------

const MediaViewModesDemo = () => {
    const [viewMode, setViewMode] = useState<ViewModes>(ViewModes.MEDIUM);
    return <MediaViewModes viewMode={viewMode} setViewMode={setViewMode} />;
};

// ---------------------------------------------------------------------------
// Kitchen Sink component
// ---------------------------------------------------------------------------

const NavigationKitchenSink = () => (
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
                    Navigation — Kitchen Sink
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                        color: 'var(--spectrum-global-color-gray-600)',
                    }}
                >
                    Showcase of all navigation components: Tabs, Breadcrumbs, Link, Menu, ActionMenu, and
                    MediaViewModes.
                </p>
            </View>

            <Divider size="L" />

            {/* ── Tabs ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Tabs" subtitle="horizontal tab navigation with panel content" />
                <Flex direction="column" gap="size-200">
                    <div>
                        <SubLabel>Default — horizontal</SubLabel>
                        <Tabs aria-label="Project sections">
                            <TabList>
                                <TabItem key="overview">Overview</TabItem>
                                <TabItem key="datasets">Datasets</TabItem>
                                <TabItem key="models">Models</TabItem>
                                <TabItem key="settings">Settings</TabItem>
                            </TabList>
                            <TabPanels>
                                <TabItem key="overview">
                                    <Content>
                                        <View paddingTop="size-150">
                                            Overview panel — high-level project statistics and recent activity.
                                        </View>
                                    </Content>
                                </TabItem>
                                <TabItem key="datasets">
                                    <Content>
                                        <View paddingTop="size-150">
                                            Datasets panel — manage training, validation, and test datasets.
                                        </View>
                                    </Content>
                                </TabItem>
                                <TabItem key="models">
                                    <Content>
                                        <View paddingTop="size-150">
                                            Models panel — browse trained models and compare performance metrics.
                                        </View>
                                    </Content>
                                </TabItem>
                                <TabItem key="settings">
                                    <Content>
                                        <View paddingTop="size-150">
                                            Settings panel — configure project-level parameters and integrations.
                                        </View>
                                    </Content>
                                </TabItem>
                            </TabPanels>
                        </Tabs>
                    </div>
                </Flex>
            </View>

            {/* ── Breadcrumbs ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Breadcrumbs" subtitle="hierarchical navigation trail" />
                <Flex direction="column" gap="size-150">
                    <div>
                        <SubLabel>3-level hierarchy</SubLabel>
                        <Breadcrumbs>
                            <BreadcrumbItem key="home">Home</BreadcrumbItem>
                            <BreadcrumbItem key="projects">Projects</BreadcrumbItem>
                            <BreadcrumbItem key="detection">Detection Project</BreadcrumbItem>
                        </Breadcrumbs>
                    </div>
                    <Divider size="S" />
                    <div>
                        <SubLabel>Disabled</SubLabel>
                        <Breadcrumbs isDisabled>
                            <BreadcrumbItem key="home">Home</BreadcrumbItem>
                            <BreadcrumbItem key="projects">Projects</BreadcrumbItem>
                            <BreadcrumbItem key="detection">Detection Project</BreadcrumbItem>
                        </Breadcrumbs>
                    </div>
                    <Divider size="S" />
                    <div>
                        <SubLabel>4-level deep</SubLabel>
                        <Breadcrumbs>
                            <BreadcrumbItem key="home">Home</BreadcrumbItem>
                            <BreadcrumbItem key="projects">Projects</BreadcrumbItem>
                            <BreadcrumbItem key="detection">Detection</BreadcrumbItem>
                            <BreadcrumbItem key="training">Training Run #42</BreadcrumbItem>
                        </Breadcrumbs>
                    </div>
                </Flex>
            </View>

            {/* ── Link ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Link" subtitle="inline anchor element with style variants" />
                <Flex direction="row" gap="size-300" wrap alignItems="center">
                    <Link href="https://example.com">Default link</Link>
                    <Link href="https://example.com" variant="primary">
                        Primary
                    </Link>
                    <Link href="https://example.com" variant="secondary">
                        Secondary
                    </Link>
                    <Link href="https://example.com" isQuiet>
                        Quiet
                    </Link>
                    <Link href="https://example.com" isDisabled>
                        Disabled
                    </Link>
                </Flex>
            </View>

            {/* ── Menu & MenuTrigger ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading
                    title="Menu & MenuTrigger"
                    subtitle="dropdown menus with sections and selection modes"
                />
                <Flex direction="column" gap="size-200">
                    <div>
                        <SubLabel>Menu with sections</SubLabel>
                        <Flex direction="row" gap="size-200" wrap alignItems="center">
                            <MenuTrigger>
                                <ActionButton>Open menu</ActionButton>
                                <Menu>
                                    <MenuSection title="Clipboard">
                                        <MenuItem key="cut">Cut</MenuItem>
                                        <MenuItem key="copy">Copy</MenuItem>
                                        <MenuItem key="paste">Paste</MenuItem>
                                    </MenuSection>
                                    <MenuSection title="Document">
                                        <MenuItem key="bold">Bold</MenuItem>
                                        <MenuItem key="italic">Italic</MenuItem>
                                        <MenuItem key="underline">Underline</MenuItem>
                                    </MenuSection>
                                </Menu>
                            </MenuTrigger>

                            <MenuTrigger>
                                <Button variant="secondary">Sort by</Button>
                                <Menu selectionMode="single" defaultSelectedKeys={['name']}>
                                    <MenuItem key="name">Name</MenuItem>
                                    <MenuItem key="date">Date modified</MenuItem>
                                    <MenuItem key="size">File size</MenuItem>
                                </Menu>
                            </MenuTrigger>

                            <MenuTrigger>
                                <Button variant="secondary">Multi-select</Button>
                                <Menu selectionMode="multiple" defaultSelectedKeys={['labels', 'bbox']}>
                                    <MenuItem key="labels">Show labels</MenuItem>
                                    <MenuItem key="bbox">Show bounding boxes</MenuItem>
                                    <MenuItem key="masks">Show masks</MenuItem>
                                    <MenuItem key="scores">Show scores</MenuItem>
                                </Menu>
                            </MenuTrigger>
                        </Flex>
                    </div>
                </Flex>
            </View>

            {/* ── ActionMenu ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="ActionMenu" subtitle="icon-triggered contextual action menus" />
                <Flex direction="row" gap="size-300" wrap alignItems="center">
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <ActionMenu>
                            <Item key="new">New file</Item>
                            <Item key="open">Open…</Item>
                            <Item key="rename">Rename</Item>
                            <Item key="delete">Delete</Item>
                        </ActionMenu>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Default
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <ActionMenu isQuiet aria-label="Quiet action menu">
                            <Item key="share">Share</Item>
                            <Item key="export">Export</Item>
                            <Item key="archive">Archive</Item>
                        </ActionMenu>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Quiet
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <ActionMenu isDisabled aria-label="Disabled action menu">
                            <Item key="a">Action A</Item>
                            <Item key="b">Action B</Item>
                        </ActionMenu>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Disabled
                        </span>
                    </Flex>
                </Flex>
            </View>

            {/* ── MediaViewModes ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading
                    title="MediaViewModes"
                    subtitle="view mode switcher between Large, Medium, Small, and Details"
                />
                <Flex direction="row" gap="size-200" alignItems="center">
                    <MediaViewModesDemo />
                    <Text>Click the icon to cycle between view modes</Text>
                </Flex>
            </View>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Storybook meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof NavigationKitchenSink> = {
    tags: ['!dev'],
    component: NavigationKitchenSink,
    title: 'Kitchen sink/Navigation',
    parameters: {
        a11y: {},
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof NavigationKitchenSink>;

export const Default: Story = {};
