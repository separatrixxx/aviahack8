'use client'
import styles from './Header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import cn from 'classnames';


export const Header = () => {
    const pathname = usePathname();
    
    return (
        <header className={styles.header}>
            <Link href='/analysis' className={cn({
                [styles.active]: pathname === '/analysis',
            })}>
                AI-анализ
            </Link>
            <Link href='/crawler' className={cn({
                [styles.active]: pathname === '/crawler',
            })}>
                Аналитика на основе данных сборщика
            </Link>
        </header>
    );
}
