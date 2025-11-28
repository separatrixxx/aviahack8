import { create } from 'zustand';

export interface TypedEvent<T = unknown> {
    type: string;
    data: T;
}

interface DataState {
    events: TypedEvent[];
    addEvent: (event: TypedEvent) => void;
    clearEvents: () => void;
}

export const useEventStore = create<DataState>((set) => ({
    events: [],
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    clearEvents: () => set({ events: [] }),
}));
