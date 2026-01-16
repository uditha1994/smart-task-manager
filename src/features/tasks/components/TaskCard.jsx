import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Circle,
    Edit3,
    Trash2,
    Calendar,
    Clock,
    Flag,
    MoreHorizontal
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { TaskStatus, TaskPriority } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import './TaskCard.css';

const TaskCard = ({
    task,
    onToggleComplete,
    onEdit,
    onDelete,
    onTimeTrack
}) => {
    const [showActions, setShowActions] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const handleToggleComplete = async () => {
        setIsCompleting(true);
        try {
            await onToggleComplete(task.id);
        } finally {
            setIsCompleting(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case TaskPriority.HIGH: return 'var(--error)';
            case TaskPriority.MEDIUM: return 'var(--warning)';
            case TaskPriority.LOW: return 'var(--success)';
            default: return 'var(--text-muted)';
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            work: '#3b82f6',
            personal: '#8b5cf6',
            urgent: '#ef4444',
            health: '#10b981',
            learning: '#f59e0b'
        };
        return colors[category] || '#64748b';
    };

    const isCompleted = task.status === TaskStatus.COMPLETED;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={`task-card ${isCompleted ? 'task-card--completed' : ''} ${isOverdue ? 'task-card--overdue' : ''}`}
                hover
                padding="medium"
            >
                <div className="task-card__header">
                    <motion.button
                        className="task-card__checkbox"
                        onClick={handleToggleComplete}
                        disabled={isCompleting}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isCompleting ? (
                            <div className="spinner spinner--small"></div>
                        ) : isCompleted ? (
                            <CheckCircle className="task-card__check-icon task-card__check-icon--completed" />
                        ) : (
                            <Circle className="task-card__check-icon" />
                        )}
                    </motion.button>

                    <div className="task-card__content">
                        <h3 className={`task-card__title ${isCompleted ? 'task-card__title--completed' : ''}`}>
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="task-card__description">{task.description}</p>
                        )}
                    </div>

                    <div className="task-card__actions">
                        <Button
                            variant="ghost"
                            size="small"
                            icon={<MoreHorizontal size={16} />}
                            onClick={() => setShowActions(!showActions)}
                        />
                    </div>
                </div>

                <div className="task-card__meta">
                    <div className="task-card__tags">
                        <span
                            className="task-card__category"
                            style={{ backgroundColor: getCategoryColor(task.category) }}
                        >
                            {task.category}
                        </span>

                        <span
                            className="task-card__priority"
                            style={{ color: getPriorityColor(task.priority) }}
                        >
                            <Flag size={12} />
                            {task.priority}
                        </span>
                    </div>

                    <div className="task-card__dates">
                        {task.dueDate && (
                            <span className={`task-card__due-date ${isOverdue ? 'task-card__due-date--overdue' : ''}`}>
                                <Calendar size={12} />
                                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                            </span>
                        )}

                        {task.estimatedTime > 0 && (
                            <span className="task-card__time">
                                <Clock size={12} />
                                {task.estimatedTime}h
                            </span>
                        )}
                    </div>
                </div>

                {showActions && (
                    <motion.div
                        className="task-card__action-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Button
                            variant="ghost"
                            size="small"
                            icon={<Edit3 size={14} />}
                            onClick={() => onEdit(task)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="small"
                            icon={<Clock size={14} />}
                            onClick={() => onTimeTrack(task)}
                        >
                            Track Time
                        </Button>
                        <Button
                            variant="ghost"
                            size="small"
                            icon={<Trash2 size={14} />}
                            onClick={() => onDelete(task.id)}
                            className="task-card__delete-btn"
                        >
                            Delete
                        </Button>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
};

export default TaskCard;