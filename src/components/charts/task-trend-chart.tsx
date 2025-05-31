"use client";

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

interface TaskTrendChartProps {
  data: Array<{
    month: string;
    tasks: number;
    completed: number;
  }>;
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

export const TaskTrendChart = ({ data }: TaskTrendChartProps) => {
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
    labels: data.map(item => {
      const date = new Date(item.month + '-01');
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Tasks Created',
        data: data.map(item => item.tasks),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: colors.background,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: colors.background,
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Tasks Completed',
        data: data.map(item => item.completed),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: colors.background,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointHoverBorderColor: colors.background,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: 600,
          },
          color: colors.foreground,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: colors.popover,
        titleColor: colors.popoverForeground,
        bodyColor: colors.popoverForeground,
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        mode: 'index',
        intersect: false,
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
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} tasks`;
          },
        },
      },
    },
    scales: {
      x: {
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
        },
        border: {
          color: colors.border,
        },
      },
      y: {
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
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      },
      point: {
        hoverBorderWidth: 3,
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}; 