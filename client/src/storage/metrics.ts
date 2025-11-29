import type { MetricGroup } from '@/types/metrics.interface';

import { create } from 'zustand';


interface MetricsStore {
    metrics: MetricGroup[];
    setMetrics: (metrics: MetricGroup[]) => void;
}

export const useMetricsStore = create<MetricsStore>((set) => ({
    metrics: [],
    setMetrics: (metrics) => set({ metrics }),
}));
