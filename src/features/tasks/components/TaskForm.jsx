import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Flag, Tag } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import { TaskCategory, TaskPriority } from '../../../types';
import './TaskForm.css';

const TaskForm = ({
    task = null,
    isOpen,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: TaskCategory.PERSONAL,
        priority: TaskPriority.MEDIUM,
        dueDate: '',
        estimatedTime: 0,
        tags: []
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                category: task.category || TaskCategory.PERSONAL,
                priority: task.priority || TaskPriority.MEDIUM,
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                estimatedTime: task.estimatedTime || 0,
                tags: task.tags || []
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: TaskCategory.PERSONAL,
                priority: TaskPriority.MEDIUM,
                dueDate: '',
                estimatedTime: 0,
                tags: []
            });
        }
        setErrors({});
    }, [task, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.estimatedTime < 0) {
            newErrors.estimatedTime = 'Estimated time cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
            };

            await onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Error submitting task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="task-form-overlay">
            <motion.div
                className="task-form-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="task-form" padding="large">
                    <div className="task-form__header">
                        <h2 className="task-form__title">
                            {task ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <Button
                            variant="ghost"
                            size="small"
                            icon={<X size={18} />}
                            onClick={onClose}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="task-form__form">
                        <Input
                            label="Task Title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            error={errors.title}
                            placeholder="Enter task title..."
                            autoFocus
                        />

                        <div className="task-form__field">
                            <label className="task-form__label">Description</label>
                            <textarea
                                className="task-form__textarea"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Enter task description..."
                                rows={3}
                            />
                        </div>

                        <div className="task-form__row">
                            <div className="task-form__field">
                                <label className="task-form__label">
                                    <Tag size={16} />
                                    Category
                                </label>
                                <select
                                    className="task-form__select"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                >
                                    {Object.values(TaskCategory).map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="task-form__field">
                                <label className="task-form__label">
                                    <Flag size={16} />
                                    Priority
                                </label>
                                <select
                                    className="task-form__select"
                                    value={formData.priority}
                                    onChange={(e) => handleChange('priority', e.target.value)}
                                >
                                    {Object.values(TaskPriority).map(priority => (
                                        <option key={priority} value={priority}>
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="task-form__row">
                            <Input
                                label="Due Date"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => handleChange('dueDate', e.target.value)}
                                icon={<Calendar size={16} />}
                            />

                            <Input
                                label="Estimated Time (hours)"
                                type="number"
                                min="0"
                                step="0.5"
                                value={formData.estimatedTime}
                                onChange={(e) => handleChange('estimatedTime', parseFloat(e.target.value) || 0)}
                                error={errors.estimatedTime}
                                icon={<Clock size={16} />}
                            />
                        </div>

                        <div className="task-form__actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                            >
                                {task ? 'Update Task' : 'Create Task'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default TaskForm;