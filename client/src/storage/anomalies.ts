import type { Anomalies } from '@/types/anomalies.interface';

import { create } from 'zustand';


interface AnomaliesStore {
    anomalies: Anomalies | null;
    setAnomalies: (anomalies: Anomalies) => void;
}

export const useAnomaliesStore = create<AnomaliesStore>((set) => ({
    anomalies: null,
    setAnomalies: (anomalies) => set({ anomalies }),
}));
