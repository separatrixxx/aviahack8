import styles from './StatisticBar.module.scss';


interface StatisticBarProps {
    total: number;
    target: number;
    notTarget: number;
}

export const StatisticBar = (props: StatisticBarProps) => {
    const { total, target, notTarget } = props;

    return (
        <div className={styles.statisticBar}>
            <div className={styles.goodBar}
                style={{
                    width: total ? `${(target / total) * 100}%` : 0,
                }}
            />
            <div className={styles.badBar}
                style={{
                    width: total ? `${(notTarget / total) * 100}%` : 0,
                }}
            />
        </div>
    );
}