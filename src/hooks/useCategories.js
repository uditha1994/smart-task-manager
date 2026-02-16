// src/hooks/useCategories.js

import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCategories = useCallback(() => {
        try {
            setLoading(true);
            const loadedCategories = categoryService.getCategories();
            setCategories(loadedCategories);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const addCategory = useCallback((category) => {
        try {
            const updatedCategories = categoryService.addCategory(category);
            setCategories(updatedCategories);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, []);

    const updateCategory = useCallback((categoryId, updates) => {
        try {
            const updatedCategories = categoryService.updateCategory(categoryId, updates);
            setCategories(updatedCategories);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, []);

    const deleteCategory = useCallback((categoryId) => {
        try {
            const updatedCategories = categoryService.deleteCategory(categoryId);
            setCategories(updatedCategories);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, []);

    const getCategoryById = useCallback((categoryId) => {
        return categories.find(cat => cat.id === categoryId);
    }, [categories]);

    const getCategoryColor = useCallback((categoryId) => {
        const category = getCategoryById(categoryId);
        return category?.color || '#6B7280';
    }, [getCategoryById]);

    const getCategoryName = useCallback((categoryId) => {
        const category = getCategoryById(categoryId);
        return category?.name || 'Unknown';
    }, [getCategoryById]);

    const resetCategories = useCallback(() => {
        const defaultCategories = categoryService.resetToDefaults();
        setCategories(defaultCategories);
    }, []);

    return {
        categories,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getCategoryColor,
        getCategoryName,
        resetCategories,
        refreshCategories: loadCategories
    };
};