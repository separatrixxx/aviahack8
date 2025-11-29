import styles from './TimilineRow.module.scss';
import { StatisticBar } from '../StatisticBar/StatisticBar';


interface TimilineRowProps {
    total: number;
    target: number;
    notTarget: number;
    date: string;
    expanded: string | null;
    setExpanded: (e: string | null) => void;
}

export const TimilineRow = (props: TimilineRowProps) => {
    const { total, target, notTarget, date, expanded, setExpanded } = props;

    return (
        <div className={styles.timelineRow}
            title='Кликните для подробностей'
            onClick={() => setExpanded(expanded === date ? null : date)}
        >
            <span>
                {date}
            </span>
            <StatisticBar total={total} target={target} notTarget={notTarget} />
            <span>
                {`Всего: ${total} (Целевые: ${target}, Не целевые: ${notTarget})`}
            </span>
        </div>
    );
}