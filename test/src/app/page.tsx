'use client'
import styles from "./page.module.css";
import { crawlerCore } from "./crawler/core";


export default function Home() {
    crawlerCore({
        selectors: {
            targeted: ['[class$="button3"]'],
            tracked: ['button'],
        },
        delayToLocalStore: 5,
        modules: {
            clicks: true,
            fcp: true,
            lcp: true,
        }
    });
    
    return (
        <div className={styles.page}>
            <button>Button 1</button>
            <button style={{ background: 'red' }}>Button 2</button>
            <button className={styles.button3}>Button 3</button>
        </div>
    );
}
