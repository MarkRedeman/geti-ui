import { Icon } from '@geti-ui/ui';
import { InstallCommand } from '../components/InstallCommand';
import { showcaseIcons } from '../data';

export function IconsShowcaseSection() {
    return (
        <section className="geti-home-showcase" aria-label="Icons">
            <div className="geti-home-showcase__inner">
                <div className="geti-home-showcase__text">
                    <p className="geti-home-showcase__kicker">Iconography</p>
                    <h2 className="geti-home-showcase__title">@geti-ui/ui/icons</h2>
                    <p className="geti-home-showcase__desc">
                        150+ workflow icons aligned with Geti semantics. Custom SVGs for AI/ML operations plus Adobe
                        Spectrum workflow re-exports. Tree-shakeable imports keep bundles lean.
                    </p>
                    <InstallCommand command="npm install @geti-ui/ui" />
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
    );
}
