'use client'
import styles from './SelectVisit.module.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useCallback, useState } from 'react';
import { getAnomalies } from '@/utils/anomalies';


interface SelectVisitProps {
    setIsLoading: (e: boolean) => void;
}

export const SelectVisit = (props: SelectVisitProps) => {
    const { setIsLoading } = props;

    const [visitId, setVisitId] = useState<string>('');
    const [topN, setTopN] = useState<number | null>(null);

    const handleClick = useCallback(() => {
        getAnomalies(visitId.trim(), topN, setIsLoading);
    }, [visitId, topN]);

    const handleTopNChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const num = +e.target.value;

        if (!isNaN(num)) {
            setTopN(num);
        }
    }, []);

    return (
        <div className={styles.selectVisit}>
            <Input placeholder='Введите ID визита' value={visitId} type='text'
                handleChange={(e) => setVisitId(e.target.value)} />
            <Input placeholder='Введите количество признаков' value={topN} type='text'
                handleChange={handleTopNChange} />
            <Button text="Анализ" onClick={handleClick} />
        </div>
    );
}
