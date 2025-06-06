"use client";

import React, { useEffect, useState } from 'react';
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

// Utility to get computed CSS color values
const getComputedCSSColor = (cssVar: string): string => {
  if (typeof window === 'undefined') return '#ffffff';
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const hslValue = computedStyle.getPropertyValue(cssVar).trim();
  
  if (hslValue) {
    // Convert HSL to a format Chart.js understands
    return `hsl(${hslValue})`;
  }
  
  // Fallback colors
  if (cssVar.includes('foreground')) return '#ffffff';
  if (cssVar.includes('background')) return '#000000';
  if (cssVar.includes('border')) return '#334155';
  return '#ffffff';
};

export const TaskStatusChart = ({ data }: TaskStatusChartProps) => {
  const [colors, setColors] = useState({
    foreground: '#ffffff',
    background: '#000000',
    border: '#334155',
    popover: '#000000',
    popoverForeground: '#ffffff',
  });

  useEffect(() => {
    setColors({
      foreground: getComputedCSSColor('--foreground'),
      background: getComputedCSSColor('--background'),
      border: getComputedCSSColor('--border'),
      popover: getComputedCSSColor('--popover'),
      popoverForeground: getComputedCSSColor('--popover-foreground'),
    });
  }, []);

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
          'rgba(107, 114, 128, 0.8)', // Gray for Backlog
          'rgba(220, 38, 38, 0.8)',   // Red for Todo
          'rgba(202, 138, 4, 0.8)',   // Yellow for In Progress
          'rgba(147, 51, 234, 0.8)',  // Purple for In Review
          'rgba(16, 185, 129, 0.8)',  // Green for Done
        ],
        borderColor: [
          'rgba(107, 114, 128, 1)',
          'rgba(220, 38, 38, 1)',
          'rgba(202, 138, 4, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(107, 114, 128, 0.9)',
          'rgba(220, 38, 38, 0.9)',
          'rgba(202, 138, 4, 0.9)',
          'rgba(147, 51, 234, 0.9)',
          'rgba(16, 185, 129, 0.9)',
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
          color: colors.foreground,
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: colors.popover,
        titleColor: colors.popoverForeground,
        bodyColor: colors.popoverForeground,
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
          weight: 500,
        },
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
        <div className="text-center bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
          <div className="text-2xl font-bold text-foreground">{total}</div>
          <div className="text-sm font-medium text-muted-foreground">Total Tasks</div>
        </div>
      </div>
    </div>
  );
}; 