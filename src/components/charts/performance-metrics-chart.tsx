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

interface PerformanceMetricsChartProps {
  completionRate: number;
  averageDaysToComplete: number;
  totalTasks: number;
  overdueCount: number;
}

// Utility to get computed CSS color values
const getComputedCSSColor = (cssVar: string): string => {
  if (typeof window === 'undefined') return '#ffffff';
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const hslValue = computedStyle.getPropertyValue(cssVar).trim();
  
  if (hslValue) {
    return `hsl(${hslValue})`;
  }
  
  // Fallback colors
  if (cssVar.includes('foreground')) return '#ffffff';
  if (cssVar.includes('background')) return '#000000';
  if (cssVar.includes('border')) return '#334155';
  if (cssVar.includes('muted')) return '#64748b';
  return '#ffffff';
};

export const PerformanceMetricsChart = ({ 
  completionRate, 
  averageDaysToComplete, 
  totalTasks,
  overdueCount 
}: PerformanceMetricsChartProps) => {
  const [colors, setColors] = useState({
    foreground: '#ffffff',
    background: '#000000',
    border: '#334155',
    muted: '#64748b',
    popover: '#000000',
    popoverForeground: '#ffffff',
  });

  useEffect(() => {
    setColors({
      foreground: getComputedCSSColor('--foreground'),
      background: getComputedCSSColor('--background'),
      border: getComputedCSSColor('--border'),
      muted: getComputedCSSColor('--muted'),
      popover: getComputedCSSColor('--popover'),
      popoverForeground: getComputedCSSColor('--popover-foreground'),
    });
  }, []);

  const efficiency = totalTasks > 0 ? Math.max(0, 100 - (overdueCount / totalTasks) * 100) : 100;
  const speedScore = Math.max(0, 100 - Math.min(averageDaysToComplete * 5, 100)); // Normalize speed

  const performanceData = {
    labels: ['Completion Rate', 'Efficiency', 'Speed Score'],
    datasets: [
      {
        data: [completionRate, Math.round(efficiency), Math.round(speedScore)],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green for completion
          'rgba(59, 130, 246, 0.8)', // Blue for efficiency
          'rgba(251, 191, 36, 0.8)', // Yellow for speed
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(251, 191, 36, 0.9)',
        ],
        hoverBorderWidth: 3,
      },
      {
        data: [100 - completionRate, 100 - Math.round(efficiency), 100 - Math.round(speedScore)],
        backgroundColor: [
          colors.muted + '4D', // 30% opacity
          colors.muted + '4D',
          colors.muted + '4D',
        ],
        borderColor: [
          colors.border,
          colors.border,
          colors.border,
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        filter: function(tooltipItem) {
          return tooltipItem.datasetIndex === 0;
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    cutout: '75%',
    rotation: -90,
    circumference: 180,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="space-y-6">
      <div className="h-40 w-full relative">
        <Doughnut data={performanceData} options={options} />
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</div>
          <div className="text-xs font-medium text-muted-foreground">Completion Rate</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(efficiency)}%</div>
          <div className="text-xs font-medium text-muted-foreground">Efficiency</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{Math.round(speedScore)}%</div>
          <div className="text-xs font-medium text-muted-foreground">Speed Score</div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Average completion time:</span>
          <span className="font-medium text-foreground">{averageDaysToComplete} days</span>
        </div>
        <div className="flex justify-between">
          <span>Overdue tasks:</span>
          <span className="font-medium text-foreground">{overdueCount} of {totalTasks}</span>
        </div>
      </div>
    </div>
  );
}; 