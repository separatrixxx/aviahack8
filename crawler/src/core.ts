import type { CoreProps, Module } from './types';

import { clickListener } from './metrics/clicks';
import { fcpListener } from './metrics/fcp';
import { lcpListener } from './metrics/lcp';
import { startEventLogger } from './utils/logger';
import { pageTimeListener } from './metrics/pageTime';


export function crawlerCore(props: CoreProps = {}) {
    const { modules, selectors, delayToLocalStore, targetPages } = props;

    const isEnabled = (key: keyof Module) => modules === undefined || modules[key];

    if (isEnabled('clicks')) {
        clickListener(selectors);
    }

    if (isEnabled('fcp')) {
        fcpListener();
    }

    if (isEnabled('lcp')) {
        lcpListener();
    }

    if (isEnabled('pageTime')) {
        pageTimeListener(targetPages);
    }

    startEventLogger(delayToLocalStore);
}
