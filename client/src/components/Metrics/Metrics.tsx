'use client';
import styles from './Metrics.module.scss';
import { useState } from 'react';
import { useMetricsStore } from '@/storage/metrics';
import { TimilineRow } from '../TimilineRow/TimilineRow';
import { ExpandedInfo } from '../ExpandedInfo/ExpandedInfo';
import { groupMetricsByDate } from '@/utils/metrics';
import { MetricsNotFound } from '../MetricsNotFound/MetricsNotFound';
import { parse, compareDesc } from 'date-fns';


export const Metrics = () => {
    const metrics = useMetricsStore((s) => s.metrics);

    const metricsGroup = metrics[0];

    const [expanded, setExpanded] = useState<string | null>(null);

    const dateFormat = 'yyyy-MM-dd HH:mm';

    if (!metricsGroup) {
        return <MetricsNotFound />;
    }

    const metricsByDate = groupMetricsByDate(metricsGroup.metrics);
    const dateKeys = Object.keys(metricsByDate).sort((a, b) =>
        compareDesc(
            parse(a, dateFormat, new Date()),
            parse(b, dateFormat, new Date())
        )
    );

    return (
        <div className={styles.metrics}>
            <section>
                <h3>
                    Статистика кликов:
                </h3>
                <>
                    {dateKeys.map((date, i) => {
                        const { clicks, fcps, lcps } = metricsByDate[date];
                        const total = clicks.length;
                        const target = clicks.filter(e => e.isTarget).length;
                        const notTarget = total - target;

                        const avgFCP = fcps.length
                            ? Math.round(fcps.reduce((a, b) => a + b, 0) / fcps.length)
                            : null;

                        const avgLCP = lcps.length
                            ? Math.round(lcps.reduce((a, b) => a + b, 0) / lcps.length)
                            : null;


                        return (
                            <div key={i}>
                                <TimilineRow total={total} target={target} notTarget={notTarget}
                                    date={date} expanded={expanded} fcp={avgFCP} lcp={avgLCP}
                                    setExpanded={setExpanded} />
                                {expanded === date && (
                                    <ExpandedInfo events={clicks} />
                                )}
                            </div>
                        );
                    })}
                </>
            </section>
        </div>
    );
};
