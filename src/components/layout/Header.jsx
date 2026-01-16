import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Settings, BarChart3, Home } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import './Header.css';

const Header = ({ onSettingsClick, onAnalyticsClick, activeView }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.header
            className="header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="header__container">
                <div className="header__brand">
                    <motion.div
                        className="header__logo"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        📋
                    </motion.div>
                    <h1 className="header__title">Smart Task Manager</h1>
                </div>

                <nav className="header__nav">
                    <Button
                        variant={activeView === 'analytics' ? 'primary' : 'ghost'}
                        size="small"
                        icon={activeView === 'analytics' ? <Home size={18} /> : <BarChart3 size={18} />}
                        onClick={onAnalyticsClick}
                    >
                        {activeView === 'analytics' ? 'Home' : 'Analytics'}
                    </Button>

                    <Button
                        variant="ghost"
                        size="small"
                        icon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </Button>

                    <Button
                        variant="ghost"
                        size="small"
                        icon={<Settings size={18} />}
                        onClick={onSettingsClick}
                    >
                        Settings
                    </Button>
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;