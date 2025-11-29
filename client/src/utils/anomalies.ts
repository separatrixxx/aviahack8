import type { Anomalies, VisitEvent } from '@/types/anomalies.interface';

import axios from 'axios';
import { useAnomaliesStore } from '@/storage/anomalies';


export async function getAnomalies(urvisitId: string, topN: number | null, setIsLoading: (e: boolean) => void) {
    setIsLoading(true);

    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_ANOMALIES +
            `/api/v1/metrics/anomaly?visit_id=${urvisitId}&top_n=${topN || 5}`);
        const data = response.data as Anomalies;

        useAnomaliesStore.getState().setAnomalies(data);
    } catch (e) {
        console.error('Failed to get anomalies', e);
    } finally {
        setIsLoading(false);
    }
}


const DEVICE_CATEGORY: Record<number, string> = {
    1: 'Десктоп',
    2: 'Мобильный',
    3: 'Планшет',
};

export const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const getDeviceInfo = (event: VisitEvent) => {
    if (!event.device || Object.keys(event.device).length === 0) return null;

    const parts = [];

    if (event.device.device_category) {
        parts.push(DEVICE_CATEGORY[event.device.device_category] || 'Неизвестно');
    }

    if (event.device.browser) {
        parts.push(event.device.browser.replace(/_/g, ' '));
    }

    if (event.device.os) {
        parts.push(event.device.os.replace(/_/g, ' '));
    }

    return parts.length > 0 ? parts.join(' • ') : null;
};

export const getGeoInfo = (event: VisitEvent) => {
    if (!event.geo || Object.keys(event.geo).length === 0) return null;

    const parts = [];

    if (event.geo.city) {
        parts.push(event.geo.city);
    }

    if (event.geo.country) {
        parts.push(event.geo.country);
    }

    return parts.length > 0 ? parts.join(', ') : null;
};

export const getTrafficInfo = (event: VisitEvent) => {
    if (!event.traffic || Object.keys(event.traffic).length === 0) {
        return null;
    }

    const parts = [];

    if (event.traffic.source) {
        parts.push(`Источник: ${event.traffic.source}`);
    }

    if (event.traffic.utm_source) {
        parts.push(`UTM: ${event.traffic.utm_source}`);
    }

    if (event.traffic.utm_campaign) {
        parts.push(`Кампания: ${event.traffic.utm_campaign}`);
    }

    return parts.length > 0 ? parts.join(' • ') : null;
};
