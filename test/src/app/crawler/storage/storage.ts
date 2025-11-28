import type { EventData } from '../types';

import { create } from 'zustand';


export interface DataState {
    events: EventData[];
    addEvent: (event: EventData) => void;
    clearEvents: () => void;
}

export const useEventStore = create<DataState>((set) => ({
    events: [],
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    clearEvents: () => set({ events: [] }),
}));
