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

interface PerformanceMetricsChartProps {
  completionRate: number;
  averageDaysToComplete: number;
  totalTasks: number;
  overdueCount: number;
}

export const PerformanceMetricsChart = ({ 
  completionRate, 
  averageDaysToComplete, 
  totalTasks,
  overdueCount 
}: PerformanceMetricsChartProps) => {
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
          'rgba(229, 231, 235, 0.3)',
          'rgba(229, 231, 235, 0.3)',
          'rgba(229, 231, 235, 0.3)',
        ],
        borderColor: [
          'rgba(229, 231, 235, 0.5)',
          'rgba(229, 231, 235, 0.5)',
          'rgba(229, 231, 235, 0.5)',
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
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
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
          <div className="text-2xl font-bold text-emerald-600">{completionRate}%</div>
          <div className="text-xs text-muted-foreground">Completion Rate</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-blue-600">{Math.round(efficiency)}%</div>
          <div className="text-xs text-muted-foreground">Efficiency</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-yellow-600">{Math.round(speedScore)}%</div>
          <div className="text-xs text-muted-foreground">Speed Score</div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Average completion time:</span>
          <span className="font-medium">{averageDaysToComplete} days</span>
        </div>
        <div className="flex justify-between">
          <span>Overdue tasks:</span>
          <span className="font-medium">{overdueCount} of {totalTasks}</span>
        </div>
      </div>
    </div>
  );
}; 