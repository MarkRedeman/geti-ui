import type { LogEntryData } from '@geti-ui/blocks';
import {
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
    Copy,
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
} from '@geti-ui/ui/icons';
import {
    WorkInProgressIcon,
    NotFound,
    FireWorks,
    MediaUpload,
    DeploymentImg,
    ConnectionLost,
} from '@geti-ui/ui/assets/images';
import {
    DetectionImg,
    SegmentationImg,
    ClassificationImg,
    AnomalyDetectionImg,
    KeypointDetectionImg,
    DetectionRotatedImg,
} from '@geti-ui/ui/assets/domains';

// ---------------------------------------------------------------------------
// Charts data
// ---------------------------------------------------------------------------

export const trainingTrend = [
    { step: 'S1', train: 0.42, val: 0.38, test: 0.35 },
    { step: 'S2', train: 0.56, val: 0.49, test: 0.46 },
    { step: 'S3', train: 0.64, val: 0.57, test: 0.53 },
    { step: 'S4', train: 0.73, val: 0.65, test: 0.61 },
    { step: 'S5', train: 0.79, val: 0.71, test: 0.68 },
    { step: 'S6', train: 0.84, val: 0.76, test: 0.73 },
];

export const classMetrics = [
    { class: 'Car', precision: 0.92, recall: 0.88, f1: 0.9 },
    { class: 'Person', precision: 0.87, recall: 0.91, f1: 0.89 },
    { class: 'Bike', precision: 0.79, recall: 0.82, f1: 0.8 },
    { class: 'Truck', precision: 0.84, recall: 0.76, f1: 0.8 },
];

export const sparkAccuracy = [
    { v: 0.3 },
    { v: 0.45 },
    { v: 0.52 },
    { v: 0.61 },
    { v: 0.68 },
    { v: 0.74 },
    { v: 0.79 },
    { v: 0.83 },
];

export const sparkLoss = [
    { v: 1.2 },
    { v: 0.94 },
    { v: 0.78 },
    { v: 0.62 },
    { v: 0.51 },
    { v: 0.43 },
    { v: 0.38 },
    { v: 0.34 },
];

export const sparkF1 = [
    { v: 0.25 },
    { v: 0.39 },
    { v: 0.5 },
    { v: 0.58 },
    { v: 0.66 },
    { v: 0.72 },
    { v: 0.77 },
    { v: 0.81 },
];

export const sparkLR = [
    { v: 0.01 },
    { v: 0.01 },
    { v: 0.008 },
    { v: 0.006 },
    { v: 0.004 },
    { v: 0.003 },
    { v: 0.002 },
    { v: 0.001 },
];

export const sparkPrecision = [
    { v: 0.55 },
    { v: 0.62 },
    { v: 0.68 },
    { v: 0.74 },
    { v: 0.79 },
    { v: 0.83 },
    { v: 0.86 },
    { v: 0.89 },
];

export const sparkMAP = [
    { v: 0.21 },
    { v: 0.35 },
    { v: 0.44 },
    { v: 0.53 },
    { v: 0.59 },
    { v: 0.64 },
    { v: 0.69 },
    { v: 0.73 },
];

export const classDistribution = [
    { name: 'Car', count: 1240 },
    { name: 'Person', count: 890 },
    { name: 'Bike', count: 430 },
    { name: 'Truck', count: 280 },
    { name: 'Bus', count: 160 },
];

export const confusionLabels = ['Car', 'Person', 'Bike', 'Truck'];
export const confusionMatrix = [
    [112, 3, 1, 4],
    [2, 98, 5, 0],
    [1, 4, 82, 3],
    [5, 0, 2, 76],
];

