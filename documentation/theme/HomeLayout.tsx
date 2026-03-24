import { Fragment, useState } from 'react';
import {
    LineChart,
    BarChart,
    DonutChart,
    Sparkline,
    ChartsThemeProvider,
    getDatasetSubsetColor,
    ConfusionMatrixChart,
    ParallelCoordinates,
} from '@geti-ai/charts';
import {
    Button,
    TextField,
    Picker,
    PickerItem,
    Switch,
    Checkbox,
    Slider,
    Badge,
    StatusLight,
    ProgressBar,
    TagGroup,
    TagItem,
    ActionButton,
    Tabs,
    TabPanels,
    TabItem,
    View,
    Text,
    Divider,
    Flex,
    ButtonGroup,
    TableView,
    TableHeader,
    TableBody,
    Column,
    Row,
    Cell,
} from '@geti-ai/ui';
import {
    MediaGrid,
    MediaGridThumbnailItem,
    MediaGridItemStatus,
    LogsContent,
    ManagedTab,
    OverflowableTabs,
} from '@geti-ai/blocks';
import type { LogEntryData, ManagedTabAction } from '@geti-ai/blocks';
import {
    Copy,
    Checkmark,
    Add,
    Delete,
    Edit,
    Filter,
    Search,
    Gear,
    Model,
    Polygon,
    BoundingBox,
    DetectionTool,
    Datasets,
    AnalyticsIcon,
    AiIcon,
    Visible,
    Lock,
    Refresh,
    Play,
    SegmentAnythingIcon,
    Watershed,
    MagicWandIcon,
    QuickSelection,
    Tag as TagIcon,
    Image as ImageIcon,
    GraphChart,
    Deployments,
    ChevronLeft,
    ChevronRight,
} from '@geti-ai/ui/icons';
import {
    WorkInProgressIcon,
    NotFound,
    FireWorks,
    MediaUpload,
    DeploymentImg,
    ConnectionLost,
} from '@geti-ai/ui/assets/images';
import {
    DetectionImg,
    SegmentationImg,
    ClassificationImg,
    AnomalyDetectionImg,
    KeypointDetectionImg,
    DetectionRotatedImg,
} from '@geti-ai/ui/assets/domains';
import { Icon } from '@adobe/react-spectrum';
import { HomeFooter } from '@rspress/core/theme-original';
import type { HomeLayoutProps } from '@rspress/core/theme-original';

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const heroStats = [
    { value: '116', label: 'Components', href: '/components/ui/Button' },
    { value: '48', label: 'Charts', href: '/charts/overview' },
    { value: '34', label: 'Blocks', href: '/blocks/installation' },
    { value: '7', label: 'Smart Tools', href: '/smart-tools/installation' },
    { value: '194', label: 'Assets', href: '/assets/icons' },
    { value: '8', label: 'MCP Tools', href: '/ai/overview' },
];

const trainingTrend = [
    { step: 'S1', train: 0.42, val: 0.38, test: 0.35 },
    { step: 'S2', train: 0.56, val: 0.49, test: 0.46 },
    { step: 'S3', train: 0.64, val: 0.57, test: 0.53 },
    { step: 'S4', train: 0.73, val: 0.65, test: 0.61 },
    { step: 'S5', train: 0.79, val: 0.71, test: 0.68 },
    { step: 'S6', train: 0.84, val: 0.76, test: 0.73 },
];

const classMetrics = [
    { class: 'Car', precision: 0.92, recall: 0.88, f1: 0.9 },
    { class: 'Person', precision: 0.87, recall: 0.91, f1: 0.89 },
    { class: 'Bike', precision: 0.79, recall: 0.82, f1: 0.8 },
    { class: 'Truck', precision: 0.84, recall: 0.76, f1: 0.8 },
];

const sparkAccuracy = [
    { v: 0.3 },
    { v: 0.45 },
    { v: 0.52 },
    { v: 0.61 },
    { v: 0.68 },
    { v: 0.74 },
    { v: 0.79 },
    { v: 0.83 },
];

const sparkLoss = [
    { v: 1.2 },
    { v: 0.94 },
    { v: 0.78 },
    { v: 0.62 },
    { v: 0.51 },
    { v: 0.43 },
    { v: 0.38 },
    { v: 0.34 },
];

const sparkF1 = [{ v: 0.25 }, { v: 0.39 }, { v: 0.5 }, { v: 0.58 }, { v: 0.66 }, { v: 0.72 }, { v: 0.77 }, { v: 0.81 }];

const sparkLR = [
    { v: 0.01 },
    { v: 0.01 },
    { v: 0.008 },
    { v: 0.006 },
    { v: 0.004 },
    { v: 0.003 },
    { v: 0.002 },
    { v: 0.001 },
];

const sparkPrecision = [
    { v: 0.55 },
    { v: 0.62 },
    { v: 0.68 },
    { v: 0.74 },
    { v: 0.79 },
    { v: 0.83 },
    { v: 0.86 },
    { v: 0.89 },
];

const sparkMAP = [
    { v: 0.21 },
    { v: 0.35 },
    { v: 0.44 },
    { v: 0.53 },
    { v: 0.59 },
    { v: 0.64 },
    { v: 0.69 },
    { v: 0.73 },
];

const classDistribution = [
    { name: 'Car', count: 1240 },
    { name: 'Person', count: 890 },
    { name: 'Bike', count: 430 },
    { name: 'Truck', count: 280 },
    { name: 'Bus', count: 160 },
];

const confusionLabels = ['Car', 'Person', 'Bike', 'Truck'];
const confusionMatrix = [
    [112, 3, 1, 4],
    [2, 98, 5, 0],
    [1, 4, 82, 3],
    [5, 0, 2, 76],
];

const parallelData = [
    { id: 'run-1', lr: 0.001, batchSize: 16, epochs: 50, dropout: 0.1, mAP: 0.72 },
    { id: 'run-2', lr: 0.005, batchSize: 32, epochs: 30, dropout: 0.2, mAP: 0.68 },
    { id: 'run-3', lr: 0.01, batchSize: 64, epochs: 40, dropout: 0.15, mAP: 0.74 },
    { id: 'run-4', lr: 0.002, batchSize: 16, epochs: 60, dropout: 0.3, mAP: 0.71 },
    { id: 'run-5', lr: 0.008, batchSize: 32, epochs: 50, dropout: 0.05, mAP: 0.76 },
    { id: 'run-6', lr: 0.003, batchSize: 48, epochs: 35, dropout: 0.25, mAP: 0.69 },
    { id: 'run-7', lr: 0.006, batchSize: 24, epochs: 45, dropout: 0.12, mAP: 0.73 },
    { id: 'run-8', lr: 0.004, batchSize: 64, epochs: 55, dropout: 0.08, mAP: 0.75 },
];

const MEDIA_STATUSES = ['Annotated', 'Not annotated', 'Skipped'] as const;
const mediaItems = Array.from({ length: 40 }, (_, i) => ({
    id: String(i + 1),
    name: `image_${String(i + 1).padStart(3, '0')}.jpg`,
    status: MEDIA_STATUSES[i % 3],
    src: `https://picsum.photos/seed/geti${i + 1}/150/150`,
}));

const sampleLogs: LogEntryData[] = [
    {
        record: {
            time: { timestamp: 1710000000 },
            level: { name: 'INFO' },
            message: 'Training job started — detection model v2.1',
        },
    },
    {
        record: {
            time: { timestamp: 1710000015 },
            level: { name: 'INFO' },
            message: 'Using device: CUDA (NVIDIA A100-SXM4-40GB)',
        },
    },
    {
        record: {
            time: { timestamp: 1710000030 },
            level: { name: 'INFO' },
            message: 'Loading dataset: "Factory Floor" (1,240 images)',
        },
    },
    {
        record: {
            time: { timestamp: 1710000045 },
            level: { name: 'WARNING' },
            message: 'Low annotation coverage: 23% of images lack bounding boxes',
        },
    },
    {
        record: {
            time: { timestamp: 1710000060 },
            level: { name: 'INFO' },
            message: 'Data augmentation enabled: flip, rotate, color jitter, mosaic',
        },
    },
    {
        record: {
            time: { timestamp: 1710000120 },
            level: { name: 'SUCCESS' },
            message: 'Epoch 1/50 complete — loss: 0.842, mAP: 0.312',
        },
    },
    {
        record: {
            time: { timestamp: 1710000240 },
            level: { name: 'INFO' },
            message: 'Epoch 2/50 complete — loss: 0.614, mAP: 0.487',
        },
    },
    {
        record: {
            time: { timestamp: 1710000300 },
            level: { name: 'SUCCESS' },
            message: 'Epoch 3/50 complete — loss: 0.483, mAP: 0.591',
        },
    },
    {
        record: {
            time: { timestamp: 1710000360 },
            level: { name: 'ERROR' },
            message: 'CUDA out of memory — reducing batch size from 32 to 16',
        },
    },
    {
        record: {
            time: { timestamp: 1710000375 },
            level: { name: 'WARNING' },
            message: 'Gradient overflow detected at layer backbone.stage4 — scaling adjusted',
        },
    },
    {
        record: {
            time: { timestamp: 1710000420 },
            level: { name: 'INFO' },
            message: 'Resuming training with batch size 16',
        },
    },
    {
        record: {
            time: { timestamp: 1710000480 },
            level: { name: 'SUCCESS' },
            message: 'Epoch 4/50 complete — loss: 0.391, mAP: 0.654',
        },
    },
];

const showcaseIcons = [
    { Icon: Add, name: 'Add' },
    { Icon: Delete, name: 'Delete' },
    { Icon: Edit, name: 'Edit' },
    { Icon: Filter, name: 'Filter' },
    { Icon: Search, name: 'Search' },
    { Icon: Gear, name: 'Gear' },
    { Icon: Model, name: 'Model' },
    { Icon: Polygon, name: 'Polygon' },
    { Icon: BoundingBox, name: 'BoundingBox' },
    { Icon: DetectionTool, name: 'DetectionTool' },
    { Icon: Datasets, name: 'Datasets' },
    { Icon: AnalyticsIcon, name: 'AnalyticsIcon' },
    { Icon: AiIcon, name: 'AiIcon' },
    { Icon: Copy, name: 'Copy' },
    { Icon: Visible, name: 'Visible' },
    { Icon: Lock, name: 'Lock' },
    { Icon: Refresh, name: 'Refresh' },
    { Icon: Play, name: 'Play' },
    { Icon: SegmentAnythingIcon, name: 'SAM' },
    { Icon: Watershed, name: 'Watershed' },
    { Icon: TagIcon, name: 'Tag' },
    { Icon: ImageIcon, name: 'Image' },
    { Icon: GraphChart, name: 'GraphChart' },
    { Icon: Deployments, name: 'Deployments' },
] as const;

const showcaseIllustrations = [
    { Component: WorkInProgressIcon, name: 'WorkInProgress' },
    { Component: NotFound, name: 'NotFound' },
    { Component: FireWorks, name: 'FireWorks' },
    { Component: MediaUpload, name: 'MediaUpload' },
    { Component: DeploymentImg, name: 'DeploymentImg' },
    { Component: ConnectionLost, name: 'ConnectionLost' },
] as const;

const showcaseDomains = [
    { Component: DetectionImg, name: 'Detection' },
    { Component: SegmentationImg, name: 'Segmentation' },
    { Component: ClassificationImg, name: 'Classification' },
    { Component: AnomalyDetectionImg, name: 'Anomaly' },
    { Component: KeypointDetectionImg, name: 'Keypoint' },
    { Component: DetectionRotatedImg, name: 'Rotated' },
] as const;

const smartTools = [
    { Icon: SegmentAnythingIcon, name: 'Segment Anything', href: '/smart-tools/segment-anything' },
    { Icon: MagicWandIcon, name: 'RITM', href: '/smart-tools/ritm' },
    { Icon: QuickSelection, name: 'GrabCut', href: '/smart-tools/grabcut' },
    { Icon: Watershed, name: 'Watershed', href: '/smart-tools/watershed' },
    { Icon: DetectionTool, name: 'SSIM', href: '/smart-tools/ssim' },
    { Icon: Polygon, name: 'Intelligent Scissors', href: '/smart-tools/intelligent-scissors' },
] as const;

// ---------------------------------------------------------------------------
// Tabs demo data + component
// ---------------------------------------------------------------------------

type TabsDataset = { id: string; name: string; images: number };

const TAB_ACTIONS: ManagedTabAction[] = [
    { key: 'edit', label: 'Edit dataset name' },
    { key: 'delete', label: 'Delete dataset' },
    { key: 'export', label: 'Export dataset' },
];

const initialTabDatasets: TabsDataset[] = [
    { id: 'train', name: 'Training set', images: 1240 },
    { id: 'val', name: 'Validation set', images: 340 },
    { id: 'test', name: 'Testing set', images: 510 },
    { id: 'night', name: 'Night shift', images: 188 },
    { id: 'drift', name: 'Drift watch', images: 72 },
    { id: 'archive', name: 'Archive', images: 3210 },
    { id: 'edge', name: 'Edge cases', images: 94 },
];

const createDataset = (index: number): TabsDataset => ({
    id: `dataset-${index + 1}`,
    name: `Dataset ${index + 1}`,
    images: 100 + (index + 1) * 25,
});

function TabsDemo() {
    const [datasets, setDatasets] = useState(initialTabDatasets);
    const [selectedId, setSelectedId] = useState(initialTabDatasets[0].id);
    const [lastAction, setLastAction] = useState('No action yet.');

    const onItemAction = (action: string, dataset: TabsDataset) => {
        if (action === 'delete') {
            if (datasets.length <= 1) {
                setLastAction('Cannot delete the only remaining dataset.');
                return;
            }
            const next = datasets.filter((d) => d.id !== dataset.id);
            setDatasets(next);
            setSelectedId(next[0].id);
            setLastAction(`Deleted dataset "${dataset.name}".`);
            return;
        }
        if (action === 'edit') {
            setDatasets((current) =>
                current.map((d) =>
                    d.id === dataset.id && !d.name.endsWith(' (edited)') ? { ...d, name: `${d.name} (edited)` } : d
                )
            );
            setLastAction(`Edited dataset "${dataset.name}".`);
            return;
        }
        setLastAction(`${action} triggered for "${dataset.name}".`);
    };

    const onAddDataset = () => {
        const next = createDataset(datasets.length);
        setDatasets((current) => [...current, next]);
        setSelectedId(next.id);
        setLastAction(`Added dataset "${next.name}".`);
    };

    return (
        <Tabs
            aria-label="Datasets"
            selectedKey={selectedId}
            onSelectionChange={(key: string) => setSelectedId(String(key))}
        >
            <OverflowableTabs
                items={datasets}
                selectedKey={selectedId}
                onSelectionChange={setSelectedId}
                getItemId={(d: TabsDataset) => d.id}
                getItemLabel={(d: TabsDataset) => d.name}
                overflowAriaLabel="Collapsed datasets"
                renderTab={(dataset: TabsDataset, isActive: boolean) => (
                    <ManagedTab
                        label={dataset.name}
                        isSelected={isActive}
                        actions={TAB_ACTIONS}
                        onAction={(action: string) => onItemAction(action, dataset)}
                    />
                )}
                trailingContent={
                    <ActionButton isQuiet aria-label="Add dataset" onPress={onAddDataset}>
                        <Icon>
                            <Add />
                        </Icon>
                    </ActionButton>
                }
            />
            <TabPanels>
                {datasets.map((dataset) => (
                    <TabItem key={dataset.id}>
                        <View paddingTop="size-150">
                            <Text>
                                <strong>{dataset.name}</strong>
                            </Text>
                            <Text>{dataset.images} images</Text>
                            <Text>Last action: {lastAction}</Text>
                        </View>
                    </TabItem>
                ))}
            </TabPanels>
        </Tabs>
    );
}

// ---------------------------------------------------------------------------
// Install command with copy button
// ---------------------------------------------------------------------------

function InstallCommand({
    command,
    variant = 'default',
    label,
}: {
    command: string;
    variant?: 'default' | 'subtle';
    label?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <div className={`geti-home-install-wrapper${variant === 'subtle' ? ' geti-home-install-wrapper--subtle' : ''}`}>
            {label && <span className="geti-home-install__label">{label}</span>}
            <button
                type="button"
                className={`geti-home-install${variant === 'subtle' ? ' geti-home-install--subtle' : ''}${
                    copied ? ' geti-home-install--copied' : ''
                }`}
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : `Copy: ${command}`}
            >
                <code className="geti-home-install__code">{command}</code>
                <span
                    className={`geti-home-install__icon${copied ? ' geti-home-install__icon--copied' : ''}`}
                    aria-hidden="true"
                >
                    {copied ? (
                        <Icon size="XS">
                            <Checkmark />
                        </Icon>
                    ) : (
                        <Icon size="XS">
                            <Copy />
                        </Icon>
                    )}
                </span>
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Home layout
// ---------------------------------------------------------------------------

export const HomeLayout = (props: HomeLayoutProps) => {
    const { beforeHero, afterHero, beforeFeatures, afterFeatures } = props;

    return (
        <Fragment>
            <div className="rp-home-background geti-home-bg" />

            {beforeHero}
            <main className="geti-home-wrapper">
                {/* ───────────────── Hero ───────────────── */}
                <section className="geti-home-hero">
                    <div className="geti-home-hero__inner">
                        <div className="geti-home-hero__panel">
                            <p className="geti-home-hero__eyebrow">Geti Packages</p>
                            <h1 className="geti-home-hero__title">Build Interactive AI Applications</h1>
                            <p className="geti-home-hero__subtitle">
                                UI components, charts, building blocks, icons, and AI tooling. Six packages designed to
                                work together for interactive AI workflows.
                            </p>
                            <div className="geti-home-hero__actions">
                                <a className="geti-home-btn geti-home-btn--primary" href="/components/installation">
                                    Get Started
                                </a>
                                <a className="geti-home-btn geti-home-btn--secondary" href="/examples">
                                    Explore Examples
                                </a>
                            </div>
                            <InstallCommand command="npx skills add https://docs.geti-ui.markredeman.nl" />
                        </div>

                        <div className="geti-home-hero__stats">
                            {heroStats.map(({ value, label, href }) => (
                                <a key={label} className="geti-home-stat" href={href}>
                                    <span className="geti-home-stat__value">{value}</span>
                                    <span className="geti-home-stat__label">{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
                {afterHero}

                {beforeFeatures}

                {/* ───────────────── Section 1: @geti-ai/ui ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ai/ui">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">Core UI</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/ui</h2>
                            <p className="geti-home-showcase__desc">
                                Accessible, themeable React components for interactive AI workflows. 90+ components
                                built on Adobe React Spectrum and react-aria-components, with dark-mode-first styling.
                            </p>
                            <InstallCommand command="npm install @geti-ai/ui" />
                            <InstallCommand
                                command="npx skills add https://docs.geti-ui.markredeman.nl/.well-known/skills/geti-ui"
                                variant="subtle"
                                label="Integrate with your favorite AI tools"
                            />
                            <a className="geti-home-showcase__link" href="/components/ui/Button">
                                Explore 90+ components &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media geti-home-ui-demos">
                            {/* ── Toolbar (full width) ── */}
                            <div className="geti-home-demo-panel geti-home-demo-panel--full geti-home-ui-toolbar">
                                <Flex justifyContent="space-between" width="100%">
                                    <Flex alignItems="center" gap="size-200">
                                        <Picker
                                            label="Active model"
                                            labelPosition="side"
                                            defaultSelectedKey="sam"
                                            isQuiet
                                            aria-label="Model"
                                            width="size-2000"
                                        >
                                            <PickerItem key="sam">LVM: SAM</PickerItem>
                                            <PickerItem key="yolo">YOLO v8</PickerItem>
                                        </Picker>
                                        <Divider orientation="vertical" size="S" />
                                        <Switch>Explanation</Switch>
                                        <Switch defaultSelected>Annotations</Switch>
                                        <Picker defaultSelectedKey="hearts" isQuiet aria-label="Suit">
                                            <PickerItem key="hearts">Hearts</PickerItem>
                                            <PickerItem key="diamonds">Diamonds</PickerItem>
                                            <PickerItem key="spades">Spades</PickerItem>
                                            <PickerItem key="clubs">Clubs</PickerItem>
                                        </Picker>
                                    </Flex>
                                    <Flex gap="size-200">
                                        <Flex gap="size-50">
                                            <ActionButton isQuiet aria-label="Previous">
                                                <Icon>
                                                    <ChevronLeft />
                                                </Icon>
                                            </ActionButton>
                                            <ActionButton isQuiet aria-label="Next">
                                                <Icon>
                                                    <ChevronRight />
                                                </Icon>
                                            </ActionButton>
                                        </Flex>
                                        <Divider orientation="vertical" size="S" />
                                        <Button variant="accent">Submit</Button>
                                    </Flex>
                                </Flex>
                            </div>

                            {/* ── Run test dialog ── */}
                            <div className="geti-home-demo-panel geti-home-ui-form">
                                <span className="geti-home-demo-panel__heading">Run test</span>
                                <TextField label="Test name" defaultValue="Nightly regression" width="100%" />
                                <div className="geti-home-demo-row geti-home-demo-row--form">
                                    <Picker label="Model" defaultSelectedKey="yolo" width="100%">
                                        <PickerItem key="yolo">YOLO v8</PickerItem>
                                        <PickerItem key="ssd">SSD MobileNet</PickerItem>
                                        <PickerItem key="atss">ATSS</PickerItem>
                                    </Picker>
                                    <Picker label="Version" defaultSelectedKey="v3" width="100%">
                                        <PickerItem key="v1">v1.0</PickerItem>
                                        <PickerItem key="v2">v2.0</PickerItem>
                                        <PickerItem key="v3">v3.0</PickerItem>
                                    </Picker>
                                </div>
                                <Picker label="Optimization" defaultSelectedKey="fp16" width="100%">
                                    <PickerItem key="fp16">OpenVINO FP16</PickerItem>
                                    <PickerItem key="fp32">OpenVINO FP32</PickerItem>
                                    <PickerItem key="int8">OpenVINO Int8</PickerItem>
                                </Picker>
                                <Picker label="Dataset" defaultSelectedKey="val" width="100%">
                                    <PickerItem key="train">Training set</PickerItem>
                                    <PickerItem key="val">Validation set</PickerItem>
                                    <PickerItem key="test">Testing set</PickerItem>
                                </Picker>
                                <ButtonGroup align="end">
                                    <Button variant="secondary">Cancel</Button>
                                    <Button variant="accent">Run test</Button>
                                </ButtonGroup>
                            </div>

                            {/* ── Test results table ── */}
                            <div className="geti-home-demo-panel">
                                <span className="geti-home-demo-panel__heading">Test results</span>
                                <div className="geti-home-demo-row">
                                    <Badge variant="positive">3 passed</Badge>
                                    <Badge variant="negative">1 failed</Badge>
                                    <StatusLight variant="positive">Deployed</StatusLight>
                                    <StatusLight variant="notice">Queued</StatusLight>
                                </div>
                                <ProgressBar label="Test progress" value={75} />
                                <TableView aria-label="Recent test runs" overflowMode="truncate">
                                    <TableHeader>
                                        <Column key="name" isRowHeader>
                                            Test name
                                        </Column>
                                        <Column key="model">Model</Column>
                                        <Column key="score">Score</Column>
                                        <Column key="status">Status</Column>
                                    </TableHeader>
                                    <TableBody>
                                        <Row key="1">
                                            <Cell>Nightly regression</Cell>
                                            <Cell>YOLO v8</Cell>
                                            <Cell>0.92</Cell>
                                            <Cell>Passed</Cell>
                                        </Row>
                                        <Row key="2">
                                            <Cell>Edge cases</Cell>
                                            <Cell>SSD MobileNet</Cell>
                                            <Cell>0.78</Cell>
                                            <Cell>Failed</Cell>
                                        </Row>
                                        <Row key="3">
                                            <Cell>Drift detection</Cell>
                                            <Cell>ATSS</Cell>
                                            <Cell>0.88</Cell>
                                            <Cell>Passed</Cell>
                                        </Row>
                                    </TableBody>
                                </TableView>
                                <TagGroup aria-label="Labels">
                                    <TagItem key="car">Car</TagItem>
                                    <TagItem key="person">Person</TagItem>
                                    <TagItem key="bike">Bike</TagItem>
                                    <TagItem key="truck">Truck</TagItem>
                                </TagGroup>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 2: @geti-ai/charts ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ai/charts">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">Charts</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/charts</h2>
                            <p className="geti-home-showcase__desc">
                                Recharts-based primitives and ML-focused compositions. Standard charts for dashboards,
                                plus specialized visualizations for training metrics, confusion matrices,
                                precision-recall curves, and more.
                            </p>
                            <InstallCommand command="npm install @geti-ai/charts" />
                            <InstallCommand
                                command="npx skills add https://docs.geti-ui.markredeman.nl/.well-known/skills/geti-ui-charts"
                                variant="subtle"
                                label="Integrate with your favorite AI tools"
                            />
                            <a className="geti-home-showcase__link" href="/charts/compositions">
                                See all chart compositions &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media">
                            <ChartsThemeProvider>
                                {/* Sparklines — full-width row on top */}
                                <div className="geti-home-demo-panel">
                                    <div className="geti-home-sparkline-row">
                                        <div className="geti-home-sparkline-item">
                                            <span className="geti-home-sparkline-label">Loss</span>
                                            <Sparkline
                                                data={sparkLoss}
                                                dataKey="v"
                                                height={32}
                                                width={120}
                                                color="#ff5662"
                                                area
                                                fillOpacity={0.18}
                                            />
                                        </div>
                                        <div className="geti-home-sparkline-item">
                                            <span className="geti-home-sparkline-label">Accuracy</span>
                                            <Sparkline
                                                data={sparkAccuracy}
                                                dataKey="v"
                                                height={32}
                                                width={120}
                                                color="#6ee7d8"
                                            />
                                        </div>
                                        <div className="geti-home-sparkline-item">
                                            <span className="geti-home-sparkline-label">F1</span>
                                            <Sparkline
                                                data={sparkF1}
                                                dataKey="v"
                                                height={32}
                                                width={120}
                                                color="#3fd0ff"
                                                area
                                                fillOpacity={0.15}
                                            />
                                        </div>
                                        <div className="geti-home-sparkline-item">
                                            <span className="geti-home-sparkline-label">LR</span>
                                            <Sparkline
                                                data={sparkLR}
                                                dataKey="v"
                                                height={32}
                                                width={120}
                                                color="#fec91b"
                                            />
                                        </div>
                                        <div className="geti-home-sparkline-item">
                                            <span className="geti-home-sparkline-label">Precision</span>
                                            <Sparkline
                                                data={sparkPrecision}
                                                dataKey="v"
                                                height={32}
                                                width={120}
                                                color="#8bae46"
                                                area
                                                fillOpacity={0.15}
                                            />
                                        </div>
                                        <div className="geti-home-sparkline-item">
                                            <span className="geti-home-sparkline-label">mAP</span>
                                            <Sparkline
                                                data={sparkMAP}
                                                dataKey="v"
                                                height={32}
                                                width={120}
                                                color="#8f5da2"
                                                area
                                                fillOpacity={0.2}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Chart compositions ── */}
                                <View marginTop="size-200">
                                    <a className="geti-home-demo-heading" href="/charts/compositions">
                                        Chart compositions
                                    </a>
                                </View>
                                <div className="geti-home-charts-demos">
                                    <div className="geti-home-demo-panel">
                                        <LineChart
                                            data={trainingTrend}
                                            xAxisKey="step"
                                            yScale={{ domain: [0, 1] }}
                                            series={[
                                                {
                                                    dataKey: 'train',
                                                    name: 'Train',
                                                    color: getDatasetSubsetColor('train'),
                                                },
                                                {
                                                    dataKey: 'val',
                                                    name: 'Validation',
                                                    color: getDatasetSubsetColor('validation'),
                                                    dashed: true,
                                                },
                                                {
                                                    dataKey: 'test',
                                                    name: 'Test',
                                                    color: getDatasetSubsetColor('test'),
                                                    dashed: true,
                                                },
                                            ]}
                                            showLegend
                                            aria-label="Model quality trend"
                                            height={200}
                                        />
                                    </div>
                                    <div className="geti-home-demo-panel">
                                        <BarChart
                                            data={classMetrics}
                                            xAxisKey="class"
                                            series={[
                                                { dataKey: 'precision', name: 'Precision', color: '#3fd0ff' },
                                                { dataKey: 'recall', name: 'Recall', color: '#6ee7d8' },
                                                { dataKey: 'f1', name: 'F1 Score', color: '#8bae46' },
                                            ]}
                                            yScale={{ domain: [0, 1] }}
                                            height={200}
                                            showLegend
                                            aria-label="Per-class metrics"
                                        />
                                    </div>
                                    <div className="geti-home-demo-panel">
                                        <DonutChart
                                            data={classDistribution}
                                            valueKey="count"
                                            nameKey="name"
                                            height={200}
                                            showLegend
                                            aria-label="Class distribution"
                                        />
                                    </div>
                                </div>

                                {/* ── Machine learning charts ── */}
                                <View marginTop="size-200">
                                    <a className="geti-home-demo-heading" href="/charts/compositions">
                                        Machine learning charts
                                    </a>
                                </View>
                                <div className="geti-home-charts-ml-demos">
                                    <div className="geti-home-demo-panel">
                                        <ConfusionMatrixChart
                                            matrix={confusionMatrix}
                                            labels={confusionLabels}
                                            height={280}
                                            aria-label="Confusion matrix"
                                        />
                                    </div>
                                    <div className="geti-home-demo-panel">
                                        <ParallelCoordinates
                                            data={parallelData}
                                            axes={[
                                                { dataKey: 'lr', label: 'Learning Rate' },
                                                { dataKey: 'batchSize', label: 'Batch Size' },
                                                { dataKey: 'epochs', label: 'Epochs' },
                                                { dataKey: 'dropout', label: 'Dropout' },
                                                { dataKey: 'mAP', label: 'mAP' },
                                            ]}
                                            colorBy="right"
                                            height={280}
                                            highlight={{ enabled: true, interaction: { lineHover: true } }}
                                            lineOpacity={0.6}
                                            strokeWidth={2.0}
                                            aria-label="Hyperparameter parallel coordinates"
                                        />
                                    </div>
                                </div>
                            </ChartsThemeProvider>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 3: @geti-ai/blocks ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ai/blocks">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">Building blocks</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/blocks</h2>
                            <p className="geti-home-showcase__desc">
                                Reusable application-level building blocks composed from <code>@geti-ai/ui</code>{' '}
                                primitives. Media grids for dataset browsing, log viewers for training monitoring, and
                                filter systems for data management.
                            </p>
                            <InstallCommand command="npm install @geti-ai/blocks" />
                            <InstallCommand
                                command="npx skills add https://docs.geti-ui.markredeman.nl/.well-known/skills/geti-ui-blocks"
                                variant="subtle"
                                label="Integrate with your favorite AI tools"
                            />
                            <a className="geti-home-showcase__link" href="/blocks/installation">
                                Explore blocks &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media geti-home-blocks-demos">
                            <div className="geti-home-demo-panel">
                                {/* Media grid */}
                                <a className="geti-home-demo-heading" href="/blocks/media/media-grid">
                                    MediaGrid
                                </a>
                                <div className="geti-home-blocks-media-grid">
                                    <MediaGrid
                                        totalItems={mediaItems.length}
                                        itemSize={125}
                                        getItemAt={(i) => mediaItems[i]}
                                        renderItem={(ctx) => (
                                            <MediaGridThumbnailItem
                                                isPlaceholder={ctx.isPlaceholder}
                                                isSelected={ctx.isSelected}
                                                onPress={ctx.onPress}
                                                src={ctx.item?.src}
                                                alt={ctx.item?.name}
                                                bottomRight={
                                                    ctx.item ? (
                                                        <MediaGridItemStatus
                                                            variant={
                                                                ctx.item.status === 'Annotated' ? 'positive' : 'neutral'
                                                            }
                                                        >
                                                            {ctx.item.status}
                                                        </MediaGridItemStatus>
                                                    ) : undefined
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="geti-home-demo-panel">
                                {/* Logs */}
                                <a className="geti-home-demo-heading" href="/blocks/logs">
                                    LogsContent
                                </a>
                                <div className="geti-home-blocks-logs">
                                    <LogsContent logs={sampleLogs} showFilters={false} />
                                </div>
                            </div>
                        </div>

                        <div className="geti-home-demo-panel geti-home-demo-panel--full">
                            <a className="geti-home-demo-heading" href="/blocks/tabs/overview">
                                OverflowableTabs + ManagedTab
                            </a>
                            <div className="geti-home-blocks-tabs">
                                <TabsDemo />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 4: @geti-ai/smart-tools ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ai/smart-tools">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-smart-tools-header">
                            <div className="geti-home-showcase__text">
                                <p className="geti-home-showcase__kicker">Annotation tooling</p>
                                <h2 className="geti-home-showcase__title">@geti-ai/smart-tools</h2>
                                <p className="geti-home-showcase__desc">
                                    Browser-native computer vision tools for low-latency image annotation. Includes
                                    Watershed, GrabCut, Intelligent Scissors, SSIM template matching, and RITM
                                    interactive segmentation — powered by OpenCV WASM and ONNX Runtime. Our tools,
                                    including Segment Anything, run entirely in the browser with zero server interaction
                                    required.
                                </p>
                                <InstallCommand command="npm install @geti-ai/smart-tools" />
                                <div className="geti-home-showcase__meta">
                                    <Badge variant="info">7 annotation tools</Badge>
                                    <a className="geti-home-showcase__link" href="/smart-tools/installation">
                                        Explore smart tools &rarr;
                                    </a>
                                </div>
                            </div>
                            <div className="geti-home-smart-tools-logos">
                                <img src="/logos/opencv.svg" alt="OpenCV" className="geti-home-smart-tools-logo" />
                                <img src="/logos/onnx.svg" alt="ONNX Runtime" className="geti-home-smart-tools-logo" />
                                <img
                                    src="/logos/webassembly.svg"
                                    alt="WebAssembly"
                                    className="geti-home-smart-tools-logo"
                                />
                            </div>
                        </div>
                        <div className="geti-home-showcase__media">
                            <div className="geti-home-smart-tools-grid">
                                {smartTools.map(({ Icon: ToolIcon, name, href }) => (
                                    <a key={name} className="geti-home-smart-tools-grid__item" href={href}>
                                        <Icon aria-hidden="true">
                                            <ToolIcon width={28} height={28} />
                                        </Icon>
                                        <span className="geti-home-smart-tools-grid__name">{name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 5: @geti-ai/mcp ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ai/mcp">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">AI Integration</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/mcp</h2>
                            <p className="geti-home-showcase__desc">
                                An MCP server that exposes Geti UI documentation to AI coding agents. Integrates with
                                Claude Code, Cursor, VS Code Copilot, and Windsurf. Provides 8 tools for searching docs,
                                listing components, extracting props, and more.
                            </p>
                            <InstallCommand command="npx @geti-ai/mcp" />
                            <div className="geti-home-showcase__meta">
                                <Badge variant="info">8 tools for AI agents</Badge>
                                <a className="geti-home-showcase__link" href="/ai/overview">
                                    Read MCP docs &rarr;
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 6: Icons ───────────────── */}
                <section className="geti-home-showcase" aria-label="Icons">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">Iconography</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/ui/icons</h2>
                            <p className="geti-home-showcase__desc">
                                150+ workflow icons aligned with Geti semantics. Custom SVGs for AI/ML operations plus
                                Adobe Spectrum workflow re-exports. Tree-shakeable imports keep bundles lean.
                            </p>
                            <InstallCommand command="npm install @geti-ai/ui" />
                            <a className="geti-home-showcase__link" href="/assets/icons">
                                Browse all 150+ icons &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media">
                            <div className="geti-home-icon-grid">
                                {showcaseIcons.map(({ Icon: IconSvg, name }) => (
                                    <div key={name} className="geti-home-icon-grid__cell">
                                        <Icon aria-hidden="true">
                                            <IconSvg width={24} height={24} />
                                        </Icon>
                                        <span className="geti-home-icon-grid__name">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 7: Images & Domains ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--reverse" aria-label="Images and domains">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">Visual assets</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/ui/assets</h2>
                            <p className="geti-home-showcase__desc">
                                Production-ready SVG illustrations and domain thumbnails for empty states, onboarding,
                                error pages, and contextual guidance. Inline SVG components and static WebP image URLs.
                            </p>
                            <InstallCommand command="npm install @geti-ai/ui" />
                            <a className="geti-home-showcase__link" href="/assets/images">
                                View all assets &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media">
                            <div className="geti-home-demo-panel">
                                {/* SVG illustrations */}
                                <p className="geti-home-gallery-heading">Illustrations</p>
                                <div className="geti-home-illustration-gallery">
                                    {showcaseIllustrations.map(({ Component, name }) => (
                                        <div key={name} className="geti-home-illustration-gallery__item">
                                            <Component width={100} height={100} aria-hidden="true" />
                                            <span className="geti-home-illustration-gallery__name">{name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Domain thumbnails */}
                                <p className="geti-home-gallery-heading">Domain types</p>
                                <div className="geti-home-illustration-gallery">
                                    {showcaseDomains.map(({ Component, name }) => (
                                        <div key={name} className="geti-home-illustration-gallery__item">
                                            <Component width={64} height={64} aria-hidden="true" />
                                            <span className="geti-home-illustration-gallery__name">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {afterFeatures}
            </main>

            <HomeFooter />
        </Fragment>
    );
};
