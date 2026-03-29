import { Fragment } from 'react';
import { HomeFooter } from '@rspress/core/theme-original';
import type { HomeLayoutProps } from '@rspress/core/theme-original';
import { HeroSection } from './home/sections/HeroSection';
import { UiShowcaseSection } from './home/sections/UiShowcaseSection';
import { ChartsShowcaseSection } from './home/sections/ChartsShowcaseSection';
import { BlocksShowcaseSection } from './home/sections/BlocksShowcaseSection';
import { SmartToolsShowcaseSection } from './home/sections/SmartToolsShowcaseSection';
import { McpShowcaseSection } from './home/sections/McpShowcaseSection';
import { IconsShowcaseSection } from './home/sections/IconsShowcaseSection';
import { AssetsShowcaseSection } from './home/sections/AssetsShowcaseSection';

export const HomeLayout = (props: HomeLayoutProps) => {
    const { beforeHero, afterHero, beforeFeatures, afterFeatures } = props;

    return (
        <Fragment>
            <div className="rp-home-background geti-home-bg" />

            {beforeHero}
            <main className="geti-home-wrapper">
                <HeroSection />
                {afterHero}

                {beforeFeatures}

                <UiShowcaseSection />
                <ChartsShowcaseSection />
                <BlocksShowcaseSection />
                <SmartToolsShowcaseSection />
                <McpShowcaseSection />
                <IconsShowcaseSection />
                <AssetsShowcaseSection />

                {afterFeatures}
            </main>

            <HomeFooter />
        </Fragment>
    );
};