export const parallelData = [
    { id: 'run-1', lr: 0.001, batchSize: 16, epochs: 50, dropout: 0.1, mAP: 0.72 },
    { id: 'run-2', lr: 0.005, batchSize: 32, epochs: 30, dropout: 0.2, mAP: 0.68 },
    { id: 'run-3', lr: 0.01, batchSize: 64, epochs: 40, dropout: 0.15, mAP: 0.74 },
    { id: 'run-4', lr: 0.002, batchSize: 16, epochs: 60, dropout: 0.3, mAP: 0.71 },
    { id: 'run-5', lr: 0.008, batchSize: 32, epochs: 50, dropout: 0.05, mAP: 0.76 },
    { id: 'run-6', lr: 0.003, batchSize: 48, epochs: 35, dropout: 0.25, mAP: 0.69 },
    { id: 'run-7', lr: 0.006, batchSize: 24, epochs: 45, dropout: 0.12, mAP: 0.73 },
    { id: 'run-8', lr: 0.004, batchSize: 64, epochs: 55, dropout: 0.08, mAP: 0.75 },
];

// ---------------------------------------------------------------------------
// Blocks data
// ---------------------------------------------------------------------------

const MEDIA_STATUSES = ['Annotated', 'Not annotated', 'Skipped'] as const;
export const mediaItems = Array.from({ length: 40 }, (_, i) => ({
    id: String(i + 1),
    name: `image_${String(i + 1).padStart(3, '0')}.jpg`,
    status: MEDIA_STATUSES[i % 3],
    src: `https://picsum.photos/seed/geti${i + 1}/150/150`,
}));

export const sampleLogs: LogEntryData[] = [
    {
        record: {
            time: { timestamp: 1710000000 },
            level: { name: 'INFO' },
            message: 'Training job started - detection model v2.1',
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
            message: 'Epoch 1/50 complete - loss: 0.842, mAP: 0.312',
        },
    },
    {
        record: {
            time: { timestamp: 1710000240 },
            level: { name: 'INFO' },
            message: 'Epoch 2/50 complete - loss: 0.614, mAP: 0.487',
        },
    },
    {
        record: {
            time: { timestamp: 1710000300 },
            level: { name: 'SUCCESS' },
            message: 'Epoch 3/50 complete - loss: 0.483, mAP: 0.591',
        },
    },
    {
        record: {
            time: { timestamp: 1710000360 },
            level: { name: 'ERROR' },
            message: 'CUDA out of memory - reducing batch size from 32 to 16',
        },
    },
    {
        record: {
            time: { timestamp: 1710000375 },
            level: { name: 'WARNING' },
            message: 'Gradient overflow detected at layer backbone.stage4 - scaling adjusted',
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
            message: 'Epoch 4/50 complete - loss: 0.391, mAP: 0.654',
        },
    },
];

// ---------------------------------------------------------------------------
// Icons showcase
// ---------------------------------------------------------------------------

export const showcaseIcons = [
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

// ---------------------------------------------------------------------------
// Assets showcase
// ---------------------------------------------------------------------------

export const showcaseIllustrations = [
    { Component: WorkInProgressIcon, name: 'WorkInProgress' },
    { Component: NotFound, name: 'NotFound' },
    { Component: FireWorks, name: 'FireWorks' },
    { Component: MediaUpload, name: 'MediaUpload' },
    { Component: DeploymentImg, name: 'DeploymentImg' },
    { Component: ConnectionLost, name: 'ConnectionLost' },
] as const;

export const showcaseDomains = [
    { Component: DetectionImg, name: 'Detection' },
    { Component: SegmentationImg, name: 'Segmentation' },
    { Component: ClassificationImg, name: 'Classification' },
    { Component: AnomalyDetectionImg, name: 'Anomaly' },
    { Component: KeypointDetectionImg, name: 'Keypoint' },
    { Component: DetectionRotatedImg, name: 'Rotated' },
] as const;

// ---------------------------------------------------------------------------
// Smart tools
// ---------------------------------------------------------------------------

export const smartTools = [
    { Icon: SegmentAnythingIcon, name: 'Segment Anything', href: '/smart-tools/segment-anything' },
    { Icon: MagicWandIcon, name: 'RITM', href: '/smart-tools/ritm' },
    { Icon: QuickSelection, name: 'GrabCut', href: '/smart-tools/grabcut' },
    { Icon: Watershed, name: 'Watershed', href: '/smart-tools/watershed' },
    { Icon: DetectionTool, name: 'SSIM', href: '/smart-tools/ssim' },
    { Icon: Polygon, name: 'Intelligent Scissors', href: '/smart-tools/intelligent-scissors' },
] as const;
