'use client'
import styles from './SelectProject.module.scss';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useState } from 'react';
import { getMetrics } from '@/utils/metrics';


export const SelectProject = () => {
    const [url, setUrl] = useState<string>('');

    return (
        <div className={styles.selectProject}>
            <Input placeholder='Введите ссылку' value={url} handleChange={(e) => setUrl(e.target.value)} />
            <Button text="Анализ" onClick={() => getMetrics(url.trim())} />
        </div>
    );
}
