import React from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    Plus,
    Filter,
    Calendar,
    Tag,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';
import { TaskCategory, TaskStatus } from '../../types';
import './Sidebar.css';

const Sidebar = ({
    isOpen,
    onClose,
    onAddTask,
    onFilterChange,
    activeFilter,
    taskCounts
}) => {
    const filterOptions = [
        { key: 'all', label: 'All Tasks', icon: Home, count: taskCounts.total },
        { key: 'pending', label: 'Pending', icon: Clock, count: taskCounts.pending },
        { key: 'completed', label: 'Completed', icon: CheckCircle, count: taskCounts.completed },
        { key: 'urgent', label: 'Urgent', icon: AlertCircle, count: taskCounts.urgent },
    ];

    const categoryOptions = Object.values(TaskCategory).map(category => ({
        key: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        icon: Tag,
        count: taskCounts.categories[category] || 0
    }));

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <motion.div
                    className="sidebar-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
                initial={{ x: -280 }}
                animate={{ x: isOpen ? 0 : -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                <div className="sidebar__content">
                    <div className="sidebar__header">
                        <Button
                            variant="primary"
                            icon={<Plus size={18} />}
                            onClick={onAddTask}
                            className="sidebar__add-btn"
                        >
                            Add Task
                        </Button>
                    </div>

                    <nav className="sidebar__nav">
                        <div className="sidebar__section">
                            <h3 className="sidebar__section-title">
                                <Filter size={16} />
                                Filters
                            </h3>
                            <ul className="sidebar__list">
                                {filterOptions.map(option => (
                                    <li key={option.key}>
                                        <button
                                            className={`sidebar__item ${activeFilter === option.key ? 'sidebar__item--active' : ''}`}
                                            onClick={() => onFilterChange(option.key)}
                                        >
                                            <option.icon size={18} />
                                            <span className="sidebar__item-label">{option.label}</span>
                                            <span className="sidebar__item-count">{option.count}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="sidebar__section">
                            <h3 className="sidebar__section-title">
                                <Tag size={16} />
                                Categories
                            </h3>
                            <ul className="sidebar__list">
                                {categoryOptions.map(option => (
                                    <li key={option.key}>
                                        <button
                                            className={`sidebar__item ${activeFilter === option.key ? 'sidebar__item--active' : ''}`}
                                            onClick={() => onFilterChange(option.key)}
                                        >
                                            <option.icon size={18} />
                                            <span className="sidebar__item-label">{option.label}</span>
                                            <span className="sidebar__item-count">{option.count}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;