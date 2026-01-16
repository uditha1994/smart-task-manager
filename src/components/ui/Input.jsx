import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
    label,
    error,
    icon,
    className = '',
    ...props
}, ref) => {
    const inputClasses = `input ${error ? 'input--error' : ''} ${icon ? 'input--with-icon' : ''} ${className}`.trim();

    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    ref={ref}
                    className={inputClasses}
                    {...props}
                />
            </div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;