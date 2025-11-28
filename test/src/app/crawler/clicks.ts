import { conductor } from './conductor';
import { ClickData } from './types';
import { getMeta } from './meta';


function getComputedCssProperties(style: CSSStyleDeclaration): Record<string, string> {
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

export function clickListener(selectors?: string[]) {
    if (clickListenerInitialized) {
        return;
    }

    clickListenerInitialized = true;

    function handleClick(e: MouseEvent) {
        const target = e.target as HTMLElement;

        if (selectors && !selectors.some(sel => target.matches(sel))) {
            return;
        }

        const cssStyles = window.getComputedStyle(target);
        const meta = getMeta();

        const clicksData: ClickData = {
            meta,
            element: target,
            className: target.className,
            inlineStyles: target.getAttribute('style'),
            cssStyles: getComputedCssProperties(cssStyles),
            cursorCoords: {
                x: e.clientX,
                y: e.clientY,
            },
        };

        conductor('click', clicksData);
    }

    document.addEventListener('click', handleClick);

    return () => {
        document.removeEventListener('click', handleClick);
        clickListenerInitialized = false;
    };
}
