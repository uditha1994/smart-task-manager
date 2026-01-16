import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Target,
    Clock,
    Award,
    Calendar,
    BarChart3
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import { taskService } from '../../../services/taskService';
import CompletionChart from './CompletionChart';
import CategoryChart from './CategoryChart';
import ProductivityScore from './ProductivityScore';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = ({ tasks }) => {
    const [analytics, setAnalytics] = useState(null);
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        const analyticsData = taskService.getAnalytics();
        setAnalytics(analyticsData);
    }, [tasks]);

    const getProductivityScore = () => {
        if (!analytics || analytics.totalTasks === 0) return 0;
        return Math.round((analytics.completedTasks / analytics.totalTasks) * 100);
    };

    const getCompletionRate = () => {
        const completedToday = tasks.filter(task => {
            const today = new Date().toISOString().split('T')[0];
            return task.completedAt && task.completedAt.split('T')[0] === today;
        }).length;
        return completedToday;
    };

    const getAverageCompletionTime = () => {
        const completedTasks = tasks.filter(task => task.completedAt && task.actualTime > 0);
        if (completedTasks.length === 0) return 0;

        const totalTime = completedTasks.reduce((sum, task) => sum + task.actualTime, 0);
        return (totalTime / completedTasks.length).toFixed(1);
    };

    const stats = [
        {
            title: 'Total Tasks',
            value: analytics?.totalTasks || 0,
            icon: Target,
            color: 'var(--accent-primary)',
            change: '+12%'
        },
        {
            title: 'Completed Today',
            value: getCompletionRate(),
            icon: Award,
            color: 'var(--success)',
            change: '+5%'
        },
        {
            title: 'Productivity Score',
            value: `${getProductivityScore()}%`,
            icon: TrendingUp,
            color: 'var(--warning)',
            change: '+8%'
        },
        {
            title: 'Avg. Completion Time',
            value: `${getAverageCompletionTime()}h`,
            icon: Clock,
            color: 'var(--accent-secondary)',
            change: '-15%'
        }
    ];

    return (
        <div className="analytics-dashboard">
            <motion.div
                className="analytics-dashboard__header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="analytics-dashboard__title">
                    <BarChart3 size={24} />
                    <h2>Analytics Dashboard</h2>
                </div>

                <div className="analytics-dashboard__controls">
                    <select
                        className="analytics-dashboard__time-range"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="quarter">Last 3 months</option>
                    </select>
                </div>
            </motion.div>

            <div className="analytics-dashboard__stats">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="analytics-stat" hover padding="medium">
                            <div className="analytics-stat__header">
                                <div
                                    className="analytics-stat__icon"
                                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                >
                                    <stat.icon size={20} />
                                </div>
                                <span className="analytics-stat__change analytics-stat__change--positive">
                                    {stat.change}
                                </span>
                            </div>
                            <div className="analytics-stat__content">
                                <h3 className="analytics-stat__value">{stat.value}</h3>
                                <p className="analytics-stat__title">{stat.title}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="analytics-dashboard__charts">
                <motion.div
                    className="analytics-dashboard__chart-container"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card padding="large">
                        <h3 className="analytics-chart__title">Completion Trends</h3>
                        <CompletionChart data={analytics?.completionTrends || []} />
                    </Card>
                </motion.div>

                <motion.div
                    className="analytics-dashboard__chart-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card padding="large">
                        <h3 className="analytics-chart__title">Category Distribution</h3>
                        <CategoryChart data={analytics?.categoryDistribution || {}} />
                    </Card>
                </motion.div>
            </div>

            <motion.div
                className="analytics-dashboard__productivity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card padding="large">
                    <ProductivityScore
                        score={getProductivityScore()}
                        tasks={tasks}
                        analytics={analytics}
                    />
                </Card>
            </motion.div>
        </div>
    );
};

export default AnalyticsDashboard;