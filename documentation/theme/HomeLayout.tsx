import { Fragment } from 'react';
import { HomeHero, HomeFeature, HomeFooter } from '@rspress/core/theme-original';
import type { HomeLayoutProps } from '@rspress/core/theme-original';

export const HomeLayout = (props: HomeLayoutProps) => {
    const { beforeHero, afterHero, beforeFeatures, afterFeatures, beforeHeroActions, afterHeroActions } = props;

    return (
        <Fragment>
            {/* Omit HomeBackground which aggressively injects global transparent nav styles */}
            <div className="rp-home-background" />
            {beforeHero}
            <HomeHero beforeHeroActions={beforeHeroActions} afterHeroActions={afterHeroActions} />
            {afterHero}
            {beforeFeatures}
            <HomeFeature />
            {afterFeatures}
            <HomeFooter />
        </Fragment>
    );
};
