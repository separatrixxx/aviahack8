'use client'
import styles from './Input.module.scss';
import { ChangeEvent, KeyboardEvent } from 'react';


interface InputProps {
    placeholder: string,
    value: string | number | null,
    type: 'text' | 'number';
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
    handleBlur?: (e: ChangeEvent<HTMLInputElement>) => void,
    handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void,
}

export const Input = (props: InputProps) => {
    const { placeholder, value, type, handleChange, handleBlur, handleKeyDown } = props;


    return (
        <input className={styles.input}
            type={type}
            placeholder={placeholder}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
         />
    );
}
