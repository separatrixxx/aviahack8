'use client';
import styles from './Anomalies.module.scss';
import { MetricsNotFound } from '../MetricsNotFound/MetricsNotFound';
import { useAnomaliesStore } from '@/storage/anomalies';
import { TopFeatures } from '../TopFeatures/TopFeatures';
import { AnomalyEvents } from '../AnomalyEvents/AnomalyEvents';
import ReactMarkdown from 'react-markdown';
import cn from 'classnames';


export const Anomalies = () => {
    const anomalies = useAnomaliesStore((s) => s.anomalies);

    const { is_anomaly, top_features = [], explanation, llm_explanation, events = [] } = anomalies || {};

    const isAnomaly = is_anomaly ? ' Да' : ' Нет';

    if (!anomalies) {
        return <MetricsNotFound text='Аномалии для выбранного проекта не найдены' />;
    }

    return (
        <div className={styles.anomalies}>
            <span className={styles.isAnomaly}>
                Была ли выявлена аномалия:
                <span className={cn(styles.good, {
                    [styles.bad]: is_anomaly,
                })}>{isAnomaly}</span>
            </span>
            <h3>
                Объяснение от AI:
            </h3>
            <div className={styles.explanation}>
                <ReactMarkdown>
                    {llm_explanation || ''}
                </ReactMarkdown>
            </div>
            <h3>
                Объяснение:
            </h3>
            <div className={styles.explanation}>
                <ReactMarkdown>
                    {explanation || ''}
                </ReactMarkdown>
            </div>
            <h3>
                Основные признаки:
            </h3>
            <TopFeatures features={top_features} />
            <h3>
                Аномальные события:
            </h3>
            <AnomalyEvents events={events} />
        </div>
    );
};
