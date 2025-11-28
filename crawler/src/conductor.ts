import type { EventType } from './types';

import { useEventStore } from './storage/storage';


export function conductor<T = unknown>(type: string, data: EventType[]) {
    useEventStore.getState().addEvent({ type, data });
}