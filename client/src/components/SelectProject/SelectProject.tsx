'use client'
import styles from './SelectProject.module.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useCallback, useState, KeyboardEvent } from 'react';
import { getMetrics } from '@/utils/metrics';


export const SelectProject = () => {
    const [url, setUrl] = useState<string>('');

    const handleClick = useCallback(() => {
        getMetrics(url.trim());
    }, [url]);

    const handleBlur = useCallback(() => {
        if (url && !/^https?:\/\//i.test(url.trim())) {
            setUrl('http://' + url.trim());
        }
    }, [url]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur();
            handleClick();
        }
    }, [url]);

    return (
        <div className={styles.selectProject}>
            <Input placeholder='Введите ссылку' value={url} type='text' handleChange={(e) => setUrl(e.target.value)}
                handleBlur={handleBlur} handleKeyDown={handleKeyDown} />
            <Button text="Анализ" onClick={handleClick} />
        </div>
    );
}
