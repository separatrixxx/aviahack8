import styles from './MetricsNotFound.module.scss';


interface MetricsNotFoundProps {
    text?: string;
}

export const MetricsNotFound = (props: MetricsNotFoundProps) => {
    const { text = 'Метрики для выбранного проекта не найдены' } = props;

    return (
        <div className={styles.metricsNotFound}>
            <span>
                {text}
            </span>
        </div>
    );
}