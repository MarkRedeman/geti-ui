import { Fragment } from 'react';
import { useMemo, useState } from 'react';
import { HomeFooter } from '@rspress/core/theme-original';
import type { HomeLayoutProps } from '@rspress/core/theme-original';

export const HomeLayout = (props: HomeLayoutProps) => {
    const { beforeHero, afterHero, beforeFeatures, afterFeatures } = props;
    const [installTab, setInstallTab] = useState<'installer' | 'helm'>('installer');

    const installCommand = useMemo(
        () =>
            installTab === 'installer'
                ? 'curl -sL https://docs.geti.intel.com/install-geti.sh -o install-geti.sh && sudo chmod +x install-geti.sh && sudo ./install-geti.sh'
                : 'helm repo add geti https://charts.geti.example && helm install geti/geti --namespace geti --create-namespace',
        [installTab]
    );

    const copyCommand = async () => {
        try {
            await navigator.clipboard.writeText(installCommand);
        } catch {
            // noop — clipboard may be unavailable in some embedded contexts
        }
    };

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

                        <div className="geti-home-hero__aside">
                            <h2>Platform modules</h2>
                            <ul>
                                <li>@geti-ai/ui</li>
                                <li>@geti-ai/ui/icons</li>
                                <li>@geti-ai/ui/assets</li>
                                <li>@geti-ai/smart-tools</li>
                                <li>@geti-ai/charts</li>
                            </ul>
                        </div>
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
                            <span className="geti-home-card__link">Read more →</span>
                        </a>

                        <a className="geti-home-card geti-home-card--smart" href="/smart-tools/installation">
                            <p className="geti-home-card__kicker">Vision Runtime</p>
                            <h3 className="geti-home-card__title">@geti-ai/smart-tools</h3>
                            <p className="geti-home-card__desc">
                                Browser-optimized vision tooling with OpenCV and ONNX Runtime.
                            </p>
                            <span className="geti-home-card__link">Read more →</span>
                        </a>

                        <a className="geti-home-card geti-home-card--charts" href="/charts/installation">
                            <p className="geti-home-card__kicker">ML Insights</p>
                            <h3 className="geti-home-card__title">@geti-ai/charts</h3>
                            <p className="geti-home-card__desc">
                                AI-centric chart compositions on Recharts for evaluation and monitoring.
                            </p>
                            <span className="geti-home-card__link">Read more →</span>
                        </a>

                        <a className="geti-home-card geti-home-card--icons" href="/assets/icons">
                            <p className="geti-home-card__kicker">Visual Language</p>
                            <h3 className="geti-home-card__title">@geti-ai/ui/icons</h3>
                            <p className="geti-home-card__desc">
                                Workflow icon set built for Geti applications and dashboards.
                            </p>
                            <span className="geti-home-card__link">Read more →</span>
                        </a>

                        <a className="geti-home-card geti-home-card--assets" href="/assets/images">
                            <p className="geti-home-card__kicker">Illustrations</p>
                            <h3 className="geti-home-card__title">@geti-ai/ui/assets</h3>
                            <p className="geti-home-card__desc">
                                Product-ready images and illustrations for polished AI interfaces.
                            </p>
                            <span className="geti-home-card__link">Read more →</span>
                        </a>
                    </div>
                </section>
                {afterFeatures}

                <section className="geti-home-install">
                    <h2 className="geti-home-section-title">Start building with Geti packages</h2>
                    <div className="geti-home-install__tabs" role="tablist" aria-label="Install options">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={installTab === 'installer'}
                            className={installTab === 'installer' ? 'is-active' : ''}
                            onClick={() => setInstallTab('installer')}
                        >
                            Installer
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={installTab === 'helm'}
                            className={installTab === 'helm' ? 'is-active' : ''}
                            onClick={() => setInstallTab('helm')}
                        >
                            Helm
                        </button>
                    </div>
                    <div className="geti-home-install__panel">
                        <code>{installCommand}</code>
                        <button type="button" onClick={copyCommand}>
                            Copy
                        </button>
                    </div>
                </section>

                <section className="geti-home-alt-section">
                    <div className="geti-home-alt-section__text">
                        <h2>Build AI workflows end-to-end</h2>
                        <p>
                            From annotation UIs to evaluation dashboards, use one consistent package ecosystem
                            to ship faster with fewer integration points.
                        </p>
                        <a href="/components/layout/AppLayout">Learn more →</a>
                    </div>
                    <div className="geti-home-alt-section__visual">
                        <div className="geti-home-visual-frame">
                            <div className="geti-home-visual-frame__bar" />
                            <div className="geti-home-visual-frame__content" />
                        </div>
                    </div>
                </section>

                <section className="geti-home-alt-section geti-home-alt-section--reverse">
                    <div className="geti-home-alt-section__text">
                        <h2>Measure what matters in production</h2>
                        <p>
                            Monitor precision-recall, ROC, confidence quality, latency, and throughput with
                            chart compositions purpose-built for ML teams.
                        </p>
                        <a href="/charts/compositions">Learn more →</a>
                    </div>
                    <div className="geti-home-alt-section__visual">
                        <div className="geti-home-visual-frame">
                            <div className="geti-home-visual-frame__bar" />
                            <div className="geti-home-visual-frame__content geti-home-visual-frame__content--alt" />
                        </div>
                    </div>
                </section>

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
