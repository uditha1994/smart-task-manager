import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    Calendar,
    Flag,
    Tag,
    Clock,
    X,
    ChevronDown
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import { TaskCategory, TaskPriority, TaskStatus } from '../../../types';
import './AdvancedFilters.css';

const AdvancedFilters = ({
    filters,
    onFiltersChange,
    onClear,
    isOpen,
    onToggle
}) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleDateRangeChange = (type, value) => {
        const newFilters = {
            ...localFilters,
            dateRange: {
                ...localFilters.dateRange,
                [type]: value
            }
        };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearAllFilters = () => {
        const emptyFilters = {
            categories: [],
            priorities: [],
            status: [],
            dateRange: { start: '', end: '' },
            tags: [],
            hasDescription: null,
            isOverdue: null
        };
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
        onClear();
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (localFilters.categories?.length > 0) count++;
        if (localFilters.priorities?.length > 0) count++;
        if (localFilters.status?.length > 0) count++;
        if (localFilters.dateRange?.start || localFilters.dateRange?.end) count++;
        if (localFilters.tags?.length > 0) count++;
        if (localFilters.hasDescription !== null) count++;
        if (localFilters.isOverdue !== null) count++;
        return count;
    };

    return (
        <div className="advanced-filters">
            <Button
                variant="secondary"
                size="small"
                icon={<Filter size={16} />}
                onClick={onToggle}
                className={`advanced-filters__toggle ${isOpen ? 'advanced-filters__toggle--active' : ''}`}
            >
                Advanced Filters
                {getActiveFilterCount() > 0 && (
                    <span className="advanced-filters__badge">
                        {getActiveFilterCount()}
                    </span>
                )}
                <ChevronDown
                    size={16}
                    className={`advanced-filters__chevron ${isOpen ? 'advanced-filters__chevron--open' : ''}`}
                />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="advanced-filters__panel"
                    >
                        <Card padding="large" className="advanced-filters__content">
                            <div className="advanced-filters__header">
                                <h3 className="advanced-filters__title">Filter Tasks</h3>
                                <Button
                                    variant="ghost"
                                    size="small"
                                    onClick={clearAllFilters}
                                    disabled={getActiveFilterCount() === 0}
                                >
                                    Clear All
                                </Button>
                            </div>

                            <div className="advanced-filters__grid">
                                {/* Categories */}
                                <div className="advanced-filters__group">
                                    <label className="advanced-filters__label">
                                        <Tag size={16} />
                                        Categories
                                    </label>
                                    <div className="advanced-filters__checkboxes">
                                        {Object.values(TaskCategory).map(category => (
                                            <label key={category} className="advanced-filters__checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={localFilters.categories?.includes(category) || false}
                                                    onChange={(e) => {
                                                        const categories = localFilters.categories || [];
                                                        const newCategories = e.target.checked
                                                            ? [...categories, category]
                                                            : categories.filter(c => c !== category);
                                                        handleFilterChange('categories', newCategories);
                                                    }}
                                                />
                                                <span className="advanced-filters__checkbox-label">
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Priorities */}
                                <div className="advanced-filters__group">
                                    <label className="advanced-filters__label">
                                        <Flag size={16} />
                                        Priorities
                                    </label>
                                    <div className="advanced-filters__checkboxes">
                                        {Object.values(TaskPriority).map(priority => (
                                            <label key={priority} className="advanced-filters__checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={localFilters.priorities?.includes(priority) || false}
                                                    onChange={(e) => {
                                                        const priorities = localFilters.priorities || [];
                                                        const newPriorities = e.target.checked
                                                            ? [...priorities, priority]
                                                            : priorities.filter(p => p !== priority);
                                                        handleFilterChange('priorities', newPriorities);
                                                    }}
                                                />
                                                <span className="advanced-filters__checkbox-label">
                                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="advanced-filters__group">
                                    <label className="advanced-filters__label">
                                        <Clock size={16} />
                                        Status
                                    </label>
                                    <div className="advanced-filters__checkboxes">
                                        {Object.values(TaskStatus).map(status => (
                                            <label key={status} className="advanced-filters__checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={localFilters.status?.includes(status) || false}
                                                    onChange={(e) => {
                                                        const statuses = localFilters.status || [];
                                                        const newStatuses = e.target.checked
                                                            ? [...statuses, status]
                                                            : statuses.filter(s => s !== status);
                                                        handleFilterChange('status', newStatuses);
                                                    }}
                                                />
                                                <span className="advanced-filters__checkbox-label">
                                                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div className="advanced-filters__group">
                                    <label className="advanced-filters__label">
                                        <Calendar size={16} />
                                        Due Date Range
                                    </label>
                                    <div className="advanced-filters__date-range">
                                        <Input
                                            type="date"
                                            placeholder="Start date"
                                            value={localFilters.dateRange?.start || ''}
                                            onChange={(e) => handleDateRangeChange('start', e.target.value)}
                                        />
                                        <Input
                                            type="date"
                                            placeholder="End date"
                                            value={localFilters.dateRange?.end || ''}
                                            onChange={(e) => handleDateRangeChange('end', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="advanced-filters__group">
                                    <label className="advanced-filters__label">Quick Filters</label>
                                    <div className="advanced-filters__quick-filters">
                                        <label className="advanced-filters__checkbox">
                                            <input
                                                type="checkbox"
                                                checked={localFilters.isOverdue === true}
                                                onChange={(e) => handleFilterChange('isOverdue', e.target.checked ? true : null)}
                                            />
                                            <span className="advanced-filters__checkbox-label">Overdue Tasks</span>
                                        </label>
                                        <label className="advanced-filters__checkbox">
                                            <input
                                                type="checkbox"
                                                checked={localFilters.hasDescription === true}
                                                onChange={(e) => handleFilterChange('hasDescription', e.target.checked ? true : null)}
                                            />
                                            <span className="advanced-filters__checkbox-label">Has Description</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdvancedFilters;