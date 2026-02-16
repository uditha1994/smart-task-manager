// src/services/categoryService.js

const STORAGE_KEY = 'task-categories';

// Default categories that come with the app
const DEFAULT_CATEGORIES = [
    { id: 'personal', name: 'Personal', color: '#4CAF50', icon: 'user', isDefault: true },
    { id: 'work', name: 'Work', color: '#2196F3', icon: 'briefcase', isDefault: true },
    { id: 'urgent', name: 'Urgent', color: '#f44336', icon: 'alert-circle', isDefault: true },
    { id: 'health', name: 'Health', color: '#E91E63', icon: 'heart', isDefault: true },
    { id: 'learning', name: 'Learning', color: '#9C27B0', icon: 'book', isDefault: true }
];

// Predefined colors for category selection
export const CATEGORY_COLORS = [
    '#4CAF50', '#2196F3', '#f44336', '#E91E63', '#9C27B0',
    '#FF9800', '#00BCD4', '#795548', '#607D8B', '#3F51B5',
    '#FFEB3B', '#8BC34A', '#FF5722', '#673AB7', '#009688'
];

// Available icons for categories
export const CATEGORY_ICONS = [
    'user', 'briefcase', 'alert-circle', 'heart', 'book',
    'home', 'star', 'flag', 'folder', 'tag',
    'shopping-cart', 'music', 'camera', 'gift', 'coffee'
];

export const categoryService = {
    // Get all categories
    getCategories: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with default categories
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
    },

    // Save categories to localStorage
    saveCategories: (categories) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    },

    // Add a new category
    addCategory: (category) => {
        const categories = categoryService.getCategories();
        const newCategory = {
            ...category,
            id: category.id || `category-${Date.now()}`,
            isDefault: false
        };
        const updatedCategories = [...categories, newCategory];
        categoryService.saveCategories(updatedCategories);
        return updatedCategories;
    },

    // Update an existing category
    updateCategory: (categoryId, updates) => {
        const categories = categoryService.getCategories();
        const updatedCategories = categories.map(cat =>
            cat.id === categoryId ? { ...cat, ...updates } : cat
        );
        categoryService.saveCategories(updatedCategories);
        return updatedCategories;
    },

    // Delete a category
    deleteCategory: (categoryId) => {
        const categories = categoryService.getCategories();
        const category = categories.find(cat => cat.id === categoryId);

        if (category?.isDefault) {
            throw new Error('Cannot delete default categories');
        }

        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        categoryService.saveCategories(updatedCategories);
        return updatedCategories;
    },

    // Get a single category by ID
    getCategoryById: (categoryId) => {
        const categories = categoryService.getCategories();
        return categories.find(cat => cat.id === categoryId);
    },

    // Reset to default categories
    resetToDefaults: () => {
        categoryService.saveCategories(DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
    },

    // Check if category name already exists
    categoryExists: (name, excludeId = null) => {
        const categories = categoryService.getCategories();
        return categories.some(
            cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
        );
    }
};