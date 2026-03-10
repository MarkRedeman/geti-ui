import { Fragment } from 'react';
import { LineChart } from '@geti-ai/charts';
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
                            <p className="geti-home-hero__eyebrow">Open Edge Platform · Geti Packages</p>
                            <h1 className="geti-home-hero__title">
                                Build interactive AI applications with one unified developer stack.
                            </h1>
                            <p className="geti-home-hero__subtitle">
                                UI components, visual assets, browser vision runtimes, and ML-native charts—
                                designed to work together out of the box.
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
                                    { dataKey: 'train', name: 'Train' },
                                    { dataKey: 'val', name: 'Validation', dashed: true },
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
                                    Accessible, themeable React components for interactive AI workflows.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>

                        <a className="geti-home-card geti-home-card--smart" href="/smart-tools/installation">
                            <div className="geti-home-card__header">
                                <p className="geti-home-card__kicker">Vision Runtime</p>
                                <h3 className="geti-home-card__title">@geti-ai/smart-tools</h3>
                            </div>
                            <div className="geti-home-card__body">
                                <p className="geti-home-card__desc">
                                    Browser-optimized vision tooling with OpenCV and ONNX Runtime.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>

                        <a className="geti-home-card geti-home-card--charts" href="/charts/installation">
                            <div className="geti-home-card__header">
                                <p className="geti-home-card__kicker">ML Insights</p>
                                <h3 className="geti-home-card__title">@geti-ai/charts</h3>
                            </div>
                            <div className="geti-home-card__body">
                                <p className="geti-home-card__desc">
                                    AI-centric chart compositions on Recharts for evaluation and monitoring.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>

                        <a className="geti-home-card geti-home-card--icons" href="/assets/icons">
                            <div className="geti-home-card__header">
                                <p className="geti-home-card__kicker">Visual Language</p>
                                <h3 className="geti-home-card__title">@geti-ai/ui/icons</h3>
                            </div>
                            <div className="geti-home-card__body">
                                <p className="geti-home-card__desc">
                                    Workflow icon set built for Geti applications and dashboards.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>

                        <a className="geti-home-card geti-home-card--assets" href="/assets/images">
                            <div className="geti-home-card__header">
                                <p className="geti-home-card__kicker">Illustrations</p>
                                <h3 className="geti-home-card__title">@geti-ai/ui/assets</h3>
                            </div>
                            <div className="geti-home-card__body">
                                <p className="geti-home-card__desc">
                                    Product-ready images and illustrations for polished AI interfaces.
                                </p>
                                <span className="geti-home-card__link">Read more →</span>
                            </div>
                        </a>
                    </div>
                </section>
                {afterFeatures}
            </main>

            <HomeFooter />
        </Fragment>
    );
};
