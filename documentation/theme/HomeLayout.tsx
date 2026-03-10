import { Fragment } from 'react';
import { HomeFooter } from '@rspress/core/theme-original';
import type { HomeLayoutProps } from '@rspress/core/theme-original';

export const HomeLayout = (props: HomeLayoutProps) => {
    const { beforeHero, afterHero, beforeFeatures, afterFeatures } = props;

    return (
        <Fragment>
            <div className="rp-home-background geti-home-bg" />

            {beforeHero}
            <main className="geti-home-wrapper">
                <section className="geti-home-hero">
                    <div className="geti-home-hero__glow" />
                    <p className="geti-home-hero__eyebrow">Intel Geti Design System</p>
                    <h1 className="geti-home-hero__title">
                        The React platform for
                        <span className="geti-home-hero__title-accent"> AI-first applications.</span>
                    </h1>
                    <p className="geti-home-hero__subtitle">
                        A unified ecosystem of accessible components, machine learning charts, and
                        browser-based computer vision tools.
                    </p>
                    <div className="geti-home-hero__actions">
                        <a className="geti-home-btn geti-home-btn--primary" href="/components/ui/Button">
                            Get Started
                        </a>
                        <a className="geti-home-btn geti-home-btn--secondary" href="/examples">
                            View Examples
                        </a>
                    </div>
                </section>
                {afterHero}

                {beforeFeatures}
                <section className="geti-home-ecosystem">
                    <h2 className="geti-home-section-title">
                        Everything you need to build intelligent interfaces.
                    </h2>

                    <div className="geti-home-bento">
                        <a className="geti-home-card geti-home-card--ui" href="/components/ui/Button">
                            <p className="geti-home-card__kicker">Core UI</p>
                            <h3 className="geti-home-card__title">@geti-ai/ui</h3>
                            <p className="geti-home-card__desc">
                                Accessible, themeable React components for interactive AI workflows.
                            </p>
                        </a>

                        <a className="geti-home-card geti-home-card--smart" href="/smart-tools/installation">
                            <p className="geti-home-card__kicker">Vision Runtime</p>
                            <h3 className="geti-home-card__title">@geti-ai/smart-tools</h3>
                            <p className="geti-home-card__desc">
                                Browser-optimized vision tooling with OpenCV and ONNX Runtime.
                            </p>
                        </a>

                        <a className="geti-home-card geti-home-card--charts" href="/charts/installation">
                            <p className="geti-home-card__kicker">ML Insights</p>
                            <h3 className="geti-home-card__title">@geti-ai/charts</h3>
                            <p className="geti-home-card__desc">
                                AI-centric chart compositions on Recharts for evaluation and monitoring.
                            </p>
                        </a>

                        <a className="geti-home-card geti-home-card--icons" href="/assets/icons">
                            <p className="geti-home-card__kicker">Visual Language</p>
                            <h3 className="geti-home-card__title">@geti-ai/ui/icons</h3>
                            <p className="geti-home-card__desc">
                                Workflow icon set built for Geti applications and dashboards.
                            </p>
                        </a>

                        <a className="geti-home-card geti-home-card--assets" href="/assets/images">
                            <p className="geti-home-card__kicker">Illustrations</p>
                            <h3 className="geti-home-card__title">@geti-ai/ui/assets</h3>
                            <p className="geti-home-card__desc">
                                Product-ready images and illustrations for polished AI interfaces.
                            </p>
                        </a>
                    </div>
                </section>
                {afterFeatures}

                <section className="geti-home-feature-strip">
                    <h2 className="geti-home-feature-strip__title">Stop building ML tooling from scratch.</h2>
                    <p className="geti-home-feature-strip__desc">
                        Compose production-ready interfaces faster with shared primitives for UI, vision,
                        and model analytics.
                    </p>
                    <a className="geti-home-btn geti-home-btn--primary" href="/examples">
                        Explore Kitchensinks
                    </a>
                </section>
            </main>

            <HomeFooter />
        </Fragment>
    );
};
