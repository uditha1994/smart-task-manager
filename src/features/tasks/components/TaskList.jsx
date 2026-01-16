import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc } from 'lucide-react';
import TaskCard from './TaskCard';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import './TaskList.css';

const TaskList = ({
    tasks,
    loading,
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    onTaskToggle,
    onTaskEdit,
    onTaskDelete,
    onTimeTrack
}) => {
    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'dueDate', label: 'Due Date' },
        { value: 'priority', label: 'Priority' },
        { value: 'title', label: 'Title' }
    ];

    if (loading) {
        return (
            <div className="task-list__loading">
                <div className="task-list__skeleton">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="task-card-skeleton">
                            <div className="skeleton skeleton--circle"></div>
                            <div className="skeleton skeleton--text"></div>
                            <div className="skeleton skeleton--text skeleton--short"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="task-list">
            <div className="task-list__header">
                <div className="task-list__search">
                    <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        icon={<Search size={16} />}
                    />
                </div>

                <div className="task-list__controls">
                    <select
                        className="task-list__sort"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="task-list__content">
                {tasks.length === 0 ? (
                    <motion.div
                        className="task-list__empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="task-list__empty-icon">📝</div>
                        <h3>No tasks found</h3>
                        <p>Create your first task to get started!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="task-list__grid"
                        layout
                    >
                        <AnimatePresence>
                            {tasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggleComplete={onTaskToggle}
                                    onEdit={onTaskEdit}
                                    onDelete={onTaskDelete}
                                    onTimeTrack={onTimeTrack}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TaskList;