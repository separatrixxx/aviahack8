import type { Meta } from '../types';

import { format } from 'date-fns';

export function getMeta(): Meta {
    const url = window.location.href;
    const date = Date.now();
    const timestamp = format(date, 'dd-MM-yyyy HH:ss');

    return {
        url,
        timestamp,
    }
}
