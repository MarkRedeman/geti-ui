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
                <header className="geti-topbar">
                    <div className="geti-topbar__brand">GETI / PACKAGES</div>
                    <nav className="geti-topbar__nav" aria-label="Homepage">
                        <a href="/components/ui/Button">UI</a>
                        <a href="/charts/installation">Charts</a>
                        <a href="/smart-tools/installation">Smart Tools</a>
                        <a href="/assets/icons">Assets</a>
                    </nav>
                    <div className="geti-topbar__actions" aria-label="Utility links">
                        <a href="https://github.com/open-edge-platform/geti" aria-label="GitHub" title="GitHub">
                            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.2c-3.4.8-4.2-1.5-4.2-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 2 2.9 1.4 3.6 1.1.1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.4-5.5-6A4.7 4.7 0 0 1 6 8.6c-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2a4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.8 5.7-5.5 6 .5.4.9 1.2.9 2.4v3.6c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z"/>
                            </svg>
                        </a>
                        <button type="button" aria-label="Search" title="Search">
                            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                <path fill="currentColor" d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.2 4.2-1.4 1.4-4.2-4.2A7.5 7.5 0 1 1 10.5 3m0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11"/>
                            </svg>
                        </button>
                        <button type="button" aria-label="Toggle theme" title="Theme">
                            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                <path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v1.1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1m6.4 2.6a1 1 0 0 1 1.4 1.4l-.8.8a1 1 0 0 1-1.4-1.4zM20 11a1 1 0 1 1 0 2h-1.1a1 1 0 1 1 0-2zM7 12a5 5 0 1 0 10 0A5 5 0 0 0 7 12m11.6 5a1 1 0 0 1 0 1.4l-.8.8a1 1 0 1 1-1.4-1.4l.8-.8a1 1 0 0 1 1.4 0M12 17.9a1 1 0 0 1 1 1V20a1 1 0 1 1-2 0v-1.1a1 1 0 0 1 1-1m-5.8-.9.8.8a1 1 0 1 1-1.4 1.4l-.8-.8A1 1 0 0 1 6.2 17m-1.1-6a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zM6.2 5.6l.8.8a1 1 0 0 1-1.4 1.4l-.8-.8a1 1 0 0 1 1.4-1.4"/>
                            </svg>
                        </button>
                    </div>
                </header>

                <section className="geti-home-hero">
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
