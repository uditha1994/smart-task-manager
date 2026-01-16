import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lightbulb,
    Clock,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Target,
    X
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { TaskStatus, TaskPriority } from '../../../types';
import { format, isAfter, isBefore, addDays, startOfDay } from 'date-fns';
import './SmartSuggestions.css';

const SmartSuggestions = ({ tasks, onTaskUpdate, onDismiss }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [dismissedSuggestions, setDismissedSuggestions] = useState(new Set());

    useEffect(() => {
        generateSuggestions();
    }, [tasks]);

    const generateSuggestions = () => {
        const newSuggestions = [];
        const now = new Date();
        const today = startOfDay(now);
        const tomorrow = addDays(today, 1);
        const nextWeek = addDays(today, 7);

        // Overdue tasks suggestion
        const overdueTasks = tasks.filter(task =>
            task.dueDate &&
            isBefore(new Date(task.dueDate), today) &&
            task.status !== TaskStatus.COMPLETED
        );

        if (overdueTasks.length > 0) {
            newSuggestions.push({
                id: 'overdue-tasks',
                type: 'warning',
                icon: AlertTriangle,
                title: 'Overdue Tasks Need Attention',
                description: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider rescheduling or completing them.`,
                action: 'View Overdue',
                actionData: { filter: 'overdue' },
                priority: 1
            });
        }

        // Due today suggestion
        const dueTodayTasks = tasks.filter(task =>
            task.dueDate &&
            format(new Date(task.dueDate), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') &&
            task.status !== TaskStatus.COMPLETED
        );

        if (dueTodayTasks.length > 0) {
            newSuggestions.push({
                id: 'due-today',
                type: 'info',
                icon: Calendar,
                title: 'Tasks Due Today',
                description: `${dueTodayTasks.length} task${dueTodayTasks.length > 1 ? 's are' : ' is'} due today. Focus on completing them first.`,
                action: 'View Today\'s Tasks',
                actionData: { filter: 'due-today' },
                priority: 2
            });
        }

        // High priority pending tasks
        const highPriorityPending = tasks.filter(task =>
            task.priority === TaskPriority.HIGH &&
            task.status === TaskStatus.PENDING
        );

        if (highPriorityPending.length > 0) {
            newSuggestions.push({
                id: 'high-priority',
                type: 'warning',
                icon: Target,
                title: 'High Priority Tasks Waiting',
                description: `You have ${highPriorityPending.length} high-priority task${highPriorityPending.length > 1 ? 's' : ''} that need attention.`,
                action: 'View High Priority',
                actionData: { filter: 'high-priority' },
                priority: 3
            });
        }

        // Productivity insights
        const completedThisWeek = tasks.filter(task => {
            if (!task.completedAt) return false;
            const completedDate = new Date(task.completedAt);
            const weekAgo = addDays(today, -7);
            return isAfter(completedDate, weekAgo);
        });

        const completionRate = tasks.length > 0 ? (completedThisWeek.length / tasks.length) * 100 : 0;

        if (completionRate > 70) {
            newSuggestions.push({
                id: 'productivity-high',
                type: 'success',
                icon: TrendingUp,
                title: 'Great Productivity!',
                description: `You've completed ${completedThisWeek.length} tasks this week. You're on fire! 🔥`,
                action: 'View Analytics',
                actionData: { view: 'analytics' },
                priority: 4
            });
        } else if (completionRate < 30 && tasks.length > 5) {
            newSuggestions.push({
                id: 'productivity-low',
                type: 'info',
                icon: Lightbulb,
                title: 'Boost Your Productivity',
                description: 'Consider breaking down large tasks into smaller, manageable chunks.',
                action: 'View Tips',
                actionData: { view: 'tips' },
                priority: 4
            });
        }

        // Tasks without due dates
        const tasksWithoutDueDate = tasks.filter(task =>
            !task.dueDate &&
            task.status === TaskStatus.PENDING
        );

        if (tasksWithoutDueDate.length > 3) {
            newSuggestions.push({
                id: 'no-due-dates',
                type: 'info',
                icon: Clock,
                title: 'Add Due Dates',
                description: `${tasksWithoutDueDate.length} tasks don't have due dates. Adding deadlines can improve focus.`,
                action: 'Add Due Dates',
                actionData: { action: 'add-due-dates', tasks: tasksWithoutDueDate },
                priority: 5
            });
        }

        // Optimal time suggestions based on completion patterns
        const optimalTimeSuggestion = getOptimalTimeSuggestion(tasks);
        if (optimalTimeSuggestion) {
            newSuggestions.push(optimalTimeSuggestion);
        }

        // Filter out dismissed suggestions and sort by priority
        const filteredSuggestions = newSuggestions
            .filter(suggestion => !dismissedSuggestions.has(suggestion.id))
            .sort((a, b) => a.priority - b.priority)
            .slice(0, 3); // Show max 3 suggestions

        setSuggestions(filteredSuggestions);
    };

    const getOptimalTimeSuggestion = (tasks) => {
        const completedTasks = tasks.filter(task => task.completedAt);
        if (completedTasks.length < 5) return null;

        // Analyze completion times
        const completionHours = completedTasks.map(task => {
            const hour = new Date(task.completedAt).getHours();
            return hour;
        });

        // Find most productive hour
        const hourCounts = {};
        completionHours.forEach(hour => {
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const mostProductiveHour = Object.entries(hourCounts)
            .sort(([, a], [, b]) => b - a)[0];

        if (mostProductiveHour && mostProductiveHour[1] >= 3) {
            const hour = parseInt(mostProductiveHour[0]);
            const timeString = hour < 12 ? `${hour}:00 AM` : `${hour - 12 || 12}:00 PM`;

            return {
                id: 'optimal-time',
                type: 'info',
                icon: Clock,
                title: 'Optimal Work Time',
                description: `You're most productive around ${timeString}. Consider scheduling important tasks during this time.`,
                action: 'Schedule Tasks',
                actionData: { optimalHour: hour },
                priority: 6
            };
        }

        return null;
    };

    const handleSuggestionAction = (suggestion) => {
        const { actionData } = suggestion;

        switch (actionData.action) {
            case 'add-due-dates':
                // Add due dates to tasks without them
                const tomorrow = addDays(new Date(), 1).toISOString();
                actionData.tasks.forEach(task => {
                    onTaskUpdate(task.id, { dueDate: tomorrow });
                });
                break;
            default:
                // Handle other actions (filtering, navigation, etc.)
                console.log('Suggestion action:', actionData);
                break;
        }
    };

    const dismissSuggestion = (suggestionId) => {
        setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
        onDismiss?.(suggestionId);
    };

    const getSuggestionColor = (type) => {
        switch (type) {
            case 'success': return 'var(--success)';
            case 'warning': return 'var(--warning)';
            case 'error': return 'var(--error)';
            default: return 'var(--accent-primary)';
        }
    };

    if (suggestions.length === 0) return null;

    return (
        <div className="smart-suggestions">
            <div className="smart-suggestions__header">
                <div className="smart-suggestions__title">
                    <Lightbulb size={20} />
                    <h3>Smart Suggestions</h3>
                </div>
            </div>

            <div className="smart-suggestions__list">
                <AnimatePresence>
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="smart-suggestion" hover padding="medium">
                                <div className="smart-suggestion__content">
                                    <div className="smart-suggestion__header">
                                        <div
                                            className="smart-suggestion__icon"
                                            style={{
                                                backgroundColor: `${getSuggestionColor(suggestion.type)}20`,
                                                color: getSuggestionColor(suggestion.type)
                                            }}
                                        >
                                            <suggestion.icon size={18} />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="small"
                                            icon={<X size={14} />}
                                            onClick={() => dismissSuggestion(suggestion.id)}
                                            className="smart-suggestion__dismiss"
                                        />
                                    </div>

                                    <div className="smart-suggestion__body">
                                        <h4 className="smart-suggestion__title">
                                            {suggestion.title}
                                        </h4>
                                        <p className="smart-suggestion__description">
                                            {suggestion.description}
                                        </p>
                                    </div>

                                    {suggestion.action && (
                                        <div className="smart-suggestion__actions">
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => handleSuggestionAction(suggestion)}
                                            >
                                                {suggestion.action}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SmartSuggestions;