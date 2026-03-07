// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { useState } from 'react';

import { ButtonGroup, Checkbox, Content, Footer, Heading, Item, Text } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import Move from '@spectrum-icons/workflow/Move';
import Magnify from '@spectrum-icons/workflow/Magnify';
import UploadToCloud from '@spectrum-icons/workflow/UploadToCloud';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';
import ViewList from '@spectrum-icons/workflow/ViewList';
import type { Meta, StoryObj } from '@storybook/react';
import { Button as AriaButton } from 'react-aria-components';

import {
    Accordion,
    ActionBar,
    ActionBarContainer,
    ActionButton,
    ActionMenu,
    AlertDialog,
    AvatarGroup,
    Badge,
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Calendar,
    CardView,
    Cell,
    CheckboxGroup,
    ColorArea,
    ColorField,
    ColorPickerDialog,
    ColorSlider,
    ColorSwatch,
    ColorSwatchPicker,
    ColorSwatchPickerItem,
    ColorWheel,
    Column,
    ComboBox,
    ComboBoxItem,
    ContextualHelp,
    CornerIndicator,
    CustomPopover,
    DateField,
    DatePicker,
    DateRangePicker,
    Dialog,
    DialogTrigger,
    Disclosure,
    DisclosurePanel,
    DisclosureTitle,
    Divider,
    DropZone,
    FileTrigger,
    Flex,
    FullscreenAction,
    Grid,
    IllustratedMessage,
    Image,
    InlineAlert,
    IntelBrandedLoading,
    Link,
    ListBox,
    ListBoxItem,
    ListItem,
    ListView,
    Loading,
    MediaViewModes,
    Menu,
    MenuItem,
    MenuSection,
    MenuTrigger,
    Meter,
    NumberField,
    PasswordField,
    PhotoPlaceholder,
    Picker,
    PickerItem,
    Popover,
    PressableElement,
    ProgressBar,
    ProgressCircle,
    Radio,
    RadioGroup,
    RangeCalendar,
    RangeSlider,
    Row,
    SearchField,
    Skeleton,
    Slider,
    StatusLight,
    Switch,
    TabItem,
    TabList,
    TabPanels,
    TableBody,
    TableHeader,
    TableView,
    Tabs,
    TagGroup,
    TagItem,
    TextArea,
    TextField,
    TimeField,
    ToggleButton,
    ToggleButtons,
    Tooltip,
    TooltipTrigger,
    TreeView,
    View,
    ViewModes,
    Well,
} from '../index';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const FRAMEWORK_OPTIONS = [
    { key: 'react', label: 'React' },
    { key: 'vue', label: 'Vue' },
    { key: 'angular', label: 'Angular' },
    { key: 'svelte', label: 'Svelte' },
    { key: 'solid', label: 'Solid' },
];

const ANIMAL_OPTIONS = [
    { key: 'cat', label: 'Cat' },
    { key: 'dog', label: 'Dog' },
    { key: 'red-panda', label: 'Red Panda' },
    { key: 'axolotl', label: 'Axolotl' },
    { key: 'capybara', label: 'Capybara' },
];

// ---------------------------------------------------------------------------
// Section heading helper
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

// ---------------------------------------------------------------------------
// Sub-section label helper
// ---------------------------------------------------------------------------

interface SubLabelProps {
    children: string;
}

const SubLabel = ({ children }: SubLabelProps) => (
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
// Section 1 — Actions & Primitives
// ---------------------------------------------------------------------------

const ActionsSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 1 — Actions & Primitives"
            subtitle="Button, ActionButton, ToggleButton, Link, FileTrigger"
        />

        {/* Button variants */}
        <Flex direction="column" gap="size-200">
            <div>
                <SubLabel>Button — variants</SubLabel>
                <Flex direction="row" gap="size-150" wrap>
                    <Button variant="accent">Accent</Button>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="negative">Negative</Button>
                    <Button variant="accent" isDisabled>
                        Disabled
                    </Button>
                </Flex>
            </div>

            <Divider size="S" />

            {/* ActionButton variants */}
            <div>
                <SubLabel>ActionButton — color variants</SubLabel>
                <Flex direction="row" gap="size-150" wrap>
                    <ActionButton>Default</ActionButton>
                    <ActionButton colorVariant="dark">Dark</ActionButton>
                    <ActionButton colorVariant="light">Light</ActionButton>
                    <ActionButton colorVariant="blue">Blue</ActionButton>
                    <ActionButton isQuiet>Quiet</ActionButton>
                    <ActionButton isDisabled>Disabled</ActionButton>
                </Flex>
            </div>

            <Divider size="S" />

            {/* ToggleButton variants */}
            <div>
                <SubLabel>ToggleButton — states</SubLabel>
                <Flex direction="row" gap="size-150" wrap>
                    <ToggleButton>Unselected</ToggleButton>
                    <ToggleButton defaultSelected>Pre-selected</ToggleButton>
                    <ToggleButton isEmphasized defaultSelected>
                        Emphasized
                    </ToggleButton>
                    <ToggleButton isQuiet>Quiet</ToggleButton>
                    <ToggleButton isDisabled>Disabled</ToggleButton>
                </Flex>
            </div>

            <Divider size="S" />

            {/* Link variants */}
            <div>
                <SubLabel>Link — variants</SubLabel>
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
                </Flex>
            </div>

            <Divider size="S" />

            {/* FileTrigger */}
            <div>
                <SubLabel>FileTrigger — file upload triggers</SubLabel>
                <Flex direction="row" gap="size-150" wrap>
                    <FileTrigger>
                        <Button variant="accent">Upload file</Button>
                    </FileTrigger>
                    <FileTrigger acceptedFileTypes={['image/*']}>
                        <Button variant="secondary">Images only</Button>
                    </FileTrigger>
                    <FileTrigger allowsMultiple>
                        <ActionButton>Multiple files</ActionButton>
                    </FileTrigger>
                </Flex>
            </div>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Section 2 — Form Controls
// ---------------------------------------------------------------------------

const FormControlsSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 2 — Form Controls"
            subtitle="TextField, TextArea, NumberField, SearchField, PasswordField, CheckboxGroup, RadioGroup, Switch, Slider, RangeSlider, Picker, ComboBox"
        />

        <Grid columns={['1fr', '1fr']} gap="size-300" UNSAFE_style={{ alignItems: 'start' }}>
            {/* Text inputs column */}
            <Flex direction="column" gap="size-250">
                <div>
                    <SubLabel>TextField</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <TextField label="Username" placeholder="Enter username" width="100%" />
                        <TextField
                            label="Email"
                            placeholder="user@example.com"
                            description="We'll never share your email."
                            width="100%"
                        />
                        <TextField label="Disabled field" value="Read-only content" isDisabled width="100%" />
                        <TextField
                            label="Invalid field"
                            defaultValue="bad@"
                            validationState="invalid"
                            errorMessage="Enter a valid email address."
                            width="100%"
                        />
                    </Flex>
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>TextArea</SubLabel>
                    <TextArea label="Description" placeholder="Describe your project…" width="100%" />
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>NumberField</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <NumberField label="Quantity" defaultValue={5} minValue={0} maxValue={100} width="100%" />
                        <NumberField
                            label="Price ($)"
                            defaultValue={9.99}
                            minValue={0}
                            step={0.01}
                            formatOptions={{ style: 'currency', currency: 'USD' }}
                            width="100%"
                        />
                    </Flex>
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>SearchField</SubLabel>
                    <SearchField label="Search projects" placeholder="Type to search…" width="100%" />
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>PasswordField</SubLabel>
                    <PasswordField label="Password" placeholder="Enter password" width="100%" />
                </div>
            </Flex>

            {/* Selection & toggle controls column */}
            <Flex direction="column" gap="size-250">
                <div>
                    <SubLabel>CheckboxGroup</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <CheckboxGroup label="Preferred frameworks" defaultValue={['react', 'svelte']}>
                            <Checkbox value="react">React</Checkbox>
                            <Checkbox value="vue">Vue</Checkbox>
                            <Checkbox value="angular">Angular</Checkbox>
                            <Checkbox value="svelte">Svelte</Checkbox>
                        </CheckboxGroup>
                        <CheckboxGroup label="Horizontal group" orientation="horizontal">
                            <Checkbox value="a">Option A</Checkbox>
                            <Checkbox value="b">Option B</Checkbox>
                            <Checkbox value="c">Option C</Checkbox>
                        </CheckboxGroup>
                    </Flex>
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>RadioGroup</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <RadioGroup label="Deployment target" defaultValue="cloud">
                            <Radio value="cloud">Cloud</Radio>
                            <Radio value="on-prem">On-premises</Radio>
                            <Radio value="edge">Edge device</Radio>
                        </RadioGroup>
                        <RadioGroup label="Alignment" orientation="horizontal">
                            <Radio value="left">Left</Radio>
                            <Radio value="center">Center</Radio>
                            <Radio value="right">Right</Radio>
                        </RadioGroup>
                    </Flex>
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>Switch</SubLabel>
                    <Flex direction="column" gap="size-100">
                        <Switch>Dark mode</Switch>
                        <Switch defaultSelected>Notifications (on)</Switch>
                        <Switch isDisabled>Disabled option</Switch>
                    </Flex>
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>Slider</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <Slider label="Opacity" defaultValue={60} minValue={0} maxValue={100} isFilled width="100%" />
                        <Slider label="Volume" defaultValue={30} minValue={0} maxValue={100} step={10} width="100%" />
                    </Flex>
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>RangeSlider</SubLabel>
                    <RangeSlider
                        label="Confidence threshold"
                        defaultValue={{ start: 20, end: 80 }}
                        minValue={0}
                        maxValue={100}
                        width="100%"
                    />
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>Picker</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <Picker label="Framework" defaultSelectedKey="react" width="100%">
                            {FRAMEWORK_OPTIONS.map(({ key, label }) => (
                                <PickerItem key={key}>{label}</PickerItem>
                            ))}
                        </Picker>
                        <Picker label="Disabled picker" isDisabled width="100%">
                            {FRAMEWORK_OPTIONS.map(({ key, label }) => (
                                <PickerItem key={key}>{label}</PickerItem>
                            ))}
                        </Picker>
                    </Flex>
                </div>

                <Divider size="S" />

                <div>
                    <SubLabel>ComboBox</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <ComboBox label="Favorite animal" defaultSelectedKey="cat" width="100%">
                            {ANIMAL_OPTIONS.map(({ key, label }) => (
                                <ComboBoxItem key={key}>{label}</ComboBoxItem>
                            ))}
                        </ComboBox>
                        <ComboBox label="Search animals" defaultInputValue="Cap" width="100%">
                            {ANIMAL_OPTIONS.map(({ key, label }) => (
                                <ComboBoxItem key={key}>{label}</ComboBoxItem>
                            ))}
                        </ComboBox>
                    </Flex>
                </div>
            </Flex>
        </Grid>
    </View>
);

// ---------------------------------------------------------------------------
// Section 3 — Navigation
// ---------------------------------------------------------------------------

const NavigationSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading title="Section 3 — Navigation" subtitle="Tabs, Breadcrumbs, MenuTrigger / Menu, ActionMenu" />

        <Flex direction="column" gap="size-300">
            {/* Tabs */}
            <div>
                <SubLabel>Tabs — horizontal</SubLabel>
                <Tabs aria-label="Project sections">
                    <TabList>
                        <TabItem key="overview">Overview</TabItem>
                        <TabItem key="datasets">Datasets</TabItem>
                        <TabItem key="models">Models</TabItem>
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
                    </TabPanels>
                </Tabs>
            </div>

            <Divider size="S" />

            {/* Breadcrumbs */}
            <div>
                <SubLabel>Breadcrumbs — 3-level hierarchy</SubLabel>
                <Flex direction="column" gap="size-100">
                    <Breadcrumbs>
                        <BreadcrumbItem key="home">Home</BreadcrumbItem>
                        <BreadcrumbItem key="projects">Projects</BreadcrumbItem>
                        <BreadcrumbItem key="detection">Detection Project</BreadcrumbItem>
                    </Breadcrumbs>
                    <Breadcrumbs isDisabled>
                        <BreadcrumbItem key="home">Home</BreadcrumbItem>
                        <BreadcrumbItem key="projects">Projects</BreadcrumbItem>
                        <BreadcrumbItem key="detection">Detection Project</BreadcrumbItem>
                    </Breadcrumbs>
                </Flex>
            </div>

            <Divider size="S" />

            {/* MenuTrigger / Menu with sections */}
            <div>
                <SubLabel>MenuTrigger / Menu — with sections</SubLabel>
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
                </Flex>
            </div>

            <Divider size="S" />

            {/* ActionMenu */}
            <div>
                <SubLabel>ActionMenu — icon-triggered variant</SubLabel>
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <ActionMenu>
                        <MenuItem key="new">New file</MenuItem>
                        <MenuItem key="open">Open…</MenuItem>
                        <MenuItem key="rename">Rename</MenuItem>
                        <MenuItem key="delete">Delete</MenuItem>
                    </ActionMenu>

                    <ActionMenu isQuiet aria-label="Quiet action menu">
                        <MenuItem key="share">Share</MenuItem>
                        <MenuItem key="export">Export</MenuItem>
                        <MenuItem key="archive">Archive</MenuItem>
                    </ActionMenu>

                    <ActionMenu isDisabled aria-label="Disabled action menu">
                        <MenuItem key="a">Action A</MenuItem>
                        <MenuItem key="b">Action B</MenuItem>
                    </ActionMenu>
                </Flex>
            </div>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Section 4 — Feedback & Status
// ---------------------------------------------------------------------------

const FeedbackSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 4 — Feedback & Status"
            subtitle="ProgressBar, ProgressCircle, Loading, StatusLight, InlineAlert, Badge, Skeleton, Meter"
        />

        <Grid columns={['1fr', '1fr']} gap="size-300" UNSAFE_style={{ alignItems: 'start' }}>
            {/* Left column */}
            <Flex direction="column" gap="size-250">
                {/* ProgressBar */}
                <div>
                    <SubLabel>ProgressBar</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <ProgressBar label="Upload progress" value={65} width="100%" />
                        <ProgressBar label="Processing…" isIndeterminate width="100%" />
                        <ProgressBar label="Storage used" value={82} showValueLabel width="100%" />
                        <ProgressBar
                            label="Over-background"
                            value={95}
                            variant="overBackground"
                            showValueLabel
                            width="100%"
                        />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* ProgressCircle */}
                <div>
                    <SubLabel>ProgressCircle</SubLabel>
                    <Flex direction="row" gap="size-300" alignItems="center">
                        <Flex direction="column" gap="size-50" alignItems="center">
                            <ProgressCircle aria-label="Determinate — 40%" value={40} />
                            <span
                                style={{
                                    fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                    color: 'var(--spectrum-global-color-gray-600)',
                                }}
                            >
                                40% (S)
                            </span>
                        </Flex>
                        <Flex direction="column" gap="size-50" alignItems="center">
                            <ProgressCircle aria-label="Indeterminate" isIndeterminate size="M" />
                            <span
                                style={{
                                    fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                    color: 'var(--spectrum-global-color-gray-600)',
                                }}
                            >
                                Indeterminate (M)
                            </span>
                        </Flex>
                        <Flex direction="column" gap="size-50" alignItems="center">
                            <ProgressCircle aria-label="Large determinate — 75%" value={75} size="L" />
                            <span
                                style={{
                                    fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                    color: 'var(--spectrum-global-color-gray-600)',
                                }}
                            >
                                75% (L)
                            </span>
                        </Flex>
                    </Flex>
                </div>

                <Divider size="S" />

                {/* Loading */}
                <div>
                    <SubLabel>Loading — inline &amp; overlay wrappers</SubLabel>
                    <Flex direction="row" gap="size-400" alignItems="center">
                        <Flex direction="column" gap="size-50" alignItems="center">
                            <Loading mode="inline" size="S" aria-label="Inline loading" />
                            <span
                                style={{
                                    fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                    color: 'var(--spectrum-global-color-gray-600)',
                                }}
                            >
                                inline (S)
                            </span>
                        </Flex>
                        <Flex direction="column" gap="size-50" alignItems="center">
                            <Loading mode="inline" size="M" aria-label="Inline loading M" />
                            <span
                                style={{
                                    fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                    color: 'var(--spectrum-global-color-gray-600)',
                                }}
                            >
                                inline (M)
                            </span>
                        </Flex>
                        <View
                            position="relative"
                            width="size-1200"
                            height="size-1200"
                            backgroundColor="gray-200"
                            borderRadius="regular"
                            UNSAFE_style={{ overflow: 'hidden' }}
                        >
                            <Loading
                                mode="overlay"
                                size="M"
                                aria-label="Overlay loading"
                                style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
                            />
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                    color: 'var(--spectrum-global-color-gray-600)',
                                }}
                            >
                                overlay
                            </span>
                        </View>
                    </Flex>
                </div>

                <Divider size="S" />

                {/* Meter */}
                <div>
                    <SubLabel>Meter</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <Meter label="Storage" value={35} width="100%" />
                        <Meter label="Bandwidth" value={68} variant="warning" width="100%" />
                        <Meter label="CPU load" value={91} variant="critical" showValueLabel width="100%" />
                    </Flex>
                </div>
            </Flex>

            {/* Right column */}
            <Flex direction="column" gap="size-250">
                {/* StatusLight */}
                <div>
                    <SubLabel>StatusLight — semantic variants</SubLabel>
                    <Flex direction="column" gap="size-100">
                        <StatusLight variant="positive">Model training complete</StatusLight>
                        <StatusLight variant="negative">Inference error detected</StatusLight>
                        <StatusLight variant="notice">Annotation in progress</StatusLight>
                        <StatusLight variant="info">Pipeline queued</StatusLight>
                        <StatusLight variant="neutral">Dataset idle</StatusLight>
                        <StatusLight variant="celery">Custom — celery</StatusLight>
                        <StatusLight variant="fuchsia">Custom — fuchsia</StatusLight>
                        <StatusLight variant="indigo">Custom — indigo</StatusLight>
                    </Flex>
                </div>

                <Divider size="S" />

                {/* InlineAlert */}
                <div>
                    <SubLabel>InlineAlert — variants</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <InlineAlert variant="neutral">
                            <Heading>Note</Heading>
                            <Content>
                                This is a neutral inline alert providing helpful context about the current state.
                            </Content>
                        </InlineAlert>
                        <InlineAlert variant="info">
                            <Heading>Did you know?</Heading>
                            <Content>
                                Your session will expire in 10 minutes. Save your work to avoid data loss.
                            </Content>
                        </InlineAlert>
                        <InlineAlert variant="positive">
                            <Heading>Training complete</Heading>
                            <Content>Your model achieved 94.2% mAP on the validation set.</Content>
                        </InlineAlert>
                        <InlineAlert variant="notice">
                            <Heading>Warning</Heading>
                            <Content>Dataset annotations are missing for 12 images. This may affect accuracy.</Content>
                        </InlineAlert>
                        <InlineAlert variant="negative">
                            <Heading>Inference failed</Heading>
                            <Content>The pipeline encountered an error. Check logs for details.</Content>
                        </InlineAlert>
                    </Flex>
                </div>

                <Divider size="S" />

                {/* Badge */}
                <div>
                    <SubLabel>Badge — semantic colors</SubLabel>
                    <Flex direction="row" gap="size-100" wrap>
                        <Badge variant="neutral">Neutral</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge variant="positive">Positive</Badge>
                        <Badge variant="yellow">Yellow</Badge>
                        <Badge variant="negative">Negative</Badge>
                        <Badge variant="seafoam">Seafoam</Badge>
                        <Badge variant="indigo">Indigo</Badge>
                        <Badge variant="purple">Purple</Badge>
                        <Badge variant="fuchsia">Fuchsia</Badge>
                        <Badge variant="magenta">Magenta</Badge>
                        <Badge variant="yellow">Yellow</Badge>
                    </Flex>
                </div>

                <Divider size="S" />

                {/* Skeleton */}
                <div>
                    <SubLabel>Skeleton — rectangle &amp; circle</SubLabel>
                    <Flex direction="column" gap="size-150">
                        {/* Paragraph-like skeleton */}
                        <Flex direction="column" gap="size-65">
                            <Skeleton width="100%" height={16} aria-label="Loading title" />
                            <Skeleton width="80%" height={12} aria-label="Loading subtitle" />
                            <Skeleton width="90%" height={12} aria-label="Loading body line 1" />
                            <Skeleton width="60%" height={12} aria-label="Loading body line 2" />
                        </Flex>
                        {/* Avatar-like circle + text row */}
                        <Flex direction="row" gap="size-150" alignItems="center">
                            <Skeleton isCircle width={40} height={40} aria-label="Loading avatar" />
                            <Flex direction="column" gap="size-50" flex={1}>
                                <Skeleton width="50%" height={14} aria-label="Loading name" />
                                <Skeleton width="35%" height={12} aria-label="Loading role" />
                            </Flex>
                        </Flex>
                        {/* Card-like rectangle */}
                        <Skeleton width="100%" height={80} aria-label="Loading card" />
                    </Flex>
                </div>
            </Flex>
        </Grid>
    </View>
);

// ---------------------------------------------------------------------------
// Section 5 — Overlays
// ---------------------------------------------------------------------------

const TABLE_COLUMNS = [
    { name: 'ID', uid: 'id' },
    { name: 'Name', uid: 'name' },
    { name: 'Status', uid: 'status' },
    { name: 'Role', uid: 'role' },
];

const TABLE_ROWS = [
    { id: 1, name: 'Alice Nguyen', status: 'Active', role: 'Annotator' },
    { id: 2, name: 'Bob Müller', status: 'Idle', role: 'Reviewer' },
    { id: 3, name: 'Carol Smith', status: 'Offline', role: 'Admin' },
];

const OverlaysSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 5 — Overlays"
            subtitle="TooltipTrigger/Tooltip, Popover, CustomPopover, DialogTrigger/Dialog, AlertDialog, ContextualHelp"
        />

        <Flex direction="column" gap="size-300">
            {/* TooltipTrigger / Tooltip */}
            <div>
                <SubLabel>TooltipTrigger / Tooltip — placements</SubLabel>
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
            </div>

            <Divider size="S" />

            {/* Popover */}
            <div>
                <SubLabel>Popover — anchored floating dialog</SubLabel>
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
                </Flex>
            </div>

            <Divider size="S" />

            {/* CustomPopover */}
            <div>
                <SubLabel>CustomPopover — react-aria-components variant with arrow</SubLabel>
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <CustomPopover triggerElement={<AriaButton>Open custom popover</AriaButton>} width={280}>
                        <Flex direction="column" gap="size-100" UNSAFE_style={{ padding: '12px 16px' }}>
                            <strong>Popover header</strong>
                            <p style={{ margin: 0, fontSize: '0.875rem' }}>
                                Custom popover with a fixed 280 px width and structured header + body content.
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
            </div>

            <Divider size="S" />

            {/* DialogTrigger / Dialog */}
            <div>
                <SubLabel>DialogTrigger / Dialog — modal &amp; popover variants</SubLabel>
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    {/* Modal dialog */}
                    <DialogTrigger>
                        <Button variant="accent">Open modal</Button>
                        {(close) => (
                            <Dialog>
                                <Heading>Modal dialog</Heading>
                                <Divider />
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

                    {/* Dismissable dialog */}
                    <DialogTrigger isDismissable>
                        <Button variant="secondary">Dismissable dialog</Button>
                        <Dialog>
                            <Heading>Dismissable</Heading>
                            <Divider />
                            <Content>Click outside or press Escape to dismiss this dialog.</Content>
                        </Dialog>
                    </DialogTrigger>

                    {/* Popover-type dialog */}
                    <DialogTrigger type="popover">
                        <ActionButton>Popover dialog</ActionButton>
                        <Dialog>
                            <Heading>Popover dialog</Heading>
                            <Content>A dialog rendered as a popover overlay.</Content>
                        </Dialog>
                    </DialogTrigger>
                </Flex>
            </div>

            <Divider size="S" />

            {/* AlertDialog */}
            <div>
                <SubLabel>AlertDialog — confirmation, destructive, warning</SubLabel>
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
            </div>

            <Divider size="S" />

            {/* ContextualHelp */}
            <div>
                <SubLabel>ContextualHelp — help &amp; info variants</SubLabel>
                <Flex direction="row" gap="size-400" wrap alignItems="center">
                    <Flex direction="row" gap="size-100" alignItems="center">
                        <Text>Model name</Text>
                        <ContextualHelp variant="help">
                            <Heading>Model name</Heading>
                            <Content>
                                <Text>
                                    Use a descriptive name to help identify this model in your project list. Maximum 64
                                    characters.
                                </Text>
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
                                    accepted. Lowering it increases recall; raising it increases precision.
                                </Text>
                            </Content>
                        </ContextualHelp>
                    </Flex>
                </Flex>
            </div>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Section 6 — Data Display
// ---------------------------------------------------------------------------

const AVATAR_DATA = [
    { src: 'https://i.pravatar.cc/40?img=1', alt: 'Alice Nguyen' },
    { src: 'https://i.pravatar.cc/40?img=2', alt: 'Bob Müller' },
    { src: 'https://i.pravatar.cc/40?img=3', alt: 'Carol Smith' },
    { src: 'https://i.pravatar.cc/40?img=4', alt: 'David Park' },
    { src: 'https://i.pravatar.cc/40?img=5', alt: 'Eva Torres' },
];

const DataDisplaySection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 6 — Data Display"
            subtitle="TableView, ListView, ListBox, TagGroup, AvatarGroup, IllustratedMessage, Image"
        />

        <Flex direction="column" gap="size-300">
            {/* TableView */}
            <div>
                <SubLabel>TableView — sortable columns, selectable rows</SubLabel>
                <TableView aria-label="Team members" selectionMode="multiple" width="100%" height="size-2400">
                    <TableHeader columns={TABLE_COLUMNS}>
                        {(col) => (
                            <Column key={col.uid} allowsSorting>
                                {col.name}
                            </Column>
                        )}
                    </TableHeader>
                    <TableBody items={TABLE_ROWS}>
                        {(item) => <Row>{(columnKey) => <Cell>{item[columnKey as keyof typeof item]}</Cell>}</Row>}
                    </TableBody>
                </TableView>
            </div>

            <Divider size="S" />

            <Grid columns={['1fr', '1fr']} gap="size-300" UNSAFE_style={{ alignItems: 'start' }}>
                {/* Left column */}
                <Flex direction="column" gap="size-250">
                    {/* ListView */}
                    <div>
                        <SubLabel>ListView — single selection</SubLabel>
                        <ListView aria-label="Recent models" selectionMode="single" width="100%" height="size-2000">
                            <ListItem key="det-v3">Detection Model v3</ListItem>
                            <ListItem key="seg-v2">Segmentation Model v2</ListItem>
                            <ListItem key="cls-v4">Classification Model v4</ListItem>
                            <ListItem key="ano-v1">Anomaly Detector v1</ListItem>
                        </ListView>
                    </div>

                    <Divider size="S" />

                    {/* ListBox */}
                    <div>
                        <SubLabel>ListBox — multi-selection</SubLabel>
                        <ListBox
                            aria-label="Select label categories"
                            selectionMode="multiple"
                            defaultSelectedKeys={['person', 'vehicle']}
                            width="100%"
                        >
                            <ListBoxItem key="person">Person</ListBoxItem>
                            <ListBoxItem key="vehicle">Vehicle</ListBoxItem>
                            <ListBoxItem key="animal">Animal</ListBoxItem>
                            <ListBoxItem key="object">Object</ListBoxItem>
                            <ListBoxItem key="background">Background</ListBoxItem>
                        </ListBox>
                    </div>

                    <Divider size="S" />

                    {/* TagGroup */}
                    <div>
                        <SubLabel>TagGroup — removable tags</SubLabel>
                        <TagGroup
                            aria-label="Dataset labels"
                            label="Active labels"
                            onRemove={(keys) => {
                                // eslint-disable-next-line no-console
                                console.log('Removed:', keys);
                            }}
                        >
                            <TagItem key="person">Person</TagItem>
                            <TagItem key="car">Car</TagItem>
                            <TagItem key="bicycle">Bicycle</TagItem>
                            <TagItem key="truck">Truck</TagItem>
                            <TagItem key="traffic-light">Traffic light</TagItem>
                        </TagGroup>
                    </div>
                </Flex>

                {/* Right column */}
                <Flex direction="column" gap="size-250">
                    {/* AvatarGroup */}
                    <div>
                        <SubLabel>AvatarGroup — stacked avatars with overflow badge</SubLabel>
                        <Flex direction="column" gap="size-150">
                            <AvatarGroup avatars={AVATAR_DATA} max={3} />
                            <AvatarGroup avatars={AVATAR_DATA} max={4} size="avatar-size-400" />
                        </Flex>
                    </div>

                    <Divider size="S" />

                    {/* IllustratedMessage */}
                    <div>
                        <SubLabel>IllustratedMessage — empty state</SubLabel>
                        <View
                            borderWidth="thin"
                            borderColor="gray-300"
                            borderRadius="medium"
                            padding="size-300"
                            backgroundColor="gray-75"
                        >
                            <IllustratedMessage>
                                <Magnify size="XXL" />
                                <Heading>No results found</Heading>
                                <Content>
                                    No models match your current filters. Try adjusting your search criteria or clearing
                                    active filters.
                                </Content>
                            </IllustratedMessage>
                        </View>
                    </div>

                    <Divider size="S" />

                    {/* Image */}
                    <div>
                        <SubLabel>Image — placeholder with cover fit</SubLabel>
                        <Image
                            src="https://picsum.photos/seed/geti-ks/480/200"
                            alt="Sample dataset thumbnail"
                            width="100%"
                            height="size-1600"
                            objectFit="cover"
                            UNSAFE_style={{ borderRadius: 'var(--spectrum-alias-border-radius-medium)' }}
                        />
                    </div>
                </Flex>
            </Grid>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Section 7 — Layout & Structure
// ---------------------------------------------------------------------------

const CARD_ITEMS = [
    {
        id: 'det',
        title: 'Object Detection',
        description: 'Locate and classify objects in images using bounding boxes.',
    },
    {
        id: 'seg',
        title: 'Instance Segmentation',
        description: 'Produce pixel-level masks for each detected object instance.',
    },
    {
        id: 'cls',
        title: 'Image Classification',
        description: 'Assign one or more class labels to the entire input image.',
    },
];

const LayoutSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 7 — Layout & Structure"
            subtitle="Accordion, Disclosure, Well, CardView, Divider"
        />

        <Flex direction="column" gap="size-300">
            {/* Accordion */}
            <div>
                <SubLabel>Accordion — collapsible sections</SubLabel>
                <Flex direction="column" gap="size-200">
                    <div>
                        <p
                            style={{
                                margin: '0 0 6px',
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Default (single-expand)
                        </p>
                        <Accordion>
                            <Disclosure>
                                <DisclosureTitle>Dataset Overview</DisclosureTitle>
                                <DisclosurePanel>
                                    <p style={{ margin: '8px 0' }}>
                                        This dataset contains 12 000 annotated images across 8 label categories. Images
                                        were captured in varied lighting conditions to improve model generalisation.
                                    </p>
                                </DisclosurePanel>
                            </Disclosure>
                            <Disclosure>
                                <DisclosureTitle>Training Configuration</DisclosureTitle>
                                <DisclosurePanel>
                                    <p style={{ margin: '8px 0' }}>
                                        Backbone: ResNet-50 · Batch size: 32 · Epochs: 100 · Learning rate: 0.001 ·
                                        Optimizer: AdamW · Mixed-precision: enabled.
                                    </p>
                                </DisclosurePanel>
                            </Disclosure>
                            <Disclosure>
                                <DisclosureTitle>Evaluation Metrics</DisclosureTitle>
                                <DisclosurePanel>
                                    <p style={{ margin: '8px 0' }}>
                                        mAP@0.5: 87.3% · mAP@0.5:0.95: 64.1% · Precision: 91.2% · Recall: 84.6% · F1:
                                        87.8%.
                                    </p>
                                </DisclosurePanel>
                            </Disclosure>
                        </Accordion>
                    </div>
                    <div>
                        <p
                            style={{
                                margin: '0 0 6px',
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Quiet + allowsMultipleExpanded
                        </p>
                        <Accordion isQuiet allowsMultipleExpanded>
                            <Disclosure>
                                <DisclosureTitle>Advanced Settings</DisclosureTitle>
                                <DisclosurePanel>
                                    <p style={{ margin: '8px 0' }}>
                                        Configure augmentation pipelines, custom anchors, and NMS thresholds here.
                                    </p>
                                </DisclosurePanel>
                            </Disclosure>
                            <Disclosure>
                                <DisclosureTitle>Export Options</DisclosureTitle>
                                <DisclosurePanel>
                                    <p style={{ margin: '8px 0' }}>
                                        Export to ONNX, OpenVINO IR, TensorFlow SavedModel, or PyTorch TorchScript.
                                    </p>
                                </DisclosurePanel>
                            </Disclosure>
                        </Accordion>
                    </div>
                </Flex>
            </div>

            <Divider size="S" />

            {/* Standalone Disclosure */}
            <div>
                <SubLabel>Disclosure — standalone collapsible</SubLabel>
                <Flex direction="column" gap="size-150">
                    <Disclosure>
                        <DisclosureTitle>What is a confidence threshold?</DisclosureTitle>
                        <DisclosurePanel>
                            <p style={{ margin: '8px 0' }}>
                                The confidence threshold is the minimum prediction score required for a detection to be
                                included in results. Values closer to 1.0 increase precision; lower values increase
                                recall. A typical starting point is 0.5.
                            </p>
                        </DisclosurePanel>
                    </Disclosure>
                    <Disclosure isExpanded>
                        <DisclosureTitle>Pre-expanded disclosure</DisclosureTitle>
                        <DisclosurePanel>
                            <p style={{ margin: '8px 0' }}>
                                This panel is open by default via <code>isExpanded</code>. It is useful for surfacing
                                critical information that should be visible on first render.
                            </p>
                        </DisclosurePanel>
                    </Disclosure>
                    <Disclosure isDisabled>
                        <DisclosureTitle>Disabled disclosure</DisclosureTitle>
                        <DisclosurePanel>
                            <p style={{ margin: '8px 0' }}>This panel cannot be toggled.</p>
                        </DisclosurePanel>
                    </Disclosure>
                </Flex>
            </div>

            <Divider size="S" />

            {/* Well */}
            <div>
                <SubLabel>Well — non-editable content container</SubLabel>
                <Flex direction="column" gap="size-150">
                    <Well>
                        <Text>
                            <strong>Training complete.</strong> Your model achieved a mean average precision (mAP) of
                            87.3% on the validation set. Review the evaluation metrics above before deploying to
                            production.
                        </Text>
                    </Well>
                    <Well role="region" aria-label="API endpoint">
                        <code
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                            }}
                        >
                            POST https://api.geti.intel.com/v2/projects/&#123;id&#125;/deployments
                        </code>
                    </Well>
                </Flex>
            </div>

            <Divider size="S" />

            {/* CardView */}
            <div>
                <SubLabel>CardView — selectable task cards</SubLabel>
                <CardView
                    aria-label="Available task types"
                    items={CARD_ITEMS}
                    columns={3}
                    gap="16px"
                    renderCard={(item) => ({
                        'aria-label': item.title,
                        children: (
                            <Flex direction="column" gap="size-75">
                                <strong
                                    style={{
                                        fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                                        color: 'var(--spectrum-global-color-gray-800)',
                                    }}
                                >
                                    {item.title}
                                </strong>
                                <span
                                    style={{
                                        fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                        color: 'var(--spectrum-global-color-gray-600)',
                                    }}
                                >
                                    {item.description}
                                </span>
                            </Flex>
                        ),
                        onPress: () => {},
                    })}
                />
                <View marginTop="size-150">
                    <CardView
                        aria-label="Selected card example"
                        items={[CARD_ITEMS[1]]}
                        columns={3}
                        gap="16px"
                        renderCard={(item) => ({
                            'aria-label': `${item.title} (selected)`,
                            isSelected: true,
                            children: (
                                <Flex direction="column" gap="size-75">
                                    <strong
                                        style={{
                                            fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                                            color: 'var(--spectrum-global-color-gray-800)',
                                        }}
                                    >
                                        {item.title} ✓
                                    </strong>
                                    <span
                                        style={{
                                            fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                            color: 'var(--spectrum-global-color-gray-600)',
                                        }}
                                    >
                                        {item.description}
                                    </span>
                                </Flex>
                            ),
                            onPress: () => {},
                        })}
                    />
                </View>
            </div>

            <Divider size="S" />

            {/* Divider */}
            <div>
                <SubLabel>Divider — sizes and orientations</SubLabel>
                <Flex direction="column" gap="size-200">
                    <Flex direction="column" gap="size-100">
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Horizontal — S / M / L
                        </span>
                        <Divider size="S" />
                        <Divider size="M" />
                        <Divider size="L" />
                    </Flex>
                    <Flex direction="row" gap="size-200" alignItems="center" height="size-600">
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Vertical S
                        </span>
                        <Divider orientation="vertical" size="S" />
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Vertical M
                        </span>
                        <Divider orientation="vertical" size="M" />
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Vertical L
                        </span>
                        <Divider orientation="vertical" size="L" />
                    </Flex>
                </Flex>
            </div>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Section 8 — Pickers (Color & Date/Time)
// ---------------------------------------------------------------------------

const PickersSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 8 — Pickers"
            subtitle="ColorArea, ColorSlider, ColorWheel, ColorField, ColorSwatchPicker, ColorPickerDialog, DateField, TimeField, DatePicker, DateRangePicker, Calendar, RangeCalendar"
        />

        <Grid columns={['1fr', '1fr']} gap="size-400" UNSAFE_style={{ alignItems: 'start' }}>
            {/* ── Left column: Color Picker components ── */}
            <Flex direction="column" gap="size-300">
                {/* ColorArea */}
                <div>
                    <SubLabel>ColorArea — 2-D saturation/brightness picker</SubLabel>
                    <Flex direction="column" gap="size-100">
                        <ColorArea defaultValue="hsb(220, 80%, 90%)" xChannel="saturation" yChannel="brightness" />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* ColorSlider */}
                <div>
                    <SubLabel>ColorSlider — single-channel sliders</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <ColorSlider defaultValue="hsl(0, 100%, 50%)" channel="hue" label="Hue" />
                        <ColorSlider defaultValue="hsla(220, 100%, 50%, 0.5)" channel="alpha" label="Alpha" />
                        <ColorSlider defaultValue="#c04000" channel="red" label="Red channel" />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* ColorWheel */}
                <div>
                    <SubLabel>ColorWheel — circular hue picker</SubLabel>
                    <Flex direction="row" gap="size-300" alignItems="center">
                        <ColorWheel defaultValue="hsl(220, 100%, 50%)" />
                        <ColorWheel defaultValue="hsl(0, 80%, 50%)" isDisabled />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* ColorField */}
                <div>
                    <SubLabel>ColorField — hex input</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <ColorField label="Brand colour" defaultValue="#0071e3" width="size-2400" />
                        <ColorField
                            label="Invalid hex"
                            defaultValue="#xyz"
                            validationState="invalid"
                            errorMessage="Enter a valid hex colour."
                            width="size-2400"
                        />
                        <ColorField label="Disabled" defaultValue="#888888" isDisabled width="size-2400" />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* ColorSwatchPicker */}
                <div>
                    <SubLabel>ColorSwatchPicker — preset swatches</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <ColorSwatchPicker aria-label="Label colours" defaultValue="#ff0000">
                            <ColorSwatchPickerItem color="#ff0000" aria-label="Red" />
                            <ColorSwatchPickerItem color="#ff8800" aria-label="Orange" />
                            <ColorSwatchPickerItem color="#ffee00" aria-label="Yellow" />
                            <ColorSwatchPickerItem color="#00cc44" aria-label="Green" />
                            <ColorSwatchPickerItem color="#0071e3" aria-label="Blue" />
                            <ColorSwatchPickerItem color="#9b30ff" aria-label="Purple" />
                            <ColorSwatchPickerItem color="#ff2d78" aria-label="Pink" />
                            <ColorSwatchPickerItem color="#888888" aria-label="Grey" />
                        </ColorSwatchPicker>
                    </Flex>
                </div>

                <Divider size="S" />

                {/* ColorPickerDialog */}
                <div>
                    <SubLabel>ColorPickerDialog — full color picker in a dialog</SubLabel>
                    <Flex direction="row" gap="size-200" wrap alignItems="center">
                        <ColorPickerDialog label="Pick annotation colour" color="#0071e3" />
                        <ColorPickerDialog label="Background fill" color="#00cc44" />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* Inline ColorSwatch reference row */}
                <div>
                    <SubLabel>ColorSwatch — inline swatches at multiple sizes</SubLabel>
                    <Flex direction="row" gap="size-150" alignItems="center" wrap>
                        <ColorSwatch color="#ff0000" size="XS" aria-label="Red XS" />
                        <ColorSwatch color="#ff8800" size="S" aria-label="Orange S" />
                        <ColorSwatch color="#0071e3" size="M" aria-label="Blue M" />
                        <ColorSwatch color="#9b30ff" size="L" aria-label="Purple L" />
                        <ColorSwatch color="#00cc44" rounding="full" size="M" aria-label="Green round" />
                        <ColorSwatch color="#888888" rounding="none" size="M" aria-label="Grey square" />
                    </Flex>
                </div>
            </Flex>

            {/* ── Right column: Date & Time components ── */}
            <Flex direction="column" gap="size-300">
                {/* DateField */}
                <div>
                    <SubLabel>DateField — keyboard date entry</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <DateField label="Start date" width="size-2400" />
                        <DateField label="With time" granularity="minute" width="size-2400" />
                        <DateField
                            label="Invalid date"
                            validationState="invalid"
                            errorMessage="Please enter a valid date."
                            width="size-2400"
                        />
                        <DateField label="Disabled" isDisabled width="size-2400" />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* TimeField */}
                <div>
                    <SubLabel>TimeField — keyboard time entry</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <TimeField label="Start time" width="size-2400" />
                        <TimeField label="With seconds" granularity="second" width="size-2400" />
                        <TimeField label="Disabled" isDisabled width="size-2400" />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* DatePicker */}
                <div>
                    <SubLabel>DatePicker — calendar popover picker</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <DatePicker label="Event date" />
                        <DatePicker label="With time" granularity="minute" />
                        <DatePicker label="Disabled" isDisabled />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* DateRangePicker */}
                <div>
                    <SubLabel>DateRangePicker — start &amp; end date range</SubLabel>
                    <Flex direction="column" gap="size-150">
                        <DateRangePicker label="Training window" />
                        <DateRangePicker label="Disabled range" isDisabled />
                    </Flex>
                </div>

                <Divider size="S" />

                {/* Calendar */}
                <div>
                    <SubLabel>Calendar — inline single-date picker</SubLabel>
                    <Flex direction="row" gap="size-400" wrap alignItems="start">
                        <Flex direction="column" gap="size-75" alignItems="center">
                            <Calendar aria-label="Select annotation date" />
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
                            <Calendar aria-label="Disabled calendar" isDisabled />
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
                </div>

                <Divider size="S" />

                {/* RangeCalendar */}
                <div>
                    <SubLabel>RangeCalendar — inline date-range picker</SubLabel>
                    <Flex direction="column" gap="size-75" alignItems="start">
                        <RangeCalendar aria-label="Select data export range" />
                    </Flex>
                </div>
            </Flex>
        </Grid>
    </View>
);

// ---------------------------------------------------------------------------
// Section 9 — Advanced / Application-Specific
// ---------------------------------------------------------------------------

const ToggleButtonsDemo = () => {
    const [selected, setSelected] = useState<string>('grid');
    return (
        <ToggleButtons
            options={['grid', 'list', 'table']}
            selectedOption={selected}
            onOptionChange={setSelected}
            getLabel={(option) => {
                if (option === 'grid') return <ViewGrid aria-label="Grid view" />;
                if (option === 'list') return <ViewList aria-label="List view" />;
                return <span>{option}</span>;
            }}
        />
    );
};

const MediaViewModesDemo = () => {
    const [viewMode, setViewMode] = useState<ViewModes>(ViewModes.MEDIUM);
    return <MediaViewModes viewMode={viewMode} setViewMode={setViewMode} />;
};

const AdvancedSection = () => (
    <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
        <SectionHeading
            title="Section 9 — Advanced / Application-Specific"
            subtitle="DropZone, ToggleButtons, MediaViewModes, IntelBrandedLoading, TreeView, ActionBar, PressableElement, CornerIndicator, PhotoPlaceholder, FullscreenAction"
        />

        <Flex direction="column" gap="size-300">
            {/* DropZone */}
            <div>
                <SubLabel>DropZone — drop target with button trigger</SubLabel>
                <Flex direction="row" gap="size-300" wrap alignItems="start">
                    <DropZone>
                        <Flex
                            direction="column"
                            gap="size-100"
                            alignItems="center"
                            UNSAFE_style={{ padding: '24px 32px' }}
                        >
                            <UploadToCloud size="L" aria-label="Upload icon" />
                            <Text>Drop files here</Text>
                            <FileTrigger>
                                <Button variant="secondary">Browse files</Button>
                            </FileTrigger>
                        </Flex>
                    </DropZone>
                    <DropZone isFilled>
                        <Flex
                            direction="column"
                            gap="size-100"
                            alignItems="center"
                            UNSAFE_style={{ padding: '24px 32px' }}
                        >
                            <UploadToCloud size="L" aria-label="Upload icon" />
                            <Text>Filled state</Text>
                        </Flex>
                    </DropZone>
                </Flex>
            </div>

            <Divider size="S" />

            {/* ToggleButtons (Segmented Control) */}
            <div>
                <SubLabel>ToggleButtons — segmented control with icons</SubLabel>
                <Flex direction="column" gap="size-150">
                    <ToggleButtonsDemo />
                    <ToggleButtons options={['Day', 'Week', 'Month']} selectedOption="Week" onOptionChange={() => {}} />
                    <ToggleButtons options={['A', 'B', 'C']} selectedOption="B" onOptionChange={() => {}} isDisabled />
                </Flex>
            </div>

            <Divider size="S" />

            {/* MediaViewModes */}
            <div>
                <SubLabel>MediaViewModes — view mode switcher (grid/list/table)</SubLabel>
                <Flex direction="row" gap="size-200" alignItems="center">
                    <MediaViewModesDemo />
                    <Text>Click the icon to cycle between Large, Medium, Small, and Details views</Text>
                </Flex>
            </div>

            <Divider size="S" />

            {/* IntelBrandedLoading */}
            <div>
                <SubLabel>IntelBrandedLoading — Intel branded animation</SubLabel>
                <Flex direction="row" gap="size-400" alignItems="center" wrap>
                    <Flex direction="column" gap="size-100" alignItems="center">
                        <View
                            backgroundColor="gray-200"
                            borderRadius="medium"
                            UNSAFE_style={{ overflow: 'hidden' }}
                            width="size-2400"
                            height="size-2400"
                        >
                            <IntelBrandedLoading height="100%" />
                        </View>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Standard (192 px)
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-100" alignItems="center">
                        <View
                            backgroundColor="gray-200"
                            borderRadius="medium"
                            UNSAFE_style={{ overflow: 'hidden' }}
                            width="size-3600"
                            height="size-3600"
                        >
                            <IntelBrandedLoading height="100%" />
                        </View>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Large container
                        </span>
                    </Flex>
                </Flex>
            </div>

            <Divider size="S" />

            {/* TreeView */}
            <div>
                <SubLabel>TreeView — 3-level hierarchy (folders and files)</SubLabel>
                <TreeView aria-label="Project files" width="size-3600" height="size-2400">
                    <Item textValue="Models">
                        <FolderOpen aria-label="Folder" />
                        <Text>Models</Text>
                        <Item textValue="Detection">
                            <FolderOpen aria-label="Folder" />
                            <Text>Detection</Text>
                            <Item textValue="detector_v3.onnx">detector_v3.onnx</Item>
                            <Item textValue="detector_v3.bin">detector_v3.bin</Item>
                        </Item>
                        <Item textValue="Segmentation">
                            <FolderOpen aria-label="Folder" />
                            <Text>Segmentation</Text>
                            <Item textValue="seg_v2.onnx">seg_v2.onnx</Item>
                        </Item>
                    </Item>
                    <Item textValue="Datasets">
                        <FolderOpen aria-label="Folder" />
                        <Text>Datasets</Text>
                        <Item textValue="train.json">train.json</Item>
                        <Item textValue="val.json">val.json</Item>
                        <Item textValue="test.json">test.json</Item>
                    </Item>
                    <Item textValue="config.yaml">config.yaml</Item>
                </TreeView>
            </div>

            <Divider size="S" />

            {/* ActionBar / ActionBarContainer */}
            <div>
                <SubLabel>ActionBar / ActionBarContainer — selection actions</SubLabel>
                <ActionBarContainer height="size-2400">
                    <ListView
                        aria-label="Dataset images"
                        selectionMode="multiple"
                        defaultSelectedKeys={['img-1', 'img-2']}
                        width="100%"
                    >
                        <ListItem key="img-1">dataset_image_001.jpg</ListItem>
                        <ListItem key="img-2">dataset_image_002.jpg</ListItem>
                        <ListItem key="img-3">dataset_image_003.jpg</ListItem>
                        <ListItem key="img-4">dataset_image_004.jpg</ListItem>
                    </ListView>
                    <ActionBar
                        selectedItemCount={2}
                        onAction={(key) => {
                            // eslint-disable-next-line no-console
                            console.log('ActionBar action:', key);
                        }}
                        onClearSelection={() => {
                            // eslint-disable-next-line no-console
                            console.log('ActionBar cleared');
                        }}
                    >
                        <Item key="move">
                            <Move />
                            <Text>Move</Text>
                        </Item>
                        <Item key="delete">
                            <Delete />
                            <Text>Delete</Text>
                        </Item>
                    </ActionBar>
                </ActionBarContainer>
            </div>

            <Divider size="S" />

            {/* PressableElement */}
            <div>
                <SubLabel>PressableElement — generic pressable wrapper</SubLabel>
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <PressableElement
                        onPress={() => {
                            // eslint-disable-next-line no-console
                            console.log('Pressed text element');
                        }}
                    >
                        <View padding="size-150" backgroundColor="gray-200" borderRadius="medium">
                            <Text>Press me (text)</Text>
                        </View>
                    </PressableElement>
                    <PressableElement
                        onPress={() => {
                            // eslint-disable-next-line no-console
                            console.log('Pressed icon element');
                        }}
                    >
                        <View
                            padding="size-150"
                            backgroundColor="blue-100"
                            borderRadius="medium"
                            UNSAFE_style={{ cursor: 'pointer' }}
                        >
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
            </div>

            <Divider size="S" />

            {/* CornerIndicator */}
            <div>
                <SubLabel>CornerIndicator — notification dot applied to a View</SubLabel>
                <Flex direction="row" gap="size-400" alignItems="center" wrap>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <CornerIndicator isActive>
                            <View
                                width="size-1200"
                                height="size-1200"
                                backgroundColor="gray-300"
                                borderRadius="medium"
                                UNSAFE_style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FolderOpen aria-label="Folder" />
                            </View>
                        </CornerIndicator>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Active (dot visible)
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <CornerIndicator isActive={false}>
                            <View
                                width="size-1200"
                                height="size-1200"
                                backgroundColor="gray-300"
                                borderRadius="medium"
                                UNSAFE_style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FolderOpen aria-label="Folder" />
                            </View>
                        </CornerIndicator>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Inactive (no dot)
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <CornerIndicator isActive>
                            <ActionButton aria-label="Notifications">
                                <UploadToCloud />
                            </ActionButton>
                        </CornerIndicator>
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            On ActionButton
                        </span>
                    </Flex>
                </Flex>
            </div>

            <Divider size="S" />

            {/* PhotoPlaceholder */}
            <div>
                <SubLabel>PhotoPlaceholder — initials avatar with deterministic colour</SubLabel>
                <Flex direction="row" gap="size-300" alignItems="center" wrap>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <PhotoPlaceholder name="Alice Nguyen" indicator="alice@geti.intel.com" />
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Alice N.
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <PhotoPlaceholder name="Bob Müller" indicator="bob@geti.intel.com" />
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Bob M.
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <PhotoPlaceholder
                            name="Carol Smith"
                            indicator="carol@geti.intel.com"
                            width="size-2400"
                            height="size-2400"
                        />
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Carol S. (large)
                        </span>
                    </Flex>
                    <Flex direction="column" gap="size-75" alignItems="center">
                        <PhotoPlaceholder name="David Park" indicator="dpark@geti.intel.com" borderRadius="8px" />
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-50)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            David P. (square)
                        </span>
                    </Flex>
                </Flex>
            </div>

            <Divider size="S" />

            {/* FullscreenAction */}
            <div>
                <SubLabel>FullscreenAction — fullscreen takeover dialog</SubLabel>
                <Flex direction="row" gap="size-200" wrap alignItems="center">
                    <Flex direction="column" gap="size-100" alignItems="start">
                        <span
                            style={{
                                fontSize: 'var(--spectrum-global-dimension-font-size-75)',
                                color: 'var(--spectrum-global-color-gray-600)',
                            }}
                        >
                            Click the fullscreen icon to open
                        </span>
                        <Flex direction="row" gap="size-100" alignItems="center">
                            <FullscreenAction title="Model Viewer" id="ks-fullscreen">
                                <Flex
                                    direction="column"
                                    gap="size-200"
                                    alignItems="center"
                                    justifyContent="center"
                                    height="100%"
                                    UNSAFE_style={{ padding: '40px' }}
                                >
                                    <Text>
                                        This is the fullscreen content area. Use this for immersive editing, annotation,
                                        or viewing experiences where the full viewport is needed.
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
                            <Text>Model Viewer</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </div>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Root KitchenSink component
// ---------------------------------------------------------------------------

const KitchenSink = () => (
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
                    Kitchen Sink
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                        color: 'var(--spectrum-global-color-gray-600)',
                    }}
                >
                    A single-page showcase of all Geti UI components. Use this story to spot visual regressions and
                    inspect component behaviour side-by-side.
                </p>
            </View>

            <Divider size="L" />

            <ActionsSection />
            <FormControlsSection />
            <NavigationSection />
            <FeedbackSection />
            <OverlaysSection />
            <DataDisplaySection />
            <LayoutSection />
            <PickersSection />
            <AdvancedSection />
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Storybook meta & export
// ---------------------------------------------------------------------------

const meta: Meta<typeof KitchenSink> = {
    component: KitchenSink,
    title: 'All/Kitchen Sink',
    parameters: {
        a11y: {},
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof KitchenSink>;

export const Default: Story = {};
