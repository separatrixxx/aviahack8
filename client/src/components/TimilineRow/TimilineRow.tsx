import styles from './TimilineRow.module.scss';
import { StatisticBar } from '../StatisticBar/StatisticBar';
import { MetricDisplay } from '../MetricDisplay/MetricDisplay';
import cn from 'classnames';


interface TimilineRowProps {
    total: number;
    target: number;
    notTarget: number;
    date: string;
    expanded: string | null;
    fcp: number | null;
    lcp: number | null;
    setExpanded: (e: string | null) => void;
}

export const TimilineRow = (props: TimilineRowProps) => {
    const { total, target, notTarget, date, expanded, fcp, lcp, setExpanded } = props;

    return (
        <div className={cn(styles.timelineRow, {
            [styles.isBrightness]: total,
        })}
            title='Кликните для подробностей'
            onClick={total ? (() => setExpanded(expanded === date ? null : date)) : (() => { })}
        >
            <span className={styles.date}>
                {date}
            </span>
            {
                total
                    ? <StatisticBar total={total} target={target} notTarget={notTarget} />
                    : (
                        <section className={styles.lcpSection}>
                            <MetricDisplay label='Первая отрисовка контента' value={fcp} isBad={fcp !== null && fcp >= 300} />
                            <MetricDisplay label='Полная отрисовка контента' value={lcp} isBad={lcp !== null && lcp >= 300} />
                        </section>
                    )
            }
            {
                total !== 0 && (
                    <span>
                        {`Общее количество кликов: ${total} (целевых ${target})`}
                    </span>
                )
            }
        </div>
    );
}