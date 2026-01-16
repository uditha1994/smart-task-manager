import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
    children,
    className = '',
    hover = false,
    padding = 'medium',
    ...props
}) => {
    const classes = `card card--${padding} ${hover ? 'card--hover' : ''} ${className}`.trim();

    return (
        <motion.div
            className={classes}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -2 } : {}}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;