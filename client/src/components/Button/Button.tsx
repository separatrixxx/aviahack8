import styles from './Button.module.scss';
import { MouseEvent } from 'react';


interface ButtonProps {
    text: string;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Button = (props: ButtonProps) => {
    const { text, onClick } = props;


    return (
        <button className={styles.button} onClick={onClick}>
            {text}
        </button>
    );
}
