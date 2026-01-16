import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import Button from './Button';
import './Toast.css';

const Toast = ({
    message,
    type = 'info',
    duration = 5000,
    onClose,
    isVisible
}) => {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            case 'warning':
                return <AlertCircle size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={`toast toast--${type}`}
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="toast__icon">
                        {getIcon()}
                    </div>
                    <div className="toast__message">
                        {message}
                    </div>
                    <Button
                        variant="ghost"
                        size="small"
                        icon={<X size={16} />}
                        onClick={() => {
                            setShow(false);
                            setTimeout(onClose, 300);
                        }}
                        className="toast__close"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;