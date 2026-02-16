// src/features/settings/components/CategoryManager.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Tag,
    RotateCcw,
    User,
    Briefcase,
    AlertCircle,
    Heart,
    Book,
    Home,
    Star,
    Flag,
    Folder,
    ShoppingCart,
    Music,
    Camera,
    Gift,
    Coffee
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { categoryService, CATEGORY_COLORS, CATEGORY_ICONS } from '../../../services/categoryService';
import './CategoryManager.css';

// Icon mapping
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

const CategoryManager = ({ onShowToast, onCategoriesChange }) => {
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        color: CATEGORY_COLORS[0],
        icon: 'tag'
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        const loadedCategories = categoryService.getCategories();
        setCategories(loadedCategories);
        onCategoriesChange?.(loadedCategories);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            color: CATEGORY_COLORS[0],
            icon: 'tag'
        });
        setFormErrors({});
    };

    const validateForm = (isEdit = false) => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Category name is required';
        } else if (formData.name.length > 30) {
            errors.name = 'Category name must be less than 30 characters';
        } else if (categoryService.categoryExists(formData.name, isEdit ? selectedCategory?.id : null)) {
            errors.name = 'Category with this name already exists';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCategory = () => {
        if (!validateForm()) return;

        try {
            const updatedCategories = categoryService.addCategory(formData);
            setCategories(updatedCategories);
            onCategoriesChange?.(updatedCategories);
            setIsAddModalOpen(false);
            resetForm();
            onShowToast?.('Category added successfully', 'success');
        } catch (error) {
            onShowToast?.(error.message, 'error');
        }
    };

    const handleEditCategory = () => {
        if (!validateForm(true)) return;

        try {
            const updatedCategories = categoryService.updateCategory(selectedCategory.id, formData);
            setCategories(updatedCategories);
            onCategoriesChange?.(updatedCategories);
            setIsEditModalOpen(false);
            setSelectedCategory(null);
            resetForm();
            onShowToast?.('Category updated successfully', 'success');
        } catch (error) {
            onShowToast?.(error.message, 'error');
        }
    };

    const handleDeleteCategory = () => {
        try {
            const updatedCategories = categoryService.deleteCategory(selectedCategory.id);
            setCategories(updatedCategories);
            onCategoriesChange?.(updatedCategories);
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
            onShowToast?.('Category deleted successfully', 'success');
        } catch (error) {
            onShowToast?.(error.message, 'error');
        }
    };

    const handleResetCategories = () => {
        const defaultCategories = categoryService.resetToDefaults();
        setCategories(defaultCategories);
        onCategoriesChange?.(defaultCategories);
        setIsResetModalOpen(false);
        onShowToast?.('Categories reset to defaults', 'success');
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            color: category.color,
            icon: category.icon
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const renderIcon = (iconName, size = 16) => {
        const IconComponent = iconComponents[iconName] || Tag;
        return <IconComponent size={size} />;
    };

    const renderCategoryForm = (isEdit = false) => (
        <div className="category-form">
            <div className="category-form__field">
                <label>Category Name</label>
                <Input
                    type="text"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={formErrors.name}
                />
                {formErrors.name && (
                    <span className="category-form__error">{formErrors.name}</span>
                )}
            </div>

            <div className="category-form__field">
                <label>Color</label>
                <div className="category-form__colors">
                    {CATEGORY_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className={`category-form__color-btn ${formData.color === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setFormData({ ...formData, color })}
                        >
                            {formData.color === color && <Check size={14} color="white" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="category-form__field">
                <label>Icon</label>
                <div className="category-form__icons">
                    {CATEGORY_ICONS.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            className={`category-form__icon-btn ${formData.icon === icon ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, icon })}
                        >
                            {renderIcon(icon, 18)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="category-form__preview">
                <label>Preview</label>
                <div
                    className="category-form__preview-tag"
                    style={{ backgroundColor: `${formData.color}20`, color: formData.color, borderColor: formData.color }}
                >
                    {renderIcon(formData.icon, 14)}
                    <span>{formData.name || 'Category Name'}</span>
                </div>
            </div>

            <div className="category-form__actions">
                <Button
                    variant="secondary"
                    onClick={() => {
                        isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false);
                        resetForm();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={isEdit ? handleEditCategory : handleAddCategory}
                    icon={isEdit ? <Check size={16} /> : <Plus size={16} />}
                >
                    {isEdit ? 'Save Changes' : 'Add Category'}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="category-manager">
            <div className="category-manager__header">
                <div className="category-manager__header-left">
                    <Tag size={20} />
                    <div>
                        <h3> Categories</h3>
                        <p>Manage your task categories</p>
                    </div>
                </div>
                <div className="category-manager__header-actions">
                    <Button
                        variant="secondary"
                        size="small"
                        icon={<RotateCcw size={14} />}
                        onClick={() => setIsResetModalOpen(true)}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="primary"
                        size="small"
                        icon={<Plus size={14} />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Category
                    </Button>
                </div>
            </div>

            <div className="category-manager__list">
                <AnimatePresence>
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            className="category-manager__item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="category-manager__item-left">
                                <div
                                    className="category-manager__item-icon"
                                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                >
                                    {renderIcon(category.icon, 18)}
                                </div>
                                <div className="category-manager__item-info">
                                    <span className="category-manager__item-name">{category.name}</span>
                                    {category.isDefault && (
                                        <span className="category-manager__item-badge">Default</span>
                                    )}
                                </div>
                            </div>
                            <div className="category-manager__item-actions">
                                <button
                                    className="category-manager__action-btn category-manager__action-btn--edit"
                                    onClick={() => openEditModal(category)}
                                    title="Edit category"
                                >
                                    <Edit2 size={16} />
                                </button>
                                {!category.isDefault && (
                                    <button
                                        className="category-manager__action-btn category-manager__action-btn--delete"
                                        onClick={() => openDeleteModal(category)}
                                        title="Delete category"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Category Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                }}
                title="Add New Category"
                size="medium"
            >
                {renderCategoryForm(false)}
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
                    resetForm();
                }}
                title="Edit Category"
                size="medium"
            >
                {renderCategoryForm(true)}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCategory(null);
                }}
                title="Delete Category"
                size="small"
            >
                <div className="category-delete-confirm">
                    <div className="category-delete-confirm__icon">
                        <AlertCircle size={48} color="var(--error)" />
                    </div>
                    <h3>Delete "{selectedCategory?.name}"?</h3>
                    <p>
                        This will remove the category. Tasks with this category will be moved to "Personal".
                    </p>
                    <div className="category-delete-confirm__actions">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setSelectedCategory(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteCategory}
                            icon={<Trash2 size={16} />}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Reset Confirmation Modal */}
            <Modal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                title="Reset Categories"
                size="small"
            >
                <div className="category-delete-confirm">
                    <div className="category-delete-confirm__icon">
                        <RotateCcw size={48} color="var(--warning)" />
                    </div>
                    <h3>Reset to Default Categories?</h3>
                    <p>
                        This will remove all custom categories and restore the default ones.
                    </p>
                    <div className="category-delete-confirm__actions">
                        <Button
                            variant="secondary"
                            onClick={() => setIsResetModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleResetCategories}
                            icon={<RotateCcw size={16} />}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CategoryManager;