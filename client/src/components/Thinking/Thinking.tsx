'use client'
import { useEffect, useState } from 'react';
import styles from './Thinking.module.scss';

const steps = [
    { text: 'Осознаю запрос...', timeout: 0 },
    { text: 'Размышляю...', timeout: 5000 },
    { text: 'Подготавливаю ответ...', timeout: 17000 },
];

export const Thinking = () => {
    const [text, setText] = useState<string>(steps[0].text);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        steps.slice(1).forEach((step) => {
            timers.push(
                setTimeout(() => setText(step.text), step.timeout)
            );
        });
        
        return () => { timers.forEach(clearTimeout); };
    }, []);

    return (
        <div className={styles.thinking}>
            <div className={styles.spinner}></div>
            <div className={styles.text}>{text}</div>
        </div>
    );
};
