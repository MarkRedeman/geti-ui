// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Content, Heading } from '@adobe/react-spectrum';
import Magnify from '@spectrum-icons/workflow/Magnify';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge/Badge';
import { IllustratedMessage } from './IllustratedMessage/IllustratedMessage';
import { InlineAlert } from './InlineAlert/InlineAlert';
import { IntelBrandedLoading } from './IntelBrandedLoading/IntelBrandedLoading';
import { Loading } from './Loading/Loading';
import { Meter } from './Meter/Meter';
import { ProgressBar } from './ProgressBar/ProgressBar';
import { ProgressCircle } from './ProgressCircle/ProgressCircle';
import { Skeleton } from './Skeleton/Skeleton';
import { StatusLight } from './StatusLight/StatusLight';
import { ToastContainer, toast } from './Toast/Toast';
import { Button } from '../ui/Button/Button';
import { Divider } from '../ui/Divider/Divider';
import { View } from '../ui/View/View';
import { Flex } from '../layouts/Flex/Flex';
import { Grid } from '../layouts/Grid/Grid';

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

const FeedbackKitchenSink = () => (
    <View padding="size-400">
        <ToastContainer placement="bottom" />
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
                    Feedback — Kitchen Sink
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                        color: 'var(--spectrum-global-color-gray-600)',
                    }}
                >
                    Showcase of all feedback and status components: progress indicators, alerts, badges, and loading states.
                </p>
            </View>

            <Divider size="L" />

            {/* ── Progress indicators ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Progress Indicators" subtitle="ProgressBar, ProgressCircle" />
                <Grid columns={['1fr', '1fr']} gap="size-300" UNSAFE_style={{ alignItems: 'start' }}>
                    <Flex direction="column" gap="size-200">
                        <div>
                            <SubLabel>ProgressBar</SubLabel>
                            <Flex direction="column" gap="size-150">
                                <ProgressBar label="Upload progress" value={65} width="100%" />
                                <ProgressBar label="Processing…" isIndeterminate width="100%" />
                                <ProgressBar label="Storage used" value={82} showValueLabel width="100%" />
                                <ProgressBar label="Over-background" value={95} variant="overBackground" showValueLabel width="100%" />
                            </Flex>
                        </div>
                    </Flex>
                    <Flex direction="column" gap="size-200">
                        <div>
                            <SubLabel>ProgressCircle</SubLabel>
                            <Flex direction="row" gap="size-300" alignItems="center">
                                <Flex direction="column" gap="size-50" alignItems="center">
                                    <ProgressCircle aria-label="40%" value={40} />
                                    <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>40% (S)</span>
                                </Flex>
                                <Flex direction="column" gap="size-50" alignItems="center">
                                    <ProgressCircle aria-label="Indeterminate" isIndeterminate size="M" />
                                    <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>Indeterminate (M)</span>
                                </Flex>
                                <Flex direction="column" gap="size-50" alignItems="center">
                                    <ProgressCircle aria-label="75%" value={75} size="L" />
                                    <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>75% (L)</span>
                                </Flex>
                            </Flex>
                        </div>
                    </Flex>
                </Grid>
            </View>

            {/* ── Meter ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Meter" subtitle="informative, warning, and critical variants" />
                <Flex direction="column" gap="size-150">
                    <Meter label="Storage" value={35} width="100%" />
                    <Meter label="Bandwidth" value={68} variant="warning" width="100%" />
                    <Meter label="CPU load" value={91} variant="critical" showValueLabel width="100%" />
                    <Meter label="Positive" value={55} variant="positive" showValueLabel width="100%" />
                </Flex>
            </View>

            {/* ── Loading ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Loading" subtitle="Variant comparison: spinner (default) vs intel — inline sizes and overlay mode" />
                <Grid
                    columns={['max-content', '1fr', '1fr', '1fr', '1fr']}
                    gap="size-200"
                    UNSAFE_style={{ alignItems: 'center' }}
                >
                    {/* Header row */}
                    <div />
                    {(['S', 'M', 'L'] as const).map((size) => (
                        <Flex key={size} justifyContent="center">
                            <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', fontWeight: 600, color: 'var(--spectrum-global-color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                inline ({size})
                            </span>
                        </Flex>
                    ))}
                    <Flex justifyContent="center">
                        <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', fontWeight: 600, color: 'var(--spectrum-global-color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            overlay
                        </span>
                    </Flex>

                    {/* Row 1 — Spinner (default) */}
                    <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-75)', fontWeight: 600, color: 'var(--spectrum-global-color-gray-700)', whiteSpace: 'nowrap' }}>
                        Spinner (default)
                    </span>
                    {(['S', 'M', 'L'] as const).map((size) => (
                        <Flex key={size} justifyContent="center" alignItems="center">
                            <Loading variant="spinner" mode="inline" size={size} aria-label={`Spinner loading ${size}`} />
                        </Flex>
                    ))}
                    <Flex justifyContent="center" alignItems="center">
                        <View position="relative" width="size-1200" height="size-1200" backgroundColor="gray-200" borderRadius="regular" UNSAFE_style={{ overflow: 'hidden' }}>
                            <Loading variant="spinner" mode="overlay" size="M" aria-label="Spinner overlay loading" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
                        </View>
                    </Flex>

                    {/* Row 2 — Intel */}
                    <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-75)', fontWeight: 600, color: 'var(--spectrum-global-color-gray-700)', whiteSpace: 'nowrap' }}>
                        Intel
                    </span>
                    {(['S', 'M', 'L'] as const).map((size) => (
                        <Flex key={size} justifyContent="center" alignItems="center">
                            <Loading variant="intel" mode="inline" size={size} aria-label={`Intel loading ${size}`} />
                        </Flex>
                    ))}
                    <Flex justifyContent="center" alignItems="center">
                        <View position="relative" width="size-1200" height="size-1200" backgroundColor="gray-200" borderRadius="regular" UNSAFE_style={{ overflow: 'hidden' }}>
                            <Loading variant="intel" size='M' mode="overlay" aria-label="Intel overlay loading" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
                        </View>
                    </Flex>
                </Grid>

                <Divider size="S" marginTop="size-300" marginBottom="size-200" />

                {/* Legacy IntelBrandedLoading — kept for regression verification */}
                <div>
                    <SubLabel>IntelBrandedLoading (legacy wrapper — deprecated)</SubLabel>
                    <Flex direction="row" gap="size-400" alignItems="center" wrap>
                        <Flex direction="column" gap="size-100" alignItems="center">
                            <View backgroundColor="gray-200" borderRadius="medium" UNSAFE_style={{ overflow: 'hidden' }} width="size-2400" height="size-2400" position="relative">
                                <IntelBrandedLoading height="100%" />
                            </View>
                            <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>
                                IntelBrandedLoading (wraps Loading variant=&quot;intel&quot;)
                            </span>
                        </Flex>
                    </Flex>
                </div>
            </View>

            {/* ── StatusLight ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="StatusLight" subtitle="semantic and extended color variants" />
                <Grid columns={['1fr', '1fr']} gap="size-100" UNSAFE_style={{ alignItems: 'start' }}>
                    <Flex direction="column" gap="size-100">
                        <StatusLight variant="positive">Model training complete</StatusLight>
                        <StatusLight variant="negative">Inference error detected</StatusLight>
                        <StatusLight variant="notice">Annotation in progress</StatusLight>
                        <StatusLight variant="info">Pipeline queued</StatusLight>
                        <StatusLight variant="neutral">Dataset idle</StatusLight>
                    </Flex>
                    <Flex direction="column" gap="size-100">
                        <StatusLight variant="celery">Custom — celery</StatusLight>
                        <StatusLight variant="fuchsia">Custom — fuchsia</StatusLight>
                        <StatusLight variant="indigo">Custom — indigo</StatusLight>
                        <StatusLight variant="seafoam">Custom — seafoam</StatusLight>
                        <StatusLight variant="purple">Custom — purple</StatusLight>
                    </Flex>
                </Grid>
            </View>

            {/* ── InlineAlert ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="InlineAlert" subtitle="contextual alert messages with semantic variants" />
                <Flex direction="column" gap="size-150">
                    <InlineAlert variant="neutral">
                        <Heading>Note</Heading>
                        <Content>This is a neutral inline alert providing helpful context about the current state.</Content>
                    </InlineAlert>
                    <InlineAlert variant="info">
                        <Heading>Did you know?</Heading>
                        <Content>Your session will expire in 10 minutes. Save your work to avoid data loss.</Content>
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
            </View>

            {/* ── Badge ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Badge" subtitle="all semantic color variants" />
                <Flex direction="row" gap="size-100" wrap>
                    <Badge variant="neutral">Neutral</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="positive">Positive</Badge>
                    <Badge variant="negative">Negative</Badge>
                    <Badge variant="yellow">Yellow</Badge>
                    <Badge variant="seafoam">Seafoam</Badge>
                    <Badge variant="indigo">Indigo</Badge>
                    <Badge variant="purple">Purple</Badge>
                    <Badge variant="fuchsia">Fuchsia</Badge>
                    <Badge variant="magenta">Magenta</Badge>
                </Flex>
            </View>

            {/* ── Skeleton ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Skeleton" subtitle="rectangle and circle loading placeholders" />
                <Flex direction="column" gap="size-150">
                    <div>
                        <SubLabel>Paragraph skeleton</SubLabel>
                        <Flex direction="column" gap="size-65">
                            <Skeleton width="100%" height={16} aria-label="Loading title" />
                            <Skeleton width="80%" height={12} aria-label="Loading subtitle" />
                            <Skeleton width="90%" height={12} aria-label="Loading body line 1" />
                            <Skeleton width="60%" height={12} aria-label="Loading body line 2" />
                        </Flex>
                    </div>
                    <div>
                        <SubLabel>Avatar + text row</SubLabel>
                        <Flex direction="row" gap="size-150" alignItems="center">
                            <Skeleton isCircle width={40} height={40} aria-label="Loading avatar" />
                            <Flex direction="column" gap="size-50" flex={1}>
                                <Skeleton width="50%" height={14} aria-label="Loading name" />
                                <Skeleton width="35%" height={12} aria-label="Loading role" />
                            </Flex>
                        </Flex>
                    </div>
                    <div>
                        <SubLabel>Card skeleton</SubLabel>
                        <Skeleton width="100%" height={80} aria-label="Loading card" />
                    </div>
                </Flex>
            </View>

            {/* ── IllustratedMessage ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="IllustratedMessage" subtitle="empty state with icon, heading, and body text" />
                <View borderWidth="thin" borderColor="gray-300" borderRadius="medium" padding="size-300" backgroundColor="gray-75">
                    <IllustratedMessage>
                        <Magnify size="XXL" />
                        <Heading>No results found</Heading>
                        <Content>
                            No models match your current filters. Try adjusting your search criteria or clearing active filters.
                        </Content>
                    </IllustratedMessage>
                </View>
            </View>

            {/* ── Toast ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Toast" subtitle="positive, negative, info, and neutral notification toasts" />
                <Flex direction="row" gap="size-150" wrap>
                    <Button variant="accent" onPress={() => toast.positive('Model training complete! 94.2% mAP achieved.')}>
                        Positive toast
                    </Button>
                    <Button variant="negative" onPress={() => toast.negative('Inference failed. Check logs for details.')}>
                        Negative toast
                    </Button>
                    <Button variant="secondary" onPress={() => toast.info('Your session expires in 10 minutes.')}>
                        Info toast
                    </Button>
                    <Button variant="secondary" onPress={() => toast.neutral('Dataset annotation saved.')}>
                        Neutral toast
                    </Button>
                </Flex>
            </View>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Storybook meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof FeedbackKitchenSink> = {
    component: FeedbackKitchenSink,
    title: 'Kitchen sink/Feedback',
    parameters: {
        a11y: {},
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof FeedbackKitchenSink>;

export const Default: Story = {};
