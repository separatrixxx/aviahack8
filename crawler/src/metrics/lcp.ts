import type { LcpData } from '../types';

import { conductor } from '../conductor';
import { getMeta } from '../utils/meta';


let lcpListenerInitialized = false;

export function lcpListener() {
    if (lcpListenerInitialized) {
        return;
    }

    lcpListenerInitialized = true;

    if (!('PerformanceObserver' in window)) {
        return;
    }

    const meta = getMeta();

    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if ('startTime' in entry) {
                const lcpData: LcpData = {
                    meta,
                    lcp: entry.startTime,
                };
                
                conductor('lcp', lcpData);

                observer.disconnect();

                lcpListenerInitialized = false;
            }
        }
    });
    try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
        console.warn('LCP observation is not supported:', e);
        return;
    }
}
