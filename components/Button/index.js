import React from "react";
import styles from "./Button.module.css";

const Button = ({
    children,
    onClick,
    variant = "primary",
    size = "",
    fullWidth = false,
    disabled = false,
    loading = false,
    type = "button",
}) => {
    const classNames = [
        styles.btn,
        styles[variant],
        size ? styles[size] : "",
        fullWidth ? styles.full : "",
        loading ? styles.loading : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? (
                <>
                    <span className={styles.loadDot}></span>
                    <span className={styles.loadDot}></span>
                    <span className={styles.loadDot}></span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
