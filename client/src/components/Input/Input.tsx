'use client'
import styles from './Input.module.scss';
import { ChangeEvent } from 'react';


interface InputProps {
    placeholder: string,
    value: string,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

export const Input = (props: InputProps) => {
    const { placeholder, value, handleChange } = props;


    return (
        <input className={styles.input}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
         />
    );
}
