import type { ClickData, Selectors } from '../types';

import { conductor } from '../conductor';
import { getMeta } from '../utils/meta';


export function getComputedCssProperties(style: CSSStyleDeclaration): Record<string, string> {
    const result: Record<string, string> = {};

    for (const prop of Array.from(style)) {
        const value = style.getPropertyValue(prop);

        if (value && value.trim() !== "") {
            result[prop] = value;
        }
    }

    return result;
}

let clickListenerInitialized = false;

export function clickListener(selectors?: Selectors) {
    if (clickListenerInitialized) {
        return;
    }

    clickListenerInitialized = true;

    function handleClick(e: MouseEvent) {
        const target = e.target as HTMLElement;

        if (selectors && !selectors.tracked.some(s => target.matches(s))) {
            return;
        }

        const cssStyles = window.getComputedStyle(target);
        const meta = getMeta();

        let isTarget = true;

        if (!selectors || !selectors.targeted.some(s => target.matches(s))) {
            isTarget = false;
        }

        const clicksData: ClickData = {
            meta,
            isTarget,
            element: target.tagName,
            className: target.className,
            inlineStyles: target.getAttribute('style'),
            // cssStyles: getComputedCssProperties(cssStyles),
            cursorCoords: {
                x: e.clientX,
                y: e.clientY,
            },
        };

        conductor('click', clicksData);
    }

    if (typeof document === 'undefined') {
        return;
    }

    document.addEventListener('click', handleClick);

    return () => {
        document.removeEventListener('click', handleClick);
        clickListenerInitialized = false;
    };
}
