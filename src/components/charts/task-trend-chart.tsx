"use client";

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

export const TaskTrendChart = ({ data }: TaskTrendChartProps) => {
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
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: '#ffffff',
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
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointHoverBorderColor: '#ffffff',
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
            size: 12,
            weight: 500,
          },
          color: 'hsl(var(--foreground))',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        mode: 'index',
        intersect: false,
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
          color: 'hsl(var(--border))',
          lineWidth: 1,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11,
          },
        },
        border: {
          color: 'hsl(var(--border))',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(var(--border))',
          lineWidth: 1,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11,
          },
          stepSize: 1,
        },
        border: {
          color: 'hsl(var(--border))',
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