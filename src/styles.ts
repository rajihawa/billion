import * as CSS from 'csstype';
import { style } from 'million';

export type styles = CSS.Properties<string | number>;

// turn the CSS.Properties object into a string
export const CssToString = (styles: styles): string => {
    const mStyles = Object.entries(styles).reduce((acc, [key, value]) => {
        const kCase = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        const sValue = typeof value == 'number' ? `${value}px` : value;
        acc[kCase] = sValue;
        return acc;
    }, {});

    

    return style(mStyles);
};
