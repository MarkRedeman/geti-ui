import { Icon } from '@geti-ui/ui';
import { heroStats } from '../../hero-stats.generated';
import { InstallCommand } from '../components/InstallCommand';

export function HeroSection() {
    return (
        <section className="geti-home-hero">
            <div className="geti-home-hero__inner">
                <div className="geti-home-hero__panel">
                    <p className="geti-home-hero__eyebrow">Geti Packages</p>
                    <h1 className="geti-home-hero__title">Build Interactive AI Applications</h1>
                    <p className="geti-home-hero__subtitle">
                        UI components, charts, building blocks, icons, and AI tooling. Six packages designed to work
                        together for interactive AI workflows.
                    </p>
                    <div className="geti-home-hero__actions">
                        <a className="geti-home-btn geti-home-btn--primary" href="/components/installation">
                            Get Started
                        </a>
                        <a className="geti-home-btn geti-home-btn--secondary" href="/examples">
                            Explore Examples
                        </a>
                    </div>
                    <InstallCommand command="npx skills add https://docs.geti-ui.markredeman.nl" />
                </div>

                <div className="geti-home-hero__stats">
                    {heroStats.map(({ value, label, href }) => (
                        <a key={label} className="geti-home-stat" href={href}>
                            <span className="geti-home-stat__value">{value}</span>
                            <span className="geti-home-stat__label">{label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
