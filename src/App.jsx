import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X, Plus, BarChart3, Home } from 'lucide-react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import TaskList from './features/tasks/components/TaskList';
import TaskForm from './features/tasks/components/TaskForm';
import TimeTracker from './features/tasks/components/TimeTracker';
import AdvancedFilters from './features/tasks/components/AdvancedFilters';
import AnalyticsDashboard from './features/analytics/components/AnalyticsDashboard';
import SmartSuggestions from './features/suggestions/components/SmartSuggestions';
import SettingsPanel from './features/settings/components/SettingsPanel';
import Button from './components/ui/Button';
import ToastContainer from './components/ui/ToastContainer';
import { useTasks } from './hooks/useTasks';
import { useToast } from './hooks/useToast';
import { TaskStatus, TaskCategory } from './types';
import './styles/globals.css';
import './App.css';

function App() {
    const {
        tasks,
        loading,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion
    } = useTasks();

    const { toasts, showToast, removeToast } = useToast();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [timeTrackerOpen, setTimeTrackerOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [trackingTask, setTrackingTask] = useState(null);
    const [activeView, setActiveView] = useState('tasks');
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        categories: [],
        priorities: [],
        status: [],
        dateRange: { start: '', end: '' },
        tags: [],
        hasDescription: null,
        isOverdue: null
    });

    // Filter and sort tasks with advanced filters
    const filteredTasks = useMemo(() => {
        let filtered = tasks;

        // Apply basic filter
        switch (activeFilter) {
            case 'pending':
                filtered = filtered.filter(task => task.status === TaskStatus.PENDING);
                break;
            case 'completed':
                filtered = filtered.filter(task => task.status === TaskStatus.COMPLETED);
                break;
            case 'urgent':
                filtered = filtered.filter(task => task.category === TaskCategory.URGENT);
                break;
            case 'overdue':
                filtered = filtered.filter(task =>
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== TaskStatus.COMPLETED
                );
                break;
            case 'due-today':
                const today = new Date().toISOString().split('T')[0];
                filtered = filtered.filter(task =>
                    task.dueDate &&
                    task.dueDate.split('T')[0] === today &&
                    task.status !== TaskStatus.COMPLETED
                );
                break;
            case 'high-priority':
                filtered = filtered.filter(task => task.priority === 'high');
                break;
            default:
                if (Object.values(TaskCategory).includes(activeFilter)) {
                    filtered = filtered.filter(task => task.category === activeFilter);
                }
                break;
        }

        // Apply advanced filters
        if (advancedFilters.categories.length > 0) {
            filtered = filtered.filter(task => advancedFilters.categories.includes(task.category));
        }

        if (advancedFilters.priorities.length > 0) {
            filtered = filtered.filter(task => advancedFilters.priorities.includes(task.priority));
        }

        if (advancedFilters.status.length > 0) {
            filtered = filtered.filter(task => advancedFilters.status.includes(task.status));
        }

        if (advancedFilters.dateRange.start || advancedFilters.dateRange.end) {
            filtered = filtered.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                const start = advancedFilters.dateRange.start ? new Date(advancedFilters.dateRange.start) : null;
                const end = advancedFilters.dateRange.end ? new Date(advancedFilters.dateRange.end) : null;

                if (start && dueDate < start) return false;
                if (end && dueDate > end) return false;
                return true;
            });
        }

        if (advancedFilters.hasDescription === true) {
            filtered = filtered.filter(task => task.description && task.description.trim());
        }

        if (advancedFilters.isOverdue === true) {
            filtered = filtered.filter(task =>
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== TaskStatus.COMPLETED
            );
        }

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    }, [tasks, activeFilter, searchTerm, sortBy, advancedFilters]);

    // Calculate task counts
    const taskCounts = useMemo(() => {
        const counts = {
            total: tasks.length,
            pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
            completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
            urgent: tasks.filter(t => t.category === TaskCategory.URGENT).length,
            categories: {}
        };

        Object.values(TaskCategory).forEach(category => {
            counts.categories[category] = tasks.filter(t => t.category === category).length;
        });

        return counts;
    }, [tasks]);

    const handleAddTask = () => {
        setEditingTask(null);
        setTaskFormOpen(true);
        setSidebarOpen(false);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setTaskFormOpen(true);
    };

    const handleTaskSubmit = async (taskData) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.id, taskData);
                showToast('Task updated successfully', 'success');
            } else {
                await createTask(taskData);
                showToast('Task created successfully', 'success');
            }
            setTaskFormOpen(false);
            setEditingTask(null);
        } catch (error) {
            showToast('Failed to save task', 'error');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                showToast('Task deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete task', 'error');
            }
        }
    };

    const handleTimeTrack = (task) => {
        setTrackingTask(task);
        setTimeTrackerOpen(true);
    };

    const handleTimeTrackerSave = async (taskId, timeData) => {
        try {
            await updateTask(taskId, timeData);
            showToast('Time tracking saved', 'success');
        } catch (error) {
            showToast('Failed to save time tracking', 'error');
        }
    };

    const handleTasksImport = async (importedTasks) => {
        try {
            for (const taskData of importedTasks) {
                await createTask(taskData);
            }
            showToast(`Successfully imported ${importedTasks.length} tasks`, 'success');
        } catch (error) {
            showToast('Failed to import tasks', 'error');
        }
    };

    const clearAdvancedFilters = () => {
        setAdvancedFilters({
            categories: [],
            priorities: [],
            status: [],
            dateRange: { start: '', end: '' },
            tags: [],
            hasDescription: null,
            isOverdue: null
        });
    };

    return (
        <div className="app">
            <Header
                onSettingsClick={() => setSettingsOpen(true)}
                onAnalyticsClick={() => setActiveView(activeView === 'analytics' ? 'tasks' : 'analytics')}
                activeView={activeView}
            />

            <div className="app__container">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onAddTask={handleAddTask}
                    onFilterChange={setActiveFilter}
                    activeFilter={activeFilter}
                    taskCounts={taskCounts}
                />

                <main className="app__main">
                    <div className="app__mobile-header">
                        <Button
                            variant="ghost"
                            size="small"
                            icon={sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="app__mobile-menu"
                        />
                        <h1 className="app__mobile-title">
                            {activeView === 'analytics' ? 'Analytics Dashboard' : 'Task Manager'}
                        </h1>

                        {/* Add analytics toggle for mobile */}
                        <Button
                            variant="ghost"
                            size="small"
                            icon={activeView === 'analytics' ? <Home size={18} /> : <BarChart3 size={18} />}
                            onClick={() => setActiveView(activeView === 'analytics' ? 'tasks' : 'analytics')}
                            className="hide-desktop"
                        />
                    </div>

                    <div className="app__content custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeView === 'analytics' ? (
                                <AnalyticsDashboard key="analytics" tasks={tasks} />
                            ) : (
                                <div key="tasks" className="app__tasks-view">
                                    <SmartSuggestions
                                        tasks={tasks}
                                        onTaskUpdate={updateTask}
                                        onDismiss={(suggestionId) => {
                                            console.log('Dismissed suggestion:', suggestionId);
                                        }}
                                    />

                                    <div className="app__tasks-header">
                                        <AdvancedFilters
                                            filters={advancedFilters}
                                            onFiltersChange={setAdvancedFilters}
                                            onClear={clearAdvancedFilters}
                                            isOpen={advancedFiltersOpen}
                                            onToggle={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                                        />
                                    </div>

                                    <TaskList
                                        tasks={filteredTasks}
                                        loading={loading}
                                        searchTerm={searchTerm}
                                        onSearchChange={setSearchTerm}
                                        sortBy={sortBy}
                                        onSortChange={setSortBy}
                                        onTaskToggle={toggleTaskCompletion}
                                        onTaskEdit={handleEditTask}
                                        onTaskDelete={handleDeleteTask}
                                        onTimeTrack={handleTimeTrack}
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Modals and Overlays */}
            <AnimatePresence>
                {taskFormOpen && (
                    <TaskForm
                        task={editingTask}
                        isOpen={taskFormOpen}
                        onClose={() => {
                            setTaskFormOpen(false);
                            setEditingTask(null);
                        }}
                        onSubmit={handleTaskSubmit}
                    />
                )}

                {timeTrackerOpen && (
                    <TimeTracker
                        task={trackingTask}
                        isOpen={timeTrackerOpen}
                        onClose={() => {
                            setTimeTrackerOpen(false);
                            setTrackingTask(null);
                        }}
                        onSave={handleTimeTrackerSave}
                    />
                )}

                {settingsOpen && (
                    <SettingsPanel
                        isOpen={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        tasks={tasks}
                        onTasksImport={handleTasksImport}
                        onShowToast={showToast}
                    />
                )}
            </AnimatePresence>

            {/* Floating Action Button for Mobile */}
            <Button
                className="app__fab"
                variant="primary"
                size="large"
                icon={<Plus size={24} />}
                onClick={handleAddTask}
            />

            {/* Toast Notifications */}
            <ToastContainer
                toasts={toasts}
                onRemoveToast={removeToast}
            />
        </div>
    );
}

export default App;