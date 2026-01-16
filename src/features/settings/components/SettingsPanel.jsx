import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Download,
    Upload,
    Trash2,
    Bell,
    Moon,
    Sun,
    Database,
    FileText,
    AlertCircle
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import { useTheme } from '../../../hooks/useTheme';
import { exportService } from '../../../services/exportService';
import { taskService } from '../../../services/taskService';
import './SettingsPanel.css';

const SettingsPanel = ({
    isOpen,
    onClose,
    tasks,
    onTasksImport,
    onShowToast
}) => {
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        notifications: true,
        autoSave: true,
        defaultCategory: 'personal',
        defaultPriority: 'medium',
        workingHours: { start: '09:00', end: '17:00' },
        reminderTime: 30 // minutes before due date
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [importFile, setImportFile] = useState(null);

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('app-settings');
        if (savedSettings) {
            setSettings({ ...settings, ...JSON.parse(savedSettings) });
        }
    }, []);

    const saveSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('app-settings', JSON.stringify(newSettings));
        onShowToast?.('Settings saved successfully', 'success');
    };

    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
    };

    const handleWorkingHoursChange = (type, value) => {
        const newSettings = {
            ...settings,
            workingHours: { ...settings.workingHours, [type]: value }
        };
        saveSettings(newSettings);
    };

    const handleExportJSON = () => {
        exportService.exportAsJSON(tasks);
        onShowToast?.('Tasks exported as JSON', 'success');
    };

    const handleExportCSV = () => {
        exportService.exportAsCSV(tasks);
        onShowToast?.('Tasks exported as CSV', 'success');
    };

    const handleImport = async () => {
        if (!importFile) return;

        try {
            let importedTasks = [];

            if (importFile.type === 'application/json') {
                importedTasks = await exportService.importFromJSON(importFile);
            } else if (importFile.type === 'text/csv') {
                importedTasks = await exportService.importFromCSV(importFile);
            } else {
                throw new Error('Unsupported file type');
            }

            onTasksImport?.(importedTasks);
            onShowToast?.(`Imported ${importedTasks.length} tasks successfully`, 'success');
            setImportFile(null);
        } catch (error) {
            onShowToast?.(error.message, 'error');
        }
    };

    const handleDeleteAllData = () => {
        localStorage.clear();
        window.location.reload();
    };

    const getStorageUsage = () => {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return (total / 1024).toFixed(2); // KB
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            size="large"
        >
            <div className="settings-panel">
                <div className="settings-panel__sections">
                    {/* General Settings */}
                    <Card className="settings-section" padding="large">
                        <h3 className="settings-section__title">
                            <Settings size={20} />
                            General
                        </h3>

                        <div className="settings-section__content">
                            <div className="settings-item">
                                <div className="settings-item__info">
                                    <label className="settings-item__label">Theme</label>
                                    <p className="settings-item__description">
                                        Choose your preferred color scheme
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    icon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                                    onClick={toggleTheme}
                                >
                                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                </Button>
                            </div>

                            <div className="settings-item">
                                <div className="settings-item__info">
                                    <label className="settings-item__label">Notifications</label>
                                    <p className="settings-item__description">
                                        Receive notifications for due tasks
                                    </p>
                                </div>
                                <label className="settings-toggle">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications}
                                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                    />
                                    <span className="settings-toggle__slider"></span>
                                </label>
                            </div>

                            <div className="settings-item">
                                <div className="settings-item__info">
                                    <label className="settings-item__label">Auto Save</label>
                                    <p className="settings-item__description">
                                        Automatically save changes
                                    </p>
                                </div>
                                <label className="settings-toggle">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoSave}
                                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                                    />
                                    <span className="settings-toggle__slider"></span>
                                </label>
                            </div>
                        </div>
                    </Card>

                    {/* Default Values */}
                    <Card className="settings-section" padding="large">
                        <h3 className="settings-section__title">
                            <FileText size={20} />
                            Default Values
                        </h3>

                        <div className="settings-section__content">
                            <div className="settings-item">
                                <div className="settings-item__info">
                                    <label className="settings-item__label">Default Category</label>
                                    <p className="settings-item__description">
                                        Default category for new tasks
                                    </p>
                                </div>
                                <select
                                    className="settings-select"
                                    value={settings.defaultCategory}
                                    onChange={(e) => handleSettingChange('defaultCategory', e.target.value)}
                                >
                                    <option value="personal">Personal</option>
                                    <option value="work">Work</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="health">Health</option>
                                    <option value="learning">Learning</option>
                                </select>
                            </div>

                            <div className="settings-item">
                                <div className="settings-item__info">
                                    <label className="settings-item__label">Default Priority</label>
                                    <p className="settings-item__description">
                                        Default priority for new tasks
                                    </p>
                                </div>
                                <select
                                    className="settings-select"
                                    value={settings.defaultPriority}
                                    onChange={(e) => handleSettingChange('defaultPriority', e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="settings-item">
                                <div className="settings-item__info">
                                    <label className="settings-item__label">Reminder Time</label>
                                    <p className="settings-item__description">
                                        Minutes before due date to show reminder
                                    </p>
                                </div>
                                <Input
                                    type="number"
                                    min="0"
                                    max="1440"
                                    value={settings.reminderTime}
                                    onChange={(e) => handleSettingChange('reminderTime', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Working Hours */}
                    <Card className="settings-section" padding="large">
                        <h3 className="settings-section__title">
                            <Bell size={20} />
                            Working Hours
                        </h3>

                        <div className="settings-section__content">
                            <div className="settings-working-hours">
                                <div className="settings-item">
                                    <label className="settings-item__label">Start Time</label>
                                    <Input
                                        type="time"
                                        value={settings.workingHours.start}
                                        onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                                    />
                                </div>
                                <div className="settings-item">
                                    <label className="settings-item__label">End Time</label>
                                    <Input
                                        type="time"
                                        value={settings.workingHours.end}
                                        onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Data Management */}
                    <Card className="settings-section" padding="large">
                        <h3 className="settings-section__title">
                            <Database size={20} />
                            Data Management
                        </h3>

                        <div className="settings-section__content">
                            <div className="settings-data-stats">
                                <div className="settings-stat">
                                    <span className="settings-stat__label">Total Tasks:</span>
                                    <span className="settings-stat__value">{tasks.length}</span>
                                </div>
                                <div className="settings-stat">
                                    <span className="settings-stat__label">Storage Used:</span>
                                    <span className="settings-stat__value">{getStorageUsage()} KB</span>
                                </div>
                            </div>

                            <div className="settings-actions">
                                <div className="settings-action-group">
                                    <h4>Export Data</h4>
                                    <div className="settings-buttons">
                                        <Button
                                            variant="secondary"
                                            icon={<Download size={16} />}
                                            onClick={handleExportJSON}
                                        >
                                            Export as JSON
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            icon={<Download size={16} />}
                                            onClick={handleExportCSV}
                                        >
                                            Export as CSV
                                        </Button>
                                    </div>
                                </div>

                                <div className="settings-action-group">
                                    <h4>Import Data</h4>
                                    <div className="settings-import">
                                        <Input
                                            type="file"
                                            accept=".json,.csv"
                                            onChange={(e) => setImportFile(e.target.files[0])}
                                        />
                                        <Button
                                            variant="primary"
                                            icon={<Upload size={16} />}
                                            onClick={handleImport}
                                            disabled={!importFile}
                                        >
                                            Import
                                        </Button>
                                    </div>
                                </div>

                                <div className="settings-action-group settings-action-group--danger">
                                    <h4>Danger Zone</h4>
                                    <Button
                                        variant="danger"
                                        icon={<Trash2 size={16} />}
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        Delete All Data
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Delete All Data"
                size="small"
            >
                <div className="settings-delete-confirm">
                    <div className="settings-delete-confirm__icon">
                        <AlertCircle size={48} color="var(--error)" />
                    </div>
                    <h3>Are you absolutely sure?</h3>
                    <p>
                        This action cannot be undone. This will permanently delete all your tasks,
                        settings, and analytics data.
                    </p>
                    <div className="settings-delete-confirm__actions">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteAllData}
                        >
                            Yes, delete everything
                        </Button>
                    </div>
                </div>
            </Modal>
        </Modal>
    );
};

export default SettingsPanel;