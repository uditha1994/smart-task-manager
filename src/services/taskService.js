import { TaskStatus, TaskCategory } from '../types';

class TaskService {
    constructor() {
        this.storageKey = 'smart-tasks';
        this.analyticsKey = 'task-analytics';
    }

    // Get all tasks
    getTasks() {
        try {
            const tasks = localStorage.getItem(this.storageKey);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    // Save tasks
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            this.updateAnalytics(tasks);
            return true;
        } catch (error) {
            console.error('Error saving tasks:', error);
            return false;
        }
    }

    // Create new task
    createTask(taskData) {
        const newTask = {
            id: this.generateId(),
            title: taskData.title,
            description: taskData.description || '',
            category: taskData.category || TaskCategory.PERSONAL,
            priority: taskData.priority || 'medium',
            status: TaskStatus.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dueDate: taskData.dueDate || null,
            estimatedTime: taskData.estimatedTime || 0,
            actualTime: 0,
            tags: taskData.tags || []
        };

        const tasks = this.getTasks();
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    }

    // Update task
    updateTask(taskId, updates) {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) return null;

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveTasks(tasks);
        return tasks[taskIndex];
    }

    // Delete task
    deleteTask(taskId) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        this.saveTasks(filteredTasks);
        return true;
    }

    // Toggle task completion
    toggleTaskCompletion(taskId) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (!task) return null;

        const newStatus = task.status === TaskStatus.COMPLETED
            ? TaskStatus.PENDING
            : TaskStatus.COMPLETED;

        return this.updateTask(taskId, {
            status: newStatus,
            completedAt: newStatus === TaskStatus.COMPLETED ? new Date().toISOString() : null
        });
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Update analytics data
    updateAnalytics(tasks) {
        const analytics = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
            pendingTasks: tasks.filter(t => t.status === TaskStatus.PENDING).length,
            categoryDistribution: this.getCategoryDistribution(tasks),
            completionTrends: this.getCompletionTrends(tasks),
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
    }

    // Get analytics data
    getAnalytics() {
        try {
            const analytics = localStorage.getItem(this.analyticsKey);
            return analytics ? JSON.parse(analytics) : null;
        } catch (error) {
            console.error('Error loading analytics:', error);
            return null;
        }
    }

    // Get category distribution
    getCategoryDistribution(tasks) {
        const distribution = {};
        tasks.forEach(task => {
            distribution[task.category] = (distribution[task.category] || 0) + 1;
        });
        return distribution;
    }

    // Get completion trends (last 7 days)
    getCompletionTrends(tasks) {
        const trends = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const completedOnDate = tasks.filter(task =>
                task.completedAt &&
                task.completedAt.split('T')[0] === dateStr
            ).length;

            trends.push({
                date: dateStr,
                completed: completedOnDate
            });
        }

        return trends;
    }
}

export const taskService = new TaskService();