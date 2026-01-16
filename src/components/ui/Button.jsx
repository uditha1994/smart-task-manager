import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    onClick,
    className = '',
    ...props
}) => {
    const baseClass = `btn btn--${variant} btn--${size}`;
    const classes = `${baseClass} ${className} ${disabled ? 'btn--disabled' : ''}`.trim();

    return (
        <motion.button
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ duration: 0.1 }}
            {...props}
        >
            {loading && (
                <div className="btn__spinner">
                    <div className="spinner"></div>
                </div>
            )}
            {icon && !loading && <span className="btn__icon">{icon}</span>}
            <span className="btn__text">{children}</span>
        </motion.button>
    );
};

export default Button;