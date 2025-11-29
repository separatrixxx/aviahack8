'use client';

import type { FcpData, LcpData } from '@/types/metrics.interface';

import styles from './Metrics.module.scss';
import { useState } from 'react';
import { useMetricsStore } from '@/storage/metrics';
import { getMinuteKey } from '@/utils/date';
import { MetricDisplay } from '../MetricDisplay/MetricDisplay';
import { StatisticBar } from '../StatisticBar/StatisticBar';
import { TimilineRow } from '../TimilineRow/TimilineRow';
import { ExpandedInfo } from '../ExpandedInfo/ExpandedInfo';


export const Metrics = () => {
    const metricsArr = useMetricsStore((s) => s.metrics);

    const metricsGroup = metricsArr[0];
    const [expanded, setExpanded] = useState<string | null>(null);

    if (!metricsGroup) {
        return null;
    }

    const fcpItem = metricsGroup.metrics.find(e => e.type === 'fcp');
    const lcpItem = metricsGroup.metrics.find(e => e.type === 'lcp');
    const fcp = fcpItem ? (fcpItem.data as FcpData).fcp : null;
    const lcp = lcpItem ? (lcpItem.data as LcpData).lcp : null;

    const clicks = metricsGroup.metrics.filter(e => e.type === 'click') as any[];

    const minutes: Record<string, any[]> = {};

    for (const c of clicks) {
        const minute = getMinuteKey(c.data.meta.timestamp);

        if (!minutes[minute]) {
            minutes[minute] = [];
        }
        
        minutes[minute].push(c.data);
    }

    const minuteKeys = Object.keys(minutes).sort();

    return (
        <div className={styles.metrics}>
            <section className={styles.lcpSection}>
                <MetricDisplay label='FCP' value={fcp} isBad={fcp !== null && fcp >= 300} />
                <MetricDisplay label='LCP' value={lcp} isBad={lcp !== null && lcp >= 300} />
            </section>
            <section>
                <h3>
                    Статистика кликов
                </h3>
                <>
                    {minuteKeys.map((minute, i) => {
                        const events = minutes[minute];
                        const total = events.length;
                        const target = events.filter(e => e.isTarget).length;
                        const notTarget = total - target;

                        return (
                            <div key={i}>
                               <TimilineRow total={total} target={target} notTarget={notTarget}
                                    minute={minute} expanded={expanded} setExpanded={setExpanded} />
                                {expanded === minute && (
                                    <ExpandedInfo events={events} />
                                )}
                            </div>
                        );
                    })}
                </>
            </section>
        </div>
    );
};
