// src/components/layout/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    Plus,
    Filter,
    Calendar,
    Tag,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    Briefcase,
    Heart,
    Book,
    Star,
    Flag,
    Folder,
    ShoppingCart,
    Music,
    Camera,
    Gift,
    Coffee
} from 'lucide-react';
import Button from '../ui/Button';
import { categoryService } from '../../services/categoryService';
import './Sidebar.css';

// Icon mapping for dynamic categories
const iconComponents = {
    'user': User,
    'briefcase': Briefcase,
    'alert-circle': AlertCircle,
    'heart': Heart,
    'book': Book,
    'home': Home,
    'star': Star,
    'flag': Flag,
    'folder': Folder,
    'tag': Tag,
    'shopping-cart': ShoppingCart,
    'music': Music,
    'camera': Camera,
    'gift': Gift,
    'coffee': Coffee
};

const Sidebar = ({
    isOpen,
    onClose,
    onAddTask,
    onFilterChange,
    activeFilter,
    taskCounts,
    categories: propCategories // Optional: pass from parent if already loaded
}) => {
    const [categories, setCategories] = useState([]);

    // Load categories on mount and when they might change
    useEffect(() => {
        loadCategories();

        // Listen for storage changes (when categories are updated in settings)
        const handleStorageChange = (e) => {
            if (e.key === 'task-categories') {
                loadCategories();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event listener for same-tab updates
        window.addEventListener('categoriesUpdated', loadCategories);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('categoriesUpdated', loadCategories);
        };
    }, []);

    // Update categories if passed from parent
    useEffect(() => {
        if (propCategories && propCategories.length > 0) {
            setCategories(propCategories);
        }
    }, [propCategories]);

    const loadCategories = () => {
        const loadedCategories = categoryService.getCategories();
        setCategories(loadedCategories);
    };

    // Get icon component for category
    const getCategoryIcon = (iconName) => {
        return iconComponents[iconName] || Tag;
    };

    // Get category count from taskCounts
    const getCategoryCount = (categoryId) => {
        if (taskCounts?.categories) {
            return taskCounts.categories[categoryId] || 0;
        }
        return 0;
    };

    // Filter options (static filters)
    const filterOptions = [
        {
            key: 'all',
            label: 'All Tasks',
            icon: Home,
            count: taskCounts?.total || 0
        },
        {
            key: 'pending',
            label: 'Pending',
            icon: Clock,
            count: taskCounts?.pending || 0
        },
        {
            key: 'completed',
            label: 'Completed',
            icon: CheckCircle,
            count: taskCounts?.completed || 0
        },
        {
            key: 'urgent',
            label: 'Urgent',
            icon: AlertCircle,
            count: taskCounts?.urgent || 0
        },
        {
            key: 'today',
            label: 'Due Today',
            icon: Calendar,
            count: taskCounts?.today || 0
        },
    ];

    // Handle filter click
    const handleFilterClick = (filterKey) => {
        onFilterChange(filterKey);
        // Close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            onClose?.();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
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
                    {/* Header with Add Task Button */}
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
                        {/* Filters Section */}
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
                                            onClick={() => handleFilterClick(option.key)}
                                        >
                                            <option.icon size={18} />
                                            <span className="sidebar__item-label">{option.label}</span>
                                            <span className="sidebar__item-count">{option.count}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dynamic Categories Section */}
                        <div className="sidebar__section">
                            <h3 className="sidebar__section-title">
                                <Tag size={16} />
                                Categories
                                <span className="sidebar__section-count">{categories.length}</span>
                            </h3>
                            <ul className="sidebar__list sidebar__list--categories">
                                {categories.map(category => {
                                    const IconComponent = getCategoryIcon(category.icon);
                                    const count = getCategoryCount(category.id);
                                    const isActive = activeFilter === `category:${category.id}`;

                                    return (
                                        <li key={category.id}>
                                            <button
                                                className={`sidebar__item sidebar__item--category ${isActive ? 'sidebar__item--active' : ''}`}
                                                onClick={() => handleFilterClick(`category:${category.id}`)}
                                            >
                                                <span
                                                    className="sidebar__item-icon"
                                                    style={{
                                                        backgroundColor: `${category.color}15`,
                                                        color: category.color
                                                    }}
                                                >
                                                    <IconComponent size={16} />
                                                </span>
                                                <span className="sidebar__item-label">{category.name}</span>
                                                <span
                                                    className="sidebar__item-count"
                                                    style={{
                                                        backgroundColor: isActive ? category.color : undefined,
                                                        color: isActive ? 'white' : undefined
                                                    }}
                                                >
                                                    {count}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}

                                {/* Empty state if no categories */}
                                {categories.length === 0 && (
                                    <li className="sidebar__empty">
                                        <Tag size={16} />
                                        <span>No categories yet</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;