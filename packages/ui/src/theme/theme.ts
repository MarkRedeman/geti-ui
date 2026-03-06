import { defaultTheme } from '@adobe/react-spectrum';
import { Theme, CSSModule } from '@react-types/provider';

import dark from './geti-dark.module.css';
import global from './geti-global.module.css';
import large from './geti-large.module.css';
import light from './geti-light.module.css';
import medium from './geti-medium.module.css';

function mergeClasses(defaultObj: CSSModule = {}, customObj: CSSModule = {}): CSSModule {
    const merged = { ...defaultObj };
    for (const key in customObj) {
        if (merged[key]) {
            merged[key] = `${merged[key]} ${customObj[key]}`;
        } else {
            merged[key] = customObj[key];
        }
    }
    return merged;
}

const getiTheme: Theme = {
    dark: mergeClasses(defaultTheme.dark, dark),
    light: mergeClasses(defaultTheme.light, light),
    large: mergeClasses(defaultTheme.large, large),
    medium: mergeClasses(defaultTheme.medium, medium),
    global: mergeClasses(defaultTheme.global, global),
};

export default getiTheme;
