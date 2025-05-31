"use client";

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskStatusChartProps {
  data: {
    BACKLOG: number;
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    DONE: number;
  };
}

export const TaskStatusChart = ({ data }: TaskStatusChartProps) => {
  const chartData = {
    labels: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'],
    datasets: [
      {
        data: [
          data.BACKLOG,
          data.TODO,
          data.IN_PROGRESS,
          data.IN_REVIEW,
          data.DONE,
        ],
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)', // Pink for Backlog
          'rgba(239, 68, 68, 0.8)',  // Red for Todo
          'rgba(251, 191, 36, 0.8)', // Yellow for In Progress
          'rgba(59, 130, 246, 0.8)', // Blue for In Review
          'rgba(34, 197, 94, 0.8)',  // Green for Done
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(236, 72, 153, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(251, 191, 36, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(34, 197, 94, 0.9)',
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
          color: 'hsl(var(--foreground))',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} tasks (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <div className="relative h-80 w-full">
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{total}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </div>
      </div>
    </div>
  );
}; 