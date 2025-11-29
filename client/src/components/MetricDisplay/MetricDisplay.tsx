import styles from './MetricDisplay.module.scss';
import cn from 'classnames';


interface MetricDisplayProps {
    label: string;
    value: number | null;
    isBad: boolean;
}

export const MetricDisplay = (props: MetricDisplayProps) => {
    const {label, value, isBad} = props;

    if (value === null) {
        return null;
    }

    return (
        <span className={cn(styles.metricDisplay, {
            [styles.bad]: isBad,
        })}
            style={{
                
            }}
        >{label}: {value} ms</span>
    );
}