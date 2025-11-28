import type { FcpData } from '../types';

import { conductor } from '../conductor';
import { getMeta } from '../utils/meta';


let fcpListenerInitialized = false;

export function fcpListener() {
    if (fcpListenerInitialized) {
        return;
    }

    fcpListenerInitialized = true;

    if (!('PerformanceObserver' in window)) {
        return;
    }

    const meta = getMeta();

    const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
                const fcpData: FcpData = {
                    meta,
                    fcp: entry.startTime,
                };

                conductor('fcp', fcpData);

                observer.disconnect();

                fcpListenerInitialized = false;
            }
        }
    });

    try {
        observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
        console.warn('FCP paint observation is not supported:', e);
    }
}

