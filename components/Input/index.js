import React from "react";
import styles from "./Input.module.css";

const Input = ({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    error = "",
    hint = "",
    required = false,
}) => {
    return (
        <div className={styles.inputWrapper}>
            {label && (
                <label className={styles.label} htmlFor={name}>
                    {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${styles.input} ${error ? styles.error : ""}`}
                required={required}
            />
            {hint && !error && <span className={styles.hint}>{hint}</span>}
            {error && <span className={styles.errorMsg}>⚠ {error}</span>}
        </div>
    );
};

export default Input;
