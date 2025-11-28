import type { EventData } from '../types';

import axios from 'axios';


export async function sender(data: EventData[]) {
    if(typeof window === undefined) {
        return;
    }

    const url = window.location.origin; 

    try {
        await axios.post('http://localhost:8000/api/v1/metrics/', {
            url,
            metrics: data,
        });
    } catch (e) {
        console.error('Failed to send metrics', e);
    }
}
