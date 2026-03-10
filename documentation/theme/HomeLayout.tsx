import { Fragment } from 'react';
import { LineChart, getDatasetSubsetColor } from '@geti-ai/charts';
import { HomeFooter } from '@rspress/core/theme-original';
import type { HomeLayoutProps } from '@rspress/core/theme-original';

const heroGraphData = [
    { step: 'S1', train: 0.42, val: 0.38 },
    { step: 'S2', train: 0.56, val: 0.49 },
    { step: 'S3', train: 0.64, val: 0.57 },
    { step: 'S4', train: 0.73, val: 0.65 },
    { step: 'S5', train: 0.79, val: 0.71 },
    { step: 'S6', train: 0.84, val: 0.76 },
];

const featureSections = [
    {
        kicker: 'Core UI',
        title: '@geti-ai/ui',
        description:
            'Accessible, themeable React components for interactive AI workflows. Build operator-friendly interfaces with consistent behavior, keyboard support, and dark-mode-first styling.',
        examples: ['Annotation toolbars', 'Model training forms', 'Dataset filtering panels'],
        href: '/components/ui/Button',
        cta: 'Explore UI components',
        ctaHref: '/components/ui/Button',
    },
    {
        kicker: 'Iconography',
        title: '@geti-ai/ui/icons',
        description:
            'A workflow icon set aligned with Geti semantics so complex AI operations remain scannable. Use consistent visual language for tasks, assets, and model states.',
        examples: ['Pipeline step icons', 'Task-type navigation', 'State and status indicators'],
        href: '/assets/icons',
        cta: 'Browse icon library',
        ctaHref: '/assets/icons',
    },
    {
        kicker: 'Visual assets',
        title: '@geti-ai/ui/assets',
        description:
            'Product-ready images and illustrations for empty states, onboarding, and contextual guidance. Keep documentation and app surfaces visually consistent.',
        examples: ['Onboarding illustrations', 'Empty-state visuals', 'Domain-specific imagery'],
        href: '/assets/images',
        cta: 'View assets',
        ctaHref: '/assets/images',
    },
    {
        kicker: 'Charts',
        title: '@geti-ai/charts',
        description:
            'Recharts-based primitives and ML-focused compositions designed to match the Geti design system. Start with standard charts, then scale into evaluation workflows.',
        examples: ['Confusion matrix analysis', 'Precision-recall and ROC tracking', 'Latency and throughput monitoring'],
        href: '/charts/compositions',
        cta: 'See chart compositions',
        ctaHref: '/charts/compositions',
    },
    {
        kicker: 'Vision tools',
        title: '@geti-ai/smart-tools',
        description:
            'Browser-native computer vision tools built with OpenCV and ONNX Runtime. Run interactive AI utilities directly in web apps without backend round-trips.',
        examples: ['Segment Anything in browser', 'Image similarity and matching', 'Client-side preprocessing utilities'],
        href: '/smart-tools/installation',
        cta: 'Read smart-tools docs',
        ctaHref: '/smart-tools/installation',
    },
];

export const HomeLayout = (props: HomeLayoutProps) => {
    const { beforeHero, afterHero, beforeFeatures, afterFeatures } = props;

    return (
        <Fragment>
            <div className="rp-home-background geti-home-bg" />

            {beforeHero}
            <main className="geti-home-wrapper">
                <section className="geti-home-hero">
                    <div className="geti-home-hero__inner">
                        <div className="geti-home-hero__panel">
                            <p className="geti-home-hero__eyebrow">Geti Packages</p>
                            <h1 className="geti-home-hero__title">Build interactive AI applications</h1>
                            <p className="geti-home-hero__subtitle">
                                UI components, visual assets, browser-based vision tools, and charts designed to work
                                together for interactive AI applications.
                            </p>
                            <div className="geti-home-hero__actions">
                                <a className="geti-home-btn geti-home-btn--primary" href="/components/ui/Button">
                                    Get Started
                                </a>
                                <a className="geti-home-btn geti-home-btn--secondary" href="/examples">
                                    Explore Examples
                                </a>
                            </div>
                        </div>

                        <div className="geti-home-hero__graph">
                            <h2>Model quality trend</h2>
                            <LineChart
                                data={heroGraphData}
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
                                showLegend={false}
                                aria-label="Model quality trend chart"
                                height={220}
                            />
                        </div>
                    </div>
                </section>
                {afterHero}

                {beforeFeatures}
                <section className="geti-home-ecosystem">
                    <div className="geti-home-bento">
                        <a className="geti-home-card geti-home-card--ui" href="/components/ui/Button">
                            <div className="geti-home-card__header">
                                <p className="geti-home-card__kicker">Core UI</p>
                                <h3 className="geti-home-card__title">@geti-ai/ui</h3>
                            </div>
                            <div className="geti-home-card__body">
                                <p className="geti-home-card__desc">
                                    Accessible, themeable React components for interactive AI workflows. Based on
                                    Adobe's Spectrum and react aria components.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>

                        <a className="geti-home-card geti-home-card--charts" href="/charts/installation">
                            <div className="geti-home-card__header">
                                <p className="geti-home-card__kicker">Charts</p>
                                <h3 className="geti-home-card__title">@geti-ai/charts</h3>
                            </div>
                            <div className="geti-home-card__body">
                                <p className="geti-home-card__desc">
                                    Build on top of Recharts and designed to work with the Geti design system. Use ready
                                    made charts designed for ML applications, or use primitives to design your own.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>

                        <a className="geti-home-card geti-home-card--smart" href="/smart-tools/installation">
                            <div className="geti-home-card__header">
                                <p className="geti-home-card__kicker">Vision tools</p>
                                <h3 className="geti-home-card__title">@geti-ai/smart-tools</h3>
                            </div>
                            <div className="geti-home-card__body">
                                <p className="geti-home-card__desc">
                                    Browser-optimized vision tools that run natively in the browser. Including
                                    Structured Similarity matching, and Segment Anything using OpenCV and ONNX Runtime.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>
                    </div>
                </section>
                {afterFeatures}
                <section className="geti-home-feature-bands-section" aria-label="Package deep dive">
                    <div className="geti-home-feature-bands">
                        {featureSections.map((section, index) => (
                            <section key={section.title} className="geti-home-feature-band">
                                <div className="geti-home-feature-band__inner">
                                    <div
                                        className={`geti-home-feature-band__row${
                                            index % 2 === 1 ? ' geti-home-feature-band__row--reverse' : ''
                                        }`}
                                    >
                                        <div className="geti-home-feature-band__text">
                                            <p className="geti-home-feature-band__kicker">{section.kicker}</p>
                                            <h2 className="geti-home-feature-band__title">{section.title}</h2>
                                            <p className="geti-home-feature-band__description">{section.description}</p>
                                            <hr className="geti-home-feature-band__divider" />
                                            <a className="geti-home-feature-band__link" href={section.ctaHref}>
                                                {section.cta} →
                                            </a>
                                        </div>
                                        <div className="geti-home-feature-band__media">
                                            <div className="geti-home-feature-band__media-card">
                                                <p className="geti-home-feature-band__media-title">Example use cases</p>
                                                <ul className="geti-home-feature-band__media-list">
                                                    {section.examples.map((example) => (
                                                        <li key={example}>{example}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                </section>
            </main>

            <HomeFooter />
        </Fragment>
    );
};
