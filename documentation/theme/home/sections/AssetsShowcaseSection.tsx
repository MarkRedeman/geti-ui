import { InstallCommand } from '../components/InstallCommand';
import { showcaseIllustrations, showcaseDomains } from '../data';

export function AssetsShowcaseSection() {
    return (
        <section className="geti-home-showcase geti-home-showcase--reverse" aria-label="Images and domains">
            <div className="geti-home-showcase__inner">
                <div className="geti-home-showcase__text">
                    <p className="geti-home-showcase__kicker">Visual assets</p>
                    <h2 className="geti-home-showcase__title">@geti-ui/ui/assets</h2>
                    <p className="geti-home-showcase__desc">
                        Production-ready SVG illustrations and domain thumbnails for empty states, onboarding, error
                        pages, and contextual guidance. Inline SVG components and static WebP image URLs.
                    </p>
                    <InstallCommand command="npm install @geti-ui/ui" />
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
    );
}
