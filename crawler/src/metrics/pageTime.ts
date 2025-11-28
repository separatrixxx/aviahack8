import type { PageTimeData } from '../types';

import { getMeta } from '../utils/meta';
import { conductor } from '../conductor';


export function pageTimeListener(targetPages?: string[]) {
    if (!targetPages || targetPages.length === 0 || typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const currentUrl = window.location.href;

    if (!targetPages.includes(currentUrl)) {
        return;
    }

    const meta = getMeta();

    const enterTime = Date.now();

    function onLeave() {
        const leaveTime = Date.now();
        const pageTime = (leaveTime - enterTime) / 1000;

        const pageTimeData: PageTimeData = {
            meta,
            pageTime
        };

        conductor('pageTime', pageTimeData);
    }

    window.addEventListener('beforeunload', onLeave);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            onLeave();
        }
    });
}
