import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, AlertTriangle } from 'lucide-react';
import './ProductivityScore.css';

const ProductivityScore = ({ score, tasks, analytics }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--error)';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Improvement';
    };

    const getInsights = () => {
        const insights = [];
        const overdueTasks = tasks.filter(task =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== 'completed'
        ).length;

        const completedThisWeek = tasks.filter(task => {
            if (!task.completedAt) return false;
            const completedDate = new Date(task.completedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return completedDate >= weekAgo;
        }).length;

        if (overdueTasks > 0) {
            insights.push({
                type: 'warning',
                icon: AlertTriangle,
                message: `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}`
            });
        }

        if (completedThisWeek >= 5) {
            insights.push({
                type: 'success',
                icon: Target,
                message: `Great job! You completed ${completedThisWeek} tasks this week`
            });
        }

        if (score > 75) {
            insights.push({
                type: 'success',
                icon: TrendingUp,
                message: 'Your productivity is trending upward!'
            });
        }

        return insights;
    };

    const insights = getInsights();

    return (
        <div className="productivity-score">
            <div className="productivity-score__header">
                <h3 className="productivity-score__title">Productivity Overview</h3>
            </div>

            <div className="productivity-score__content">
                <div className="productivity-score__main">
                    <div className="productivity-score__circle">
                        <svg className="productivity-score__svg" viewBox="0 0 100 100">
                            <circle
                                className="productivity-score__bg"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="var(--bg-tertiary)"
                                strokeWidth="8"
                            />
                            <motion.circle
                                className="productivity-score__progress"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={getScoreColor(score)}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                                animate={{
                                    strokeDashoffset: 2 * Math.PI * 45 * (1 - score / 100)
                                }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="productivity-score__value">
                            <motion.span
                                className="productivity-score__number"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {score}%
                            </motion.span>
                            <span className="productivity-score__label">
                                {getScoreLabel(score)}
                            </span>
                        </div>
                    </div>

                    <div className="productivity-score__stats">
                        <div className="productivity-score__stat">
                            <div className="productivity-score__stat-value">
                                {analytics?.completedTasks || 0}
                            </div>
                            <div className="productivity-score__stat-label">Completed</div>
                        </div>
                        <div className="productivity-score__stat">
                            <div className="productivity-score__stat-value">
                                {analytics?.pendingTasks || 0}
                            </div>
                            <div className="productivity-score__stat-label">Pending</div>
                        </div>
                        <div className="productivity-score__stat">
                            <div className="productivity-score__stat-value">
                                {analytics?.totalTasks || 0}
                            </div>
                            <div className="productivity-score__stat-label">Total</div>
                        </div>
                    </div>
                </div>

                {insights.length > 0 && (
                    <div className="productivity-score__insights">
                        <h4 className="productivity-score__insights-title">Insights</h4>
                        <div className="productivity-score__insights-list">
                            {insights.map((insight, index) => (
                                <motion.div
                                    key={index}
                                    className={`productivity-insight productivity-insight--${insight.type}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                >
                                    <insight.icon size={16} />
                                    <span>{insight.message}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductivityScore;