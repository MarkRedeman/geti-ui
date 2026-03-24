import { Fragment, useState } from 'react';
import {
    LineChart,
    BarChart,
    DonutChart,
    Sparkline,
    ChartsThemeProvider,
    getDatasetSubsetColor,
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
} from '@geti-ai/ui';
import { MediaGrid, MediaGridThumbnailItem, MediaGridItemStatus, LogsContent } from '@geti-ai/blocks';
import type { LogEntryData } from '@geti-ai/blocks';
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
    Tag as TagIcon,
    Image as ImageIcon,
    GraphChart,
    Deployments,
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

const ecosystemData = [
    { package: 'Icons', count: 170 },
    { package: 'Components', count: 116 },
    { package: 'Charts', count: 48 },
    { package: 'Blocks', count: 34 },
    { package: 'Images', count: 24 },
    { package: 'MCP Tools', count: 8 },
];

const trainingTrend = [
    { step: 'S1', train: 0.42, val: 0.38 },
    { step: 'S2', train: 0.56, val: 0.49 },
    { step: 'S3', train: 0.64, val: 0.57 },
    { step: 'S4', train: 0.73, val: 0.65 },
    { step: 'S5', train: 0.79, val: 0.71 },
    { step: 'S6', train: 0.84, val: 0.76 },
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

const classDistribution = [
    { name: 'Car', count: 1240 },
    { name: 'Person', count: 890 },
    { name: 'Bike', count: 430 },
    { name: 'Truck', count: 280 },
    { name: 'Bus', count: 160 },
];

const mediaItems = [
    { id: '1', name: 'image_001.jpg', status: 'Annotated' as const },
    { id: '2', name: 'image_002.jpg', status: 'Annotated' as const },
    { id: '3', name: 'image_003.jpg', status: 'Not annotated' as const },
    { id: '4', name: 'image_004.jpg', status: 'Annotated' as const },
    { id: '5', name: 'image_005.jpg', status: 'Skipped' as const },
    { id: '6', name: 'image_006.jpg', status: 'Annotated' as const },
];

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
            time: { timestamp: 1710000360 },
            level: { name: 'ERROR' },
            message: 'CUDA out of memory — reducing batch size from 32 to 16',
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

// ---------------------------------------------------------------------------
// Install command with copy button
// ---------------------------------------------------------------------------

function InstallCommand({ command }: { command: string }) {
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
        <div className="geti-home-install">
            <code className="geti-home-install__code">{command}</code>
            <button
                className={`geti-home-install__copy${copied ? ' geti-home-install__copy--copied' : ''}`}
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : `Copy: ${command}`}
                type="button"
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
                            <h1 className="geti-home-hero__title">Build interactive AI applications</h1>
                            <p className="geti-home-hero__subtitle">
                                UI components, charts, building blocks, icons, and AI tooling — six packages designed to
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
                        </div>

                        <div className="geti-home-hero__graph">
                            <h2>Package ecosystem</h2>
                            <ChartsThemeProvider>
                                <DonutChart
                                    data={ecosystemData}
                                    valueKey="count"
                                    nameKey="package"
                                    height={220}
                                    showLegend
                                    aria-label="Package ecosystem overview — exports per package"
                                />
                            </ChartsThemeProvider>
                        </div>
                    </div>
                </section>
                {afterHero}

                {beforeFeatures}

                {/* ───────────────── Section 1: @geti-ai/ui ───────────────── */}
                <section className="geti-home-showcase" aria-label="@geti-ai/ui">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">Core UI</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/ui</h2>
                            <p className="geti-home-showcase__desc">
                                Accessible, themeable React components for interactive AI workflows. 90+ components
                                built on Adobe React Spectrum and react-aria-components, with dark-mode-first styling.
                            </p>
                            <InstallCommand command="npm install @geti-ai/ui" />
                            <a className="geti-home-showcase__link" href="/components/ui/Button">
                                Explore 90+ components &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media">
                            <div className="geti-home-demo-panel">
                                {/* Buttons */}
                                <div className="geti-home-demo-row">
                                    <Button variant="accent">Train model</Button>
                                    <Button variant="primary">Deploy</Button>
                                    <Button variant="secondary">Export</Button>
                                    <Button variant="negative">Delete</Button>
                                </div>

                                {/* Form controls */}
                                <div className="geti-home-demo-row geti-home-demo-row--form">
                                    <TextField label="Project name" defaultValue="My Detection Project" />
                                    <Picker label="Task type" defaultSelectedKey="detection">
                                        <PickerItem key="detection">Detection</PickerItem>
                                        <PickerItem key="segmentation">Segmentation</PickerItem>
                                        <PickerItem key="classification">Classification</PickerItem>
                                    </Picker>
                                </div>

                                {/* Toggles */}
                                <div className="geti-home-demo-row">
                                    <Switch defaultSelected>Auto-training</Switch>
                                    <Checkbox defaultSelected>Include annotations</Checkbox>
                                </div>

                                {/* Slider */}
                                <div className="geti-home-demo-row geti-home-demo-row--stretch">
                                    <Slider
                                        label="Confidence threshold"
                                        defaultValue={75}
                                        minValue={0}
                                        maxValue={100}
                                        isFilled
                                    />
                                </div>

                                {/* Status indicators */}
                                <div className="geti-home-demo-row">
                                    <Badge variant="positive">Active</Badge>
                                    <Badge variant="info">Training</Badge>
                                    <Badge variant="negative">Failed</Badge>
                                    <StatusLight variant="positive">Deployed</StatusLight>
                                    <StatusLight variant="notice">Queued</StatusLight>
                                </div>

                                {/* Progress */}
                                <div className="geti-home-demo-row geti-home-demo-row--stretch">
                                    <ProgressBar label="Training progress" value={67} />
                                </div>

                                {/* Tags */}
                                <div className="geti-home-demo-row">
                                    <TagGroup aria-label="Labels">
                                        <TagItem key="car">Car</TagItem>
                                        <TagItem key="person">Person</TagItem>
                                        <TagItem key="bike">Bike</TagItem>
                                        <TagItem key="truck">Truck</TagItem>
                                    </TagGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 2: @geti-ai/charts ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--reverse" aria-label="@geti-ai/charts">
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
                            <a className="geti-home-showcase__link" href="/charts/compositions">
                                See all chart compositions &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media">
                            <div className="geti-home-demo-panel">
                                <ChartsThemeProvider>
                                    {/* Line chart — training quality trend */}
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
                                        ]}
                                        showLegend
                                        aria-label="Model quality trend"
                                        height={180}
                                    />

                                    {/* Bar chart — per-class metrics */}
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

                                    {/* Sparklines */}
                                    <div className="geti-home-sparkline-row">
                                        <div className="geti-home-sparkline-item">
                                            <span className="geti-home-sparkline-label">Loss</span>
                                            <Sparkline
                                                data={sparkLoss}
                                                dataKey="v"
                                                height={32}
                                                width={120}
                                                color="#ff5662"
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
                                            />
                                        </div>
                                    </div>

                                    {/* Donut chart */}
                                    <DonutChart
                                        data={classDistribution}
                                        valueKey="count"
                                        nameKey="name"
                                        height={180}
                                        showLegend
                                        aria-label="Class distribution"
                                    />
                                </ChartsThemeProvider>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 3: @geti-ai/blocks ───────────────── */}
                <section className="geti-home-showcase" aria-label="@geti-ai/blocks">
                    <div className="geti-home-showcase__inner">
                        <div className="geti-home-showcase__text">
                            <p className="geti-home-showcase__kicker">Building blocks</p>
                            <h2 className="geti-home-showcase__title">@geti-ai/blocks</h2>
                            <p className="geti-home-showcase__desc">
                                Reusable application-level building blocks composed from @geti-ai/ui primitives. Media
                                grids for dataset browsing, log viewers for training monitoring, and filter systems for
                                data management.
                            </p>
                            <InstallCommand command="npm install @geti-ai/blocks" />
                            <a className="geti-home-showcase__link" href="/blocks/installation">
                                Explore blocks &rarr;
                            </a>
                        </div>
                        <div className="geti-home-showcase__media">
                            <div className="geti-home-demo-panel geti-home-demo-panel--blocks">
                                {/* Media grid */}
                                <div className="geti-home-blocks-media-grid">
                                    <MediaGrid
                                        totalItems={mediaItems.length}
                                        getItemAt={(i) => mediaItems[i]}
                                        renderItem={(ctx) => (
                                            <MediaGridThumbnailItem
                                                isPlaceholder={ctx.isPlaceholder}
                                                isSelected={ctx.isSelected}
                                                onPress={ctx.onPress}
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

                                {/* Logs */}
                                <div className="geti-home-blocks-logs">
                                    <LogsContent logs={sampleLogs} showFilters={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 4: @geti-ai/mcp ───────────────── */}
                <section className="geti-home-showcase geti-home-showcase--wide" aria-label="@geti-ai/mcp">
                    <div className="geti-home-showcase__inner geti-home-showcase__inner--wide">
                        <div className="geti-home-mcp-card">
                            <div className="geti-home-mcp-card__text">
                                <p className="geti-home-showcase__kicker">AI Integration</p>
                                <h2 className="geti-home-showcase__title">@geti-ai/mcp</h2>
                                <p className="geti-home-showcase__desc">
                                    An MCP server that exposes Geti UI documentation to AI coding agents. Integrates
                                    with Claude Code, Cursor, VS Code Copilot, and Windsurf. Provides 8 tools for
                                    searching docs, listing components, extracting props, and more.
                                </p>
                                <InstallCommand command="npx @geti-ai/mcp" />
                                <div className="geti-home-mcp-card__meta">
                                    <Badge variant="info">8 tools for AI agents</Badge>
                                    <a className="geti-home-showcase__link" href="/ai/overview">
                                        Read MCP docs &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────── Section 5: Icons ───────────────── */}
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

                {/* ───────────────── Section 6: Images & Domains ───────────────── */}
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
