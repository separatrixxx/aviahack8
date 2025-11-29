import type { Feature } from '@/types/anomalies.interface';

import styles from './TopFeatures.module.scss';

const FEATURE_LABELS: Record<string, string> = {
    duration: 'Время на сайте',
    pageviews: 'Просмотры страниц',
    unique_pages: 'Уникальных страниц',
    goals: 'Достигнутые цели',
    http_errors: 'HTTP-ошибки',
    early_exit: 'Ранний выход',
    refreshed_pages: 'Обновленные страницы',
    back_navigation: 'Возвраты назад',
};

interface TopFeaturesProps {
    features: Feature[];
}

export const TopFeatures = (props: TopFeaturesProps) => {
    const { features } = props;

    const maxMagnitude = Math.max(...features.map(f => Math.abs(f.shap_value) || 0.01), 0.01);

    return (
        <section className={styles.topFeatures}>
            {features.map((f, idx) => {
                const widthPercent = Math.abs(f.shap_value) / maxMagnitude * 100;
                const isPositive = f.shap_value > 0;
                const isZero = f.shap_value === 0;

                return (
                    <div key={idx} className={styles.feature}>
                        <div className={styles.left}>
                            <span className={styles.name}>
                                {FEATURE_LABELS[f.feature] || f.feature}:
                            </span>
                            <span className={styles.value}>
                                {f.value + ' (показатель аномалии: ' + f.shap_value.toFixed(5) + ')'}
                            </span>
                        </div>
                        <div className={styles.barWrap}>
                            <div
                                className={
                                    isZero
                                        ? styles.barNeutral
                                        : isPositive
                                            ? styles.barPositive
                                            : styles.barNegative
                                }
                                style={{ width: `${widthPercent}%` }}
                                title={`SHAP: ${f.shap_value.toFixed(5)}`}
                            />
                        </div>
                    </div>
                );
            })}
        </section>
    );
};
