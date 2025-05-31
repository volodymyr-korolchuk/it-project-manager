"use client";

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AssigneeWorkloadChartProps {
  data: { [assigneeId: string]: number };
  assigneeNames?: { [assigneeId: string]: string };
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
  return '#ffffff';
};

export const AssigneeWorkloadChart = ({ 
  data, 
  assigneeNames = {} 
}: AssigneeWorkloadChartProps) => {
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

  const sortedData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10); // Show top 10 assignees

  const chartData = {
    labels: sortedData.map(([assigneeId]) => 
      assigneeNames[assigneeId] || `User ${assigneeId.slice(0, 8)}`
    ),
    datasets: [
      {
        label: 'Tasks Assigned',
        data: sortedData.map(([, count]) => count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(245, 101, 101, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(34, 197, 94, 0.9)',
          'rgba(251, 191, 36, 0.9)',
          'rgba(236, 72, 153, 0.9)',
          'rgba(139, 92, 246, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(6, 182, 212, 0.9)',
          'rgba(245, 101, 101, 0.9)',
          'rgba(124, 58, 237, 0.9)',
          'rgba(16, 185, 129, 0.9)',
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
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
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const value = context.parsed.x;
            return `Tasks assigned: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: colors.border,
          lineWidth: 1,
        },
        ticks: {
          color: colors.foreground,
          font: {
            size: 12,
            weight: 500,
          },
          stepSize: 1,
        },
        border: {
          color: colors.border,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors.foreground,
          font: {
            size: 12,
            weight: 500,
          },
        },
        border: {
          color: colors.border,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
  };

  if (sortedData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">No assigned tasks</div>
          <div className="text-sm text-muted-foreground">Tasks will appear here when assigned to team members</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}; 