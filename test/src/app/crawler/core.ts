import { clickListener } from './clicks';
import { fcpListener } from './fcp';
import { lcpListener } from './lcp';
import { startEventLogger } from './logger';
import { CoreProps, Module } from './types';


export function crawlerCore(props: CoreProps = {}) {
    const { modules, selectors, delayToLocalStore } = props;

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

    startEventLogger(delayToLocalStore);
}
