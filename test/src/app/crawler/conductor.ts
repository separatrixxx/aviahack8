import { useEventStore } from './storage/storage';


export function conductor<T = unknown>(type: string, data: T) {
    useEventStore.getState().addEvent({ type, data });
}