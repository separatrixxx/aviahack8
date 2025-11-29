import type { GroupedMetrics, MetricGroup } from '@/types/metrics.interface';

import axios from 'axios';
import { useMetricsStore } from '@/storage/metrics';
import { getDateKey } from './date';


export async function getMetrics(url: string) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API + '/api/v1/metrics/by_url/?url=' + url);
        const data = response.data as MetricGroup[];
        
        useMetricsStore.getState().setMetrics(data);
    } catch (e) {
        console.error('Failed to get metrics', e);
    }
}

export function groupMetricsByDate(metrics: any[]): GroupedMetrics {
    const result: GroupedMetrics = {};

    for (const m of metrics) {
        let date: string | undefined;

        if (m.type === 'click') {
            date = getDateKey(m.data.meta.timestamp);
        } else if (m.type === 'fcp' || m.type === 'lcp') {
            date = getDateKey(m.data.meta.timestamp);
        }

        if (!date) {
            continue;
        }

        if (!result[date]) {
            result[date] = { clicks: [], fcps: [], lcps: [] };
        }

        if (m.type === 'click') {
            result[date].clicks.push(m.data);
        }

        if (m.type === 'fcp') {
            result[date].fcps.push(m.data.fcp);
        }

        if (m.type === 'lcp') {
            result[date].lcps.push(m.data.lcp);
        }
    }

    return result;
}
