import type { MetricGroup } from '@/types/metrics.interface';

import axios from 'axios';
import { useMetricsStore } from '@/storage/metrics';


export async function getMetrics(url: string) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API + '/api/v1/metrics/by_url/?url=' + url);
        const data = response.data as MetricGroup[];
        
        useMetricsStore.getState().setMetrics(data);
    } catch (e) {
        console.error('Failed to get metrics', e);
    }
}
