import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load tasks on mount
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const loadedTasks = taskService.getTasks();
            setTasks(loadedTasks);
            setError(null);
        } catch (err) {
            setError('Failed to load tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = useCallback(async (taskData) => {
        try {
            const newTask = taskService.createTask(taskData);
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (err) {
            setError('Failed to create task');
            throw err;
        }
    }, []);

    const updateTask = useCallback(async (taskId, updates) => {
        try {
            const updatedTask = taskService.updateTask(taskId, updates);
            if (updatedTask) {
                setTasks(prev => prev.map(task =>
                    task.id === taskId ? updatedTask : task
                ));
            }
            return updatedTask;
        } catch (err) {
            setError('Failed to update task');
            throw err;
        }
    }, []);

    const deleteTask = useCallback(async (taskId) => {
        try {
            taskService.deleteTask(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } catch (err) {
            setError('Failed to delete task');
            throw err;
        }
    }, []);

    const toggleTaskCompletion = useCallback(async (taskId) => {
        try {
            const updatedTask = taskService.toggleTaskCompletion(taskId);
            if (updatedTask) {
                setTasks(prev => prev.map(task =>
                    task.id === taskId ? updatedTask : task
                ));
            }
            return updatedTask;
        } catch (err) {
            setError('Failed to toggle task');
            throw err;
        }
    }, []);

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        refreshTasks: loadTasks
    };
};