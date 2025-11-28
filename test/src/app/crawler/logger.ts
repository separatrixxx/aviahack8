import { useEventStore } from "./storage";


function runEachMinute(fn: () => void, seconds: number) {
    const now = new Date();
    const delay = (seconds - now.getSeconds()) * 1000 - now.getMilliseconds();

    setTimeout(() => {
        fn();
        setInterval(fn, seconds * 1000);
    }, delay);
}

export function startEventLogger(seconds = 60) {
    runEachMinute(() => {
        const state = useEventStore.getState();

        if (state.events.length > 0) {
            console.log(state.events);
            state.clearEvents();
        }
    }, seconds);
}