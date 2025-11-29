import { useEventStore } from './storage/storage';


export function conductor(type: string, data: any) {
    useEventStore.getState().addEvent({ type, data });
}