import styles from './TimilineRow.module.scss';
import { StatisticBar } from '../StatisticBar/StatisticBar';


interface TimilineRowProps {
    total: number;
    target: number;
    notTarget: number;
    minute: string;
    expanded: string | null;
    setExpanded: (e: string | null) => void;
}

export const TimilineRow = (props: TimilineRowProps) => {
    const { total, target, notTarget, minute, expanded, setExpanded } = props;

    return (
        <div className={styles.timelineRow}
            title='Кликните для подробностей'
            onClick={() => setExpanded(expanded === minute ? null : minute)}
        >
            <span>
                {minute.slice(11)}
            </span>
            <StatisticBar total={total} target={target} notTarget={notTarget} />
            <span>
                {`Всего: ${total} (Целевые: ${target}, Не целевые: ${notTarget})`}
            </span>
        </div>
    );
}