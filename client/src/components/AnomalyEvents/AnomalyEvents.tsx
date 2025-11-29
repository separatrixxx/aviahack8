import type { VisitEvent } from '@/types/anomalies.interface';

import styles from './AnomalyEvents.module.scss';
import { formatTimestamp, getDeviceInfo, getGeoInfo, getTrafficInfo } from '@/utils/anomalies';

const EVENT_LABELS: Record<string, string> = {
    visit_start: 'Начало визита',
    visit_end: 'Конец визита',
};

interface AnomalyEventsProps {
    events: VisitEvent[];
}

export const AnomalyEvents = (props: AnomalyEventsProps) => {
    const { events } = props;

    return (
        <section className={styles.anomalyEvents}>
            {events.map((event, idx) => {
                const isVisitStart = event.event_type === 'visit_start';
                const isVisitEnd = event.event_type === 'visit_end';
                const deviceInfo = getDeviceInfo(event);
                const geoInfo = getGeoInfo(event);
                const trafficInfo = getTrafficInfo(event);
                const hasAdditional = event.additional && Object.keys(event.additional).length > 0;

                return (
                    <div key={idx} className={styles.event}>
                        <div
                            className={
                                isVisitStart
                                    ? styles.markerStart
                                    : isVisitEnd
                                        ? styles.markerEnd
                                        : styles.markerDefault
                            }
                        />
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <span className={styles.eventType}>
                                    {EVENT_LABELS[event.event_type] || event.event_type}
                                </span>
                                <span className={styles.timestamp}>
                                    {formatTimestamp(event.timestamp)}
                                </span>
                            </div>

                            {event.url && (
                                <div className={styles.row}>
                                    <span className={styles.label}>URL:</span>
                                    <span className={styles.text} title={event.url}>
                                        {event.url}
                                    </span>
                                </div>
                            )}

                            {event.referer && (
                                <div className={styles.row}>
                                    <span className={styles.label}>Реферер:</span>
                                    <span className={styles.text} title={event.referer}>
                                        {event.referer}
                                    </span>
                                </div>
                            )}

                            {deviceInfo && (
                                <div className={styles.row}>
                                    <span className={styles.label}>Устройство:</span>
                                    <span className={styles.text}>{deviceInfo}</span>
                                </div>
                            )}

                            {geoInfo && (
                                <div className={styles.row}>
                                    <span className={styles.label}>Местоположение:</span>
                                    <span className={styles.text}>{geoInfo}</span>
                                </div>
                            )}

                            {trafficInfo && (
                                <div className={styles.row}>
                                    <span className={styles.label}>Трафик:</span>
                                    <span className={styles.text}>{trafficInfo}</span>
                                </div>
                            )}

                            {hasAdditional && (
                                <div className={styles.additional}>
                                    {event.additional.pageViews !== undefined && (
                                        <span className={styles.badge}>
                                            Просмотров: {event.additional.pageViews}
                                        </span>
                                    )}
                                    {event.additional.bounce !== undefined && (
                                        <span className={styles.badge}>
                                            Отказ: {event.additional.bounce ? 'Да' : 'Нет'}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
    );
};
