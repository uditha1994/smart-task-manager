import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CompletionChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => format(new Date(item.date), 'MMM dd')),
        datasets: [
            {
                label: 'Tasks Completed',
                data: data.map(item => item.completed),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (context) => {
                        return `${context[0].label}`;
                    },
                    label: (context) => {
                        return `${context.parsed.y} tasks completed`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: 'var(--text-muted)',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'var(--border-color)',
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: 'var(--text-muted)',
                    font: {
                        size: 12
                    },
                    stepSize: 1
                }
            }
        },
        elements: {
            point: {
                hoverBackgroundColor: 'rgb(59, 130, 246)'
            }
        }
    };

    return (
        <div style={{ height: '250px', width: '100%' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default CompletionChart;