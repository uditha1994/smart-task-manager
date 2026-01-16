import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';
import './ToastContainer.css';

const ToastContainer = ({ toasts, onRemoveToast }) => {
    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        isVisible={true}
                        onClose={() => onRemoveToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;