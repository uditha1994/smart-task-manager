import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ data }) => {
    const colors = [
        '#3b82f6', // Blue
        '#8b5cf6', // Purple
        '#ef4444', // Red
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#6b7280'  // Gray
    ];

    const chartData = {
        labels: Object.keys(data).map(key =>
            key.charAt(0).toUpperCase() + key.slice(1)
        ),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: colors.slice(0, Object.keys(data).length),
                borderColor: colors.slice(0, Object.keys(data).length),
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverOffset: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    color: 'var(--text-secondary)',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '60%'
    };

    if (Object.keys(data).length === 0) {
        return (
            <div className="chart-empty">
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div style={{ height: '250px', width: '100%' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default CategoryChart;